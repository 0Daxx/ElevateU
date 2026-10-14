/*
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function Path() {
  const { path } = useLocalSearchParams();
  // ERROR LESSON :  path MUST be the same as the [path] in the file name, otherwise it will not work. 
  return (
    <View>
      <Text>Path</Text>
      <Text>Roadmap Name: {path || "No Name"} </Text>
    </View>
  );
}
const styles = StyleSheet.create({});


*/

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from "react-native";
// import { colors, spacing, borderRadius } from './theme';
import { colors, spacing, borderRadius } from "@/theme/theme";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface ListItem {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
  // link?: string;
  status?: "completed" | "in-progress" | "not-started";
  

}

const TOPICS_DATA: ListItem[] = [
  {
    id: 1,
    title: "JavaScript basics",
    description: "Core language refresh before mobile-specific concepts.",
  },
  {
    id: 2,
    title: "React Native fundamentals",
    description: "Components, props, lists, and style system.",
  },
  {
    id: 3,
    title: "Navigation",
    description: "Tabs, stacks, nested routes, and screen flow.",
  },
  {
    id: 4,
    title: "State and data flow",
    description: "Local state first, app-wide state later.",
  },
];

const PROJECTS_DATA: ListItem[] = [
  {
    id: 1,
    title: "Todo app",
    description: "Basic CRUD and navigation practice.",
  },
  {
    id: 2,
    title: "Career tracker",
    description: "Use cards, progress bars, and filters.",
  },
  {
    id: 3,
    title: "Resume analyzer UI",
    description: "Upload section, score card, results layout.",
  },
];

interface PathProps {
  navigation?: any;
  route?: any;
}

export default function Path({ navigation, route }: PathProps) {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const [activeTab, setActiveTab] = useState<"topics" | "projects">("topics");

  // Dynamic values or defaults
  const title = route?.params?.title || "REACT NATIVE ROADMAP";
  const totalSteps = 18;
  const completedSteps = 7;
  const progressPercent = (completedSteps / totalSteps) * 100;

  const handleBack = () => {
    console.log("Back button pressed");
    console.log("Navigation object:", navigation);
    console.log("Route object:", route);
    console.log("Route params:", route?.params);
    if (navigation) {
      navigation.goBack();
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

      {/* Top Navigation Header */}
      <View style={styles.topHeader}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Roadmap Stack
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.backIcon, { color: theme.textPrimary }]}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Switcher */}
        <View
          style={[
            styles.tabContainer,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("topics")}
            style={[
              styles.tabButton,
              activeTab === "topics" && {
                backgroundColor: theme.badgeBackground,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "topics"
                      ? theme.textPrimary
                      : theme.textSecondary,
                },
              ]}
            >
              Topics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("projects")}
            style={[
              styles.tabButton,
              activeTab === "projects" && {
                backgroundColor: theme.badgeBackground,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "projects"
                      ? theme.textPrimary
                      : theme.textSecondary,
                },
              ]}
            >
              Projects
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
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
            {title.toUpperCase()}
          </Text>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Detailed path for a selected roadmap.
          </Text>
          <Text
            style={[styles.heroDescription, { color: theme.textSecondary }]}
          >
            The stack screen has two tabs only: Topics and Projects. This keeps
            the information tree shallow and easy to scan on a phone.
          </Text>
        </View>

        {/* Progress Card */}
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
              Progress
            </Text>
            <View
              style={[styles.badge, { backgroundColor: theme.badgeBackground }]}
            >
              <Text style={[styles.badgeText, { color: theme.textPrimary }]}>
                {completedSteps} / {totalSteps}
              </Text>
            </View>
          </View>

          {/* Progress Bar track */}
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.progressBarBg },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: theme.progressBar,
                },
              ]}
            />
          </View>
        </View>

        {/* Dynamic Tab Content Section */}
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
              {activeTab === "topics" ? "Topics tab" : "Projects tab"}
            </Text>

            {activeTab === "topics" ? (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.badgeBackground },
                ]}
              >
                <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                  Current view
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.warningBadgeBg },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: theme.warningBadgeText }]}
                >
                  Portfolio proof
                </Text>
              </View>
            )}
          </View>

          {/* List Items */}
          <View style={styles.itemsList}>
            {(activeTab === "topics" ? TOPICS_DATA : PROJECTS_DATA).map(
              (item) => (
                <View key={item.id} style={styles.itemRow}>
                  {/* Step Circle Number */}
                  <View
                    style={[
                      styles.stepCircle,
                      { backgroundColor: theme.stepCircleBg },
                    ]}
                  >
                    <Text
                      style={[styles.stepNumber, { color: theme.textPrimary }]}
                    >
                      {item.id}
                    </Text>
                  </View>

                  {/* Content Card */}
                  <View
                    style={[
                      styles.itemCard,
                      {
                        backgroundColor: theme.badgeBackground,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.itemTitle, { color: theme.textPrimary }]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.itemDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              ),
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
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
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
  progressTrack: {
    height: 8,
    borderRadius: 4,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  itemsList: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: "700",
  },
  itemCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
