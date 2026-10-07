import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, borderRadius } from "@/theme/theme";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { fetch } from "expo/fetch";
import JSZip from "jszip";

// --- Types ---
interface ATSResult {
  atsScore: number;
  missingKeywordsCount: number;
  formatGrade: string;
  breakdown: {
    formatting: number;
    keywords: number;
    projects: number;
  };
  suggestions: Array<{
    title: string;
    priority: "High" | "Medium" | "Low";
  }>;
}

// --- Logging Utility for Testing Phase ---
const logExtractionResult = (fileName: string, extractedText: string) => {
  console.log(`\n--- EXTRACTION LOG: ${fileName} ---`);
  console.log(`Length: ${extractedText.length} chars`);
  console.log(`Snippet: ${extractedText.substring(0, 200)}...`);
  console.log(`Full Text Stored for Comparison:`, extractedText);
  // In a real app, you might save this to AsyncStorage or a local DB for later comparison
};

export default function ResumeSkillsScreen() {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<ATSResult | null>(null);
  const [extractedTextLog, setExtractedTextLog] = useState<string>(""); // Store for debugging

  /**
   * Extracts readable ASCII/UTF-8 text blocks from a PDF ArrayBuffer
   * NOTE: This is a basic parser. For production, use a dedicated library or Cloud OCR.
   */
  const extractTextFromPdf = (arrayBuffer: ArrayBuffer): string => {
    try {
      const bytes = new Uint8Array(arrayBuffer);
      let rawString = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        rawString += String.fromCharCode(bytes[i]);
      }

      const textBlocks: string[] = [];
      const regex = /BT[\s\S]*?ET/g;
      let match;
      while ((match = regex.exec(rawString)) !== null) {
        const block = match[0];
        const matches = block.match(/\(([^)]+)\)/g);
        if (matches) {
          const cleanedBlock = matches.map((m) => m.slice(1, -1)).join(" ");
          textBlocks.push(cleanedBlock);
        }
      }

      if (textBlocks.length > 0) {
        return textBlocks.join("\n").replace(/\s+/g, " ").trim();
      }
      
      // Fallback for simple text-based PDFs
      return rawString.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new Error("Could not parse PDF content");
    }
  };

  const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const xmlFile = zip.file("word/document.xml");
      if (!xmlFile) throw new Error("Invalid .docx file structure");
      
      const xmlText = await xmlFile.async("text");
      // Improved regex to handle newlines better
      const plainText = xmlText
        .replace(/<w:p[^>]*>/g, "\n") 
        .replace(/<[^>]+>/g, " ") 
        .replace(/\s+/g, " ") 
        .trim();
      return plainText;
    } catch (error) {
      console.error("DOCX parsing error:", error);
      throw new Error("Could not parse DOCX content");
    }
  };

  const extractTextFromFile = async (
    uri: string,
    fileName: string,
    mimeType: string
  ): Promise<string> => {
    const isDocx = fileName.toLowerCase().endsWith(".docx") || mimeType.includes("wordprocessingml");
    const isPdf = fileName.toLowerCase().endsWith(".pdf") || mimeType.includes("pdf");

    const response = await fetch(uri);
    
    if (!isDocx && !isPdf) {
      return await response.text();
    }

    const arrayBuffer = await response.arrayBuffer();

    if (isDocx) return await extractTextFromDocx(arrayBuffer);
    if (isPdf) return extractTextFromPdf(arrayBuffer);
    
    return "";
  };

  const callAiInferenceApi = async (resumeText: string): Promise<ATSResult> => {
    try {
      // REPLACE WITH YOUR ACTUAL API CALL
      // const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { ... });
      
      // Simulated Delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock Response for Demo
      return {
        atsScore: 85,
        missingKeywordsCount: 5,
        formatGrade: "A",
        breakdown: { formatting: 92, keywords: 80, projects: 83 },
        suggestions: [
          { title: "Quantify achievements with clear percentages", priority: "High" },
          { title: "Include missing keywords: TypeScript, Docker", priority: "High" },
        ],
      };
    } catch (error) {
      console.error("AI API Error:", error);
      throw new Error("Failed to analyze resume with AI");
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setUploading(true);
      const fileAsset = result.assets[0];
      setSelectedFile(fileAsset);

      // 1. Extract Text
      const extractedText = await extractTextFromFile(
        fileAsset.uri,
        fileAsset.name,
        fileAsset.mimeType || ""
      );

      // 2. Log for Testing Phase
      logExtractionResult(fileAsset.name, extractedText);
      setExtractedTextLog(extractedText); // Save to state if you want to display it for debugging

      if (!extractedText || extractedText.length < 50) {
        Alert.alert("Extraction Warning", "Could not extract enough text. Is this a scanned image?");
        return;
      }

      // 3. Analyze with AI
      const aiResponse = await callAiInferenceApi(extractedText);
      setAnalysis(aiResponse);

    } catch (error) {
      Alert.alert("Upload Failed", "An error occurred while processing the document.");
      console.error(error);
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
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Get your ATS Score</Text>
          <Text style={[styles.heroDescription, { color: theme.textSecondary }]}>
            Upload your resume to see how well it matches industry standards.
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
              <ActivityIndicator color={theme.primary} />
            ) : (
              <>
                <Text style={[styles.dropZoneTitle, { color: theme.textPrimary }]}>Tap to Upload Resume</Text>
                <Text style={[styles.dropZoneSubtitle, { color: theme.textMuted }]}>PDF, DOCX, or TXT</Text>
              </>
            )}
          </Pressable>
          {selectedFile && (
            <Text style={[styles.dropZoneSubtitle, { color: theme.textMuted, marginTop: spacing.sm }]}>
              Selected: {selectedFile.name}
            </Text>
          )}
        </View>

        {/* Results Section */}
        {analysis && (
          <>
            <View style={styles.gridRow}>
              <View style={[styles.gridCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>ATS Score</Text>
                <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{analysis.atsScore}</Text>
              </View>
              <View style={[styles.gridCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Format Grade</Text>
                <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{analysis.formatGrade}</Text>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: spacing.md }]}>Suggestions</Text>
              {analysis.suggestions.map((s, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={[styles.itemText, { color: theme.textPrimary }]}>{s.title}</Text>
                  <Text style={[styles.itemStatus, { color: s.priority === 'High' ? 'red' : theme.textSecondary }]}>{s.priority}</Text>
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
  card: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl },
  categoryLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: spacing.xs },
  heroTitle: { fontSize: 26, fontWeight: "800", lineHeight: 32, marginBottom: spacing.sm },
  heroDescription: { fontSize: 14, lineHeight: 20 },
  dropZone: { borderWidth: 1, borderStyle: "dashed", borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: "center", minHeight: 100, justifyContent: 'center' },
  dropZoneTitle: { fontSize: 16, fontWeight: "700", marginBottom: spacing.xs },
  dropZoneSubtitle: { fontSize: 13, textAlign: "center" },
  gridRow: { flexDirection: "row", gap: spacing.md },
  gridCard: { flex: 1, borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, alignItems: 'center' },
  metricLabel: { fontSize: 13, fontWeight: "500", marginBottom: spacing.xs },
  metricValue: { fontSize: 28, fontWeight: "800" },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  listItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm },
  itemText: { fontSize: 14, fontWeight: "500", flex: 1, marginRight: spacing.md },
  itemStatus: { fontSize: 12, fontWeight: "600" },
});