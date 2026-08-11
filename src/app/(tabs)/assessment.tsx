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
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, borderRadius } from "@/theme/theme";
import { useState, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
// import * as FileSystem from "expo-file-system";
import { File, Directory, Paths } from "expo-file-system";
import { fetch } from "expo/fetch";
// import * as MediaLibrary from "expo-media-library";
// import { requestPermissionsAsync } from "expo-media-library";
import JSZip from "jszip";

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

export default function ResumeSkillsScreen() {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<ATSResult | null>(null);

  /**
   * Mock call to simulate sending Base64 document payload to AI Provider/Backend
   * Replace this function with your actual backend fetch/axios call.
   */

  /*

  const extractTextFromFile = async (
    file: DocumentPicker.DocumentPickerAsset,
  ): Promise<string> => {
    try {
      if (!file.uri) {
        throw new Error("File URI is missing.");
      }

      // Fetch the file as an ArrayBuffer
      const response = await fetch(file.uri);
      const buffer = await response.arrayBuffer();

      // Convert ArrayBuffer to string (assuming UTF-8 encoding)
      const decoder = new TextDecoder("utf-8");
      const textContent = decoder.decode(buffer);
      console.log("Extracted text content:", textContent);
      return textContent;
    } catch (error) {
      console.error("Error extracting text from file:", error);
      throw error;
    }
  };

  const callAiInferenceApi = async (resumeText: string): Promise<any> => {
    
      
      resumeText = await extractTextFromFile(selectedFile as DocumentPicker.DocumentPickerAsset);
    // Example: Sending extracted text to Groq / Cerebras API or your Backend

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // or cerebras model
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `{You are an expert ATS (Applicant Tracking System) parser and resume reviewer.
        Analyze the following resume text and provide feedback in pure JSON format.

        JSON Structure required:
        {
          "atsScore": number (0-100),
          "missingKeywordsCount": number,
          "formatGrade": string (e.g. "A", "B+", "C"),
          "breakdown": {
            "formatting": number (0-100),
            "keywords": number (0-100),
            "projects": number (0-100)
          },
          "suggestions": [
            {
              "title": string,
              "priority": "High" | "Medium" | "Low"
            }
          ]
        }

        Resume Text:
        """
        {{RESUME_TEXT_HERE}}
        """}`,
            },
            {
              role: "user",
              content: `Analyze this resume text:\n\n${resumeText}`,
            },
          ],
        }),
      },
    );
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);

    // Simulated API response delay

    await new Promise((resolve) => setTimeout(resolve, 1));

    return {
      atsScore: 84,
      missingKeywordsCount: 6,
      formatGrade: "A-",
      breakdown: {
        formatting: 90,
        keywords: 78,
        projects: 82,
      },
      suggestions: [
        {
          title: "Quantify project outcomes with quantifiable metrics (%, $)",
          priority: "High",
        },
        {
          title:
            "Add missing industry keywords: React Native, TypeScript, CI/CD",
          priority: "High",
        },
        {
          title: "Ensure bullet points start with strong action verbs",
          priority: "Medium",
        },
      ],
    };
  };

  // import * as DocumentPicker from "expo-document-picker";

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      setUploading(true);

      const fileAsset = result.assets[0];
      const { uri, name, mimeType } = fileAsset;

      setSelectedFile(fileAsset);

      // 1. Fetch binary data using SDK 56 native fetch
      const response = await fetch(uri);
      const buffer = await response.arrayBuffer();

      // 2. Convert ArrayBuffer directly to Base64 (SDK 56 native compliant)
      const bytes = new Uint8Array(buffer);
      let binary = "";
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Content = btoa(binary);

      console.log("File Name:", name);
      console.log("Success! Base64 length:", base64Content.length);
      console.log("All data : ", result.assets[0].file?.text());
      // 3. Send file base64 data to AI endpoint
      // const aiResponse = await callAiInferenceApi(
      //   base64Content,
      //   name,
      //   mimeType || "application/pdf"
      // );

      // setAnalysis(aiResponse);

      callAiInferenceApi(base64Content)
        .then((aiResponse) => {
          setAnalysis(aiResponse);
          console.log("AI Response:", aiResponse);
        })
        .catch((error) => {
          console.error("Error calling AI API:", error);
          Alert.alert(
            "AI Processing Failed",
            "An error occurred while processing the resume.",
          );
        });
    } catch (error) {
      Alert.alert(
        "Upload Failed",
        "An error occurred while reading or parsing the document.",
      );
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  */

  /**
   * Extracts raw text from a .docx file buffer by reading its internal document.xml
   */
  const extractTextFromDocx = async (
    arrayBuffer: ArrayBuffer,
  ): Promise<string> => {
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const xmlFile = zip.file("word/document.xml");
      if (!xmlFile) {
        throw new Error("Invalid .docx file structure");
      }
      const xmlText = await xmlFile.async("text");

      // Remove XML tags to extract pure text content
      const plainText = xmlText
        .replace(/<w:p[^>]*>/g, "\n") // Replace paragraph tags with line breaks
        .replace(/<[^>]+>/g, " ") // Strip out all other XML tags
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      return plainText;
    } catch (error) {
      console.error("DOCX parsing error:", error);
      throw new Error("Could not parse DOCX content");
    }
  };

  /**
   * Extracts readable ASCII/UTF-8 text blocks from a PDF ArrayBuffer directly on mobile
   */
  const extractTextFromPdf = (arrayBuffer: ArrayBuffer): string => {
    try {
      const bytes = new Uint8Array(arrayBuffer);
      let rawString = "";

      // Convert bytes into string safely
      for (let i = 0; i < bytes.byteLength; i++) {
        rawString += String.fromCharCode(bytes[i]);
      }

      // Extract text enclosed between PDF text object delimiters: BT (Begin Text) and ET (End Text)
      const textBlocks: string[] = [];
      const regex = /BT[\s\S]*?ET/g;
      let match;

      while ((match = regex.exec(rawString)) !== null) {
        const block = match[0];
        // Extract text contained inside parentheses like (Sample Text)
        const matches = block.match(/\(([^)]+)\)/g);
        if (matches) {
          const cleanedBlock = matches.map((m) => m.slice(1, -1)).join(" ");
          textBlocks.push(cleanedBlock);
        }
      }

      if (textBlocks.length > 0) {
        return textBlocks.join("\n").replace(/\s+/g, " ").trim();
      }

      // Fallback: Strip non-printable ASCII characters if no BT/ET blocks matched
      return rawString
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new Error("Could not parse PDF content");
    }
  };

  /**
   * Main dispatcher to convert picked files directly into clean plain text
   */
  const extractTextFromFile = async (
    uri: string,
    fileName: string,
    mimeType: string,
  ): Promise<string> => {
    const isDocx =
      fileName.toLowerCase().endsWith(".docx") ||
      mimeType.includes("wordprocessingml");
    const isPdf =
      fileName.toLowerCase().endsWith(".pdf") || mimeType.includes("pdf");

    const response = await fetch(uri);

    // 1. Plain Text (.txt)
    if (!isDocx && !isPdf) {
      return await response.text();
    }

    // Fetch as ArrayBuffer for binary parsing (.docx & .pdf)
    const arrayBuffer = await response.arrayBuffer();

    // 2. DOCX parsing
    if (isDocx) {
      return await extractTextFromDocx(arrayBuffer);
    }

    // 3. PDF parsing
    if (isPdf) {
      return extractTextFromPdf(arrayBuffer);
    }

    return "";
  };

  const callAiInferenceApi = async (resumeText: string): Promise<ATSResult> => {
    // Example API Call to Groq using LLaMA-3 / Cerebras with pure text prompt:

    /*
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_GROQ_API_KEY`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an expert ATS (Applicant Tracking System) parser and resume reviewer.
              Analyze the following resume text and provide feedback in pure JSON format.

              JSON Structure required:
              {
                "atsScore": number (0-100),
                "missingKeywordsCount": number,
                "formatGrade": string (e.g. "A", "B+", "C"),
                "breakdown": {
                  "formatting": number (0-100),
                  "keywords": number (0-100),
                  "projects": number (0-100)
                },
                "suggestions": [
                  {
                    "title": string,
                    "priority": "High" | "Medium" | "Low"
                  }
                ]
              }`,
            },
            {
              role: "user",
              content: `Analyze this resume text and calculate the ATS score:\n\n${resumeText}`,
            },
          ],
        }),
      },
    );
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
    */

    // Simulated API response delay for project demo
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      atsScore: 85,
      missingKeywordsCount: 5,
      formatGrade: "A",
      breakdown: {
        formatting: 92,
        keywords: 80,
        projects: 83,
      },
      suggestions: [
        {
          title: "Quantify achievements with clear percentages and metrics",
          priority: "High",
        },
        {
          title:
            "Include missing target role keywords: TypeScript, Docker, CI/CD",
          priority: "High",
        },
        {
          title: "Keep bullet points concise and action-verb oriented",
          priority: "Medium",
        },
      ],
    };
  };

  const handleFileUpload = async () => {
    try {
      // 1. Pick PDF, DOCX, or TXT
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      setUploading(true);
      const fileAsset = result.assets[0];
      setSelectedFile(fileAsset);

      // 2. Extract plain text content directly on mobile
      const extractedText = await extractTextFromFile(
        fileAsset.uri,
        fileAsset.name,
        fileAsset.mimeType || "",
      );

      console.log("File picked:", fileAsset.name);
      console.log("Extracted text length:", extractedText.length);
      console.log("Extracted text snippet:", extractedText.substring(0, 150));

      if (!extractedText || extractedText.length < 20) {
        Alert.alert(
          "Text Extraction Warning",
          "Could not extract sufficient text from this file. Please ensure it is not a scanned image PDF.",
        );
        return;
      }

      // 3. Pass extracted text directly to AI inference
      const aiResponse = await callAiInferenceApi(extractedText);
      setAnalysis(aiResponse);
    } catch (error) {
      Alert.alert(
        "Upload Failed",
        "An error occurred while reading or parsing the document.",
      );
      console.error("Text extraction error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={
          systemColorScheme === "light" ? "dark-content" : "light-content"
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            RESUME
          </Text>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Upload a resume and get an ATS score.
          </Text>
          <Text
            style={[styles.heroDescription, { color: theme.textSecondary }]}
          >
            This screen combines resume processing and skill assessment entry
            points in one clear flow.
          </Text>
        </View>

        {/* Resume Upload Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Resume upload
            </Text>
            <View
              style={[styles.badge, { backgroundColor: theme.badgeBackground }]}
            >
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                PDF / DOCX
              </Text>
            </View>
          </View>

          {/* Dashed Drop Area */}
          <View style={[styles.dropZone, { borderColor: theme.dashedBorder }]}>
            <Text style={[styles.dropZoneTitle, { color: theme.textPrimary }]}>
              Drop or choose a resume file
            </Text>
            <Text style={[styles.dropZoneSubtitle, { color: theme.textMuted }]}>
              Supports .pdf, .doc, and .docx formats up to 10MB.
            </Text>

            <Pressable
              disabled={uploading}
              style={[
                styles.button,
                {
                  backgroundColor: uploading ? theme.textMuted : theme.primary,
                },
              ]}
              onPress={handleFileUpload}
            >
              {uploading ? (
                <ActivityIndicator color={theme.primaryButtonText} />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    { color: theme.primaryButtonText },
                  ]}
                >
                  Upload file
                </Text>
              )}
            </Pressable>

            {selectedFile && (
              <Text
                style={[
                  styles.dropZoneSubtitle,
                  { color: theme.textMuted, marginTop: spacing.sm },
                ]}
              >
                Selected: {selectedFile.name}
              </Text>
            )}
          </View>
        </View>

        {/* Top-Level Metrics Grid */}
        <View style={styles.gridRow}>
          {/* Card 1: ATS Score */}
          <View
            style={[
              styles.gridCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              ATS score
            </Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
              {analysis ? analysis.atsScore : "--"}
            </Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>
              out of 100
            </Text>
          </View>

          {/* Card 2: Keywords */}
          <View
            style={[
              styles.gridCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Keywords
            </Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
              {analysis ? analysis.missingKeywordsCount : "--"}
            </Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>
              missing
            </Text>
          </View>

          {/* Card 3: Format */}
          <View
            style={[
              styles.gridCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Format
            </Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
              {analysis ? analysis.formatGrade : "--"}
            </Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>
              layout quality
            </Text>
          </View>
        </View>

        {/* ATS Breakdown Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              ATS breakdown
            </Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: analysis
                    ? theme.successBadgeBg
                    : theme.badgeBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: analysis ? theme.successBadgeText : theme.badgeText,
                  },
                ]}
              >
                {analysis ? "Processed" : "Pending"}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>
                Formatting
              </Text>
              <Text style={[styles.itemValue, { color: theme.textPrimary }]}>
                {analysis ? `${analysis.breakdown.formatting}%` : "--"}
              </Text>
            </View>
            <View
              style={[styles.divider, { backgroundColor: theme.divider }]}
            />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>
                Keywords
              </Text>
              <Text style={[styles.itemValue, { color: theme.textPrimary }]}>
                {analysis ? `${analysis.breakdown.keywords}%` : "--"}
              </Text>
            </View>
            <View
              style={[styles.divider, { backgroundColor: theme.divider }]}
            />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>
                Projects section
              </Text>
              <Text style={[styles.itemValue, { color: theme.textPrimary }]}>
                {analysis ? `${analysis.breakdown.projects}%` : "--"}
              </Text>
            </View>
          </View>
        </View>

        {/* Improvement Suggestions Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Improvement suggestions
            </Text>
            <View
              style={[styles.badge, { backgroundColor: theme.warningBadgeBg }]}
            >
              <Text
                style={[styles.badgeText, { color: theme.warningBadgeText }]}
              >
                Actionable
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            {analysis && analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((item, index) => (
                <React.Fragment key={index}>
                  <View style={styles.listItem}>
                    <Text
                      style={[
                        styles.itemText,
                        styles.flexWrap,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.itemStatus,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.priority}
                    </Text>
                  </View>
                  {index < analysis.suggestions.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.divider },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Text style={[styles.itemText, { color: theme.textMuted }]}>
                Upload a document to view AI action items.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dropZone: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  dropZoneTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  dropZoneSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  button: {
    width: "100%",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  gridRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  gridCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "800",
  },
  metricSubtext: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  listContainer: {
    marginTop: spacing.xs,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  flexWrap: {
    flex: 1,
    paddingRight: spacing.md,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  itemStatus: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    width: "100%",
  },
});
