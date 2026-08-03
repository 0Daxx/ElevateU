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
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, borderRadius } from "@/theme/theme";
import * as DocumentPicker from 'expo-document-picker';

export default function ResumeSkillsScreen() {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const [selectedFile, setSelectedFile] = React.useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFileUpload = async () => {
    setUploading(true);
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf'],
    });
    if (result.assets && result.assets.length > 0) {
      setSelectedFile(result.assets[0]);  oncanplay
    }

    setUploading(false);
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
            RESUME + SKILLS
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
              Large tap target, minimal instructions, obvious call to action.
            </Text>

            <Pressable
              // activeOpacity={0.8}
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleFileUpload}
            >
              <Text
                style={[styles.buttonText, { color: theme.primaryButtonText }]}
              >
                {uploading ? 'Uploading...' : 'Upload file'}
              </Text>
            </Pressable>

            {/* <Pressable
              // activeOpacity={0.8}
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={async () => {
                try {
                  const result = await DocumentPicker.getDocumentAsync({
                    type: ['application/pdf'],
                  });
                  if (result.assets && result.assets.length > 0) {
                    setSelectedFile(result.assets[0]);
                  }
                } catch (error) {
                  console.error("Error picking document:", error);
                }
              }}
            >
              <Text
                style={[styles.buttonText, { color: theme.primaryButtonText }]}
              >
                Choose file
              </Text>
            </Pressable> */}

            {selectedFile && (
              <Text style={[styles.dropZoneSubtitle, { color: theme.textMuted, marginTop: spacing.sm }]}>
                Selected file: {selectedFile.name}
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
              78
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
              12
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
              B+
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
              style={[styles.badge, { backgroundColor: theme.successBadgeBg }]}
            >
              <Text
                style={[styles.badgeText, { color: theme.successBadgeText }]}
              >
                Processed
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>
                Formatting
              </Text>
              <Text style={[styles.itemValue, { color: theme.textPrimary }]}>
                85%
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
                72%
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
                68%
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
                Priority
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text
                style={[
                  styles.itemText,
                  styles.flexWrap,
                  { color: theme.textPrimary },
                ]}
              >
                Add measurable project outcomes
              </Text>
              <Text style={[styles.itemStatus, { color: theme.textSecondary }]}>
                High
              </Text>
            </View>
            <View
              style={[styles.divider, { backgroundColor: theme.divider }]}
            />

            <View style={styles.listItem}>
              <Text
                style={[
                  styles.itemText,
                  styles.flexWrap,
                  { color: theme.textPrimary },
                ]}
              >
                Include missing job keywords
              </Text>
              <Text style={[styles.itemStatus, { color: theme.textSecondary }]}>
                High
              </Text>
            </View>
            <View
              style={[styles.divider, { backgroundColor: theme.divider }]}
            />

            <View style={styles.listItem}>
              <Text
                style={[
                  styles.itemText,
                  styles.flexWrap,
                  { color: theme.textPrimary },
                ]}
              >
                Reduce text density
              </Text>
              <Text style={[styles.itemStatus, { color: theme.textSecondary }]}>
                Medium
              </Text>
            </View>
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
