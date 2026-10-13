import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  StatusBar,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, borderRadius } from "@/theme/theme";
import * as DocumentPicker from "expo-document-picker";
import { fetch } from "expo/fetch";
import JSZip from "jszip";

// --- Types ---
export interface SectionImprovement {
  section: string;
  currentIssue: string;
  suggestedFix: string;
  priority: "High" | "Medium" | "Low";
}

export interface ATSResult {
  atsScore: number;
  overallSummary: string;
  missingKeywords: string[];
  sectionImprovements: SectionImprovement[];
}

// --- API Configuration & Fallback Logic ---
// Note: Adjust model names if "qwen-3.8-27b" or "iopenai/gpt-oss-120b" are updated in provider registries.
// Using qwen-2.5-32b as the current stable equivalent for Qwen on these platforms.
const DEFAULT_MODEL = "qwen-2.5-32b"; // Replace with "qwen-3.8-27b" if/when officially available
const FALLBACK_MODEL = "openai/gpt-oss-120b"; 

const getApiConfigs = () => {
  const groqKeys = (process.env.EXPO_PUBLIC_GROQ_KEYS || "").split(",").filter(Boolean);
  const cerebrasKeys = (process.env.EXPO_PUBLIC_CEREBRAS_KEYS || "").split(",").filter(Boolean);

  return [
    // Tier 1: Default Model
    { provider: "Groq", baseUrl: "https://api.groq.com/openai/v1/chat/completions", keys: groqKeys, model: DEFAULT_MODEL },
    { provider: "Cerebras", baseUrl: "https://api.cerebras.ai/v1/chat/completions", keys: cerebrasKeys, model: DEFAULT_MODEL },
    // Tier 2: Fallback Model
    { provider: "Groq (Fallback)", baseUrl: "https://api.groq.com/openai/v1/chat/completions", keys: groqKeys, model: FALLBACK_MODEL },
    { provider: "Cerebras (Fallback)", baseUrl: "https://api.cerebras.ai/v1/chat/completions", keys: cerebrasKeys, model: FALLBACK_MODEL },
  ];
};

const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const xmlFile = zip.file("word/document.xml");
    if (!xmlFile) throw new Error("Invalid .docx file structure");
    
    const xmlText = await xmlFile.async("text");
    return xmlText
      .replace(/<w:p[^>]*>/g, "\n") 
      .replace(/<[^>]+>/g, " ") 
      .replace(/\s+/g, " ") 
      .trim();
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error("Could not parse DOCX content. Ensure it is not corrupted or password-protected.");
  }
};

const callAiWithFallback = async (resumeText: string): Promise<ATSResult> => {
  const configs = getApiConfigs();
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) parser and resume reviewer. 
Analyze the following resume text and provide feedback in STRICT, VALID JSON format. 
Do not include markdown formatting like \`\`\`json. Output ONLY the JSON object.

Required JSON Structure:
{
  "atsScore": number (0-100),
  "overallSummary": "string (1-2 sentences summarizing resume strength)",
  "missingKeywords": ["string", "string"],
  "sectionImprovements": [
    {
      "section": "string (e.g., 'Experience', 'Education', 'Projects')",
      "currentIssue": "string (specific problem found)",
      "suggestedFix": "string (actionable advice with an example)",
      "priority": "High" | "Medium" | "Low"
    }
  ]
}

Resume Text:
"""
${resumeText}
"""`;

  for (const config of configs) {
    for (const apiKey of config.keys) {
      try {
        console.log(`Attempting API call: ${config.provider} with model ${config.model}`);
        
        const response = await fetch(config.baseUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: config.model,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: "Analyze this resume and return the JSON." }
            ],
            temperature: 0.2, // Low temperature for consistent, deterministic JSON
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Clean up markdown wrappers if the model ignores the "no markdown" rule
        content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        
        const parsedResult = JSON.parse(content) as ATSResult;
        console.log(`✅ Success with ${config.provider} (${config.model})`);
        return parsedResult;

      } catch (error) {
        console.warn(`❌ Failed with ${config.provider} (${config.model}):`, error);
        // Continue to next key/config
      }
    }
  }

  throw new Error("All AI API providers and fallback keys failed. Please check your environment variables.");
};

export default function ResumeSkillsScreen() {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<ATSResult | null>(null);
  const [extractedTextLog, setExtractedTextLog] = useState<string>("");

  const handleFileUpload = async () => {
    try {
      // STRICTLY DOCX ONLY as requested
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setUploading(true);
      const fileAsset = result.assets[0];
      setSelectedFile(fileAsset);

      // 1. Fetch and Extract
      const response = await fetch(fileAsset.uri);
      const arrayBuffer = await response.arrayBuffer();
      const extractedText = await extractTextFromDocx(arrayBuffer);

      // 2. Log for Testing Phase (as requested)
      console.log(`\n--- EXTRACTION LOG: ${fileAsset.name} ---`);
      console.log(`Length: ${extractedText.length} chars`);
      setExtractedTextLog(extractedText); // Store in state for debugging UI if needed

      if (!extractedText || extractedText.length < 50) {
        Alert.alert("Extraction Warning", "Could not extract enough text. The DOCX might be empty or contain only images.");
        return;
      }

      // 3. Analyze with Fallback AI
      const aiResponse = await callAiWithFallback(extractedText);
      setAnalysis(aiResponse);

    } catch (error: any) {
      Alert.alert("Processing Failed", error.message || "An error occurred while processing the document.");
      console.error("Upload/Analysis error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={systemColorScheme === "light" ? "dark-content" : "light-content"} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>RESUME ANALYZER</Text>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Optimize your DOCX Resume</Text>
          <Text style={[styles.heroDescription, { color: theme.textSecondary }]}>
            Get an instant ATS score and section-by-section actionable feedback.
          </Text>
        </View>

        {/* Upload Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Pressable
            disabled={uploading}
            style={[styles.dropZone, { borderColor: theme.dashedBorder }]}
            onPress={handleFileUpload}
          >
            {uploading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.dropZoneSubtitle, { color: theme.textMuted, marginTop: spacing.sm }]}>
                  Analyzing with AI...
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.dropZoneTitle, { color: theme.textPrimary }]}>Tap to Upload Resume</Text>
                <Text style={[styles.dropZoneSubtitle, { color: theme.textMuted }]}>.docx format only</Text>
              </>
            )}
          </Pressable>
          {selectedFile && !uploading && (
            <Text style={[styles.dropZoneSubtitle, { color: theme.success, marginTop: spacing.sm, fontWeight: "600" }]}>
              ✓ {selectedFile.name}
            </Text>
          )}
        </View>

        {/* Results Section */}
        {analysis && (
          <>
            {/* ATS Score Card */}
            <View style={[styles.scoreCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
              <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>Overall ATS Score</Text>
              <View style={styles.scoreCircle}>
                <Text style={[styles.scoreValue, { color: analysis.atsScore >= 80 ? theme.success : analysis.atsScore >= 60 ? theme.warning : 'red' }]}>
                  {analysis.atsScore}
                </Text>
                <Text style={[styles.scoreTotal, { color: theme.textMuted }]}>/ 100</Text>
              </View>
              <Text style={[styles.summaryText, { color: theme.textPrimary }]}>
                {analysis.overallSummary}
              </Text>
              
              {analysis.missingKeywords.length > 0 && (
                <View style={styles.keywordContainer}>
                  <Text style={[styles.keywordLabel, { color: theme.textSecondary }]}>Missing Keywords:</Text>
                  <View style={styles.keywordRow}>
                    {analysis.missingKeywords.map((kw, i) => (
                      <View key={i} style={[styles.keywordBadge, { backgroundColor: theme.badgeBackground }]}>
                        <Text style={[styles.keywordText, { color: theme.badgeText }]}>{kw}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Section Improvements */}
            <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: spacing.md }]}>
                Section-by-Section Improvements
              </Text>
              {analysis.sectionImprovements.map((item, index) => (
                <View key={index} style={[styles.improvementItem, { borderBottomColor: theme.divider }]}>
                  <View style={styles.improvementHeader}>
                    <Text style={[styles.improvementSection, { color: theme.textPrimary }]}>{item.section}</Text>
                    <View style={[
                      styles.priorityBadge, 
                      { backgroundColor: item.priority === 'High' ? '#fee2e2' : item.priority === 'Medium' ? '#fef3c7' : '#dcfce7' }
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        { color: item.priority === 'High' ? '#991b1b' : item.priority === 'Medium' ? '#92400e' : '#166534' }
                      ]}>
                        {item.priority}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.issueText, { color: theme.textSecondary }]}>
                    <Text style={{ fontWeight: "600" }}>Issue: </Text>{item.currentIssue}
                  </Text>
                  <Text style={[styles.fixText, { color: theme.textPrimary }]}>
                    <Text style={{ fontWeight: "600" }}>Fix: </Text>{item.suggestedFix}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: spacing.lg, gap: spacing.lg },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.lg },
  categoryLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: spacing.xs },
  heroTitle: { fontSize: 24, fontWeight: "800", lineHeight: 30, marginBottom: spacing.xs },
  heroDescription: { fontSize: 14, lineHeight: 20 },
  dropZone: { borderWidth: 2, borderStyle: "dashed", borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: "center", minHeight: 120, justifyContent: 'center' },
  dropZoneTitle: { fontSize: 16, fontWeight: "700", marginBottom: spacing.xs },
  dropZoneSubtitle: { fontSize: 13, textAlign: "center" },
  loadingContainer: { alignItems: "center" },
  scoreCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: "center" },
  scoreLabel: { fontSize: 14, fontWeight: "600", marginBottom: spacing.md },
  scoreCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  scoreValue: { fontSize: 36, fontWeight: "900" },
  scoreTotal: { fontSize: 14, fontWeight: "600", position: 'absolute', bottom: 15 },
  summaryText: { fontSize: 15, lineHeight: 22, textAlign: "center", marginBottom: spacing.lg },
  keywordContainer: { width: '100%', alignItems: "center" },
  keywordLabel: { fontSize: 13, fontWeight: "600", marginBottom: spacing.sm },
  keywordRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.xs },
  keywordBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.md },
  keywordText: { fontSize: 12, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  improvementItem: { paddingVertical: spacing.md, borderBottomWidth: 1 },
  improvementHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  improvementSection: { fontSize: 16, fontWeight: "700" },
  priorityBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  priorityText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  issueText: { fontSize: 14, lineHeight: 20, marginBottom: spacing.xs },
  fixText: { fontSize: 14, lineHeight: 20 },
});