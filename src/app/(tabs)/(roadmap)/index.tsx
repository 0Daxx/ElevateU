import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Pressable,
  Linking,
} from "react-native";
import { colors, spacing, borderRadius } from "@/theme/theme";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

// Mock Data for Roadmaps
interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  stepsCount: number;
}

const ROADMAPS_DATA: RoadmapItem[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "React, UI systems, web fundamentals, projects.",
    stepsCount: 24,
  },
  {
    id: "react-native",
    title: "React Native",
    description: "Expo, navigation, state, mobile architecture.",
    stepsCount: 18,
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    description: "Python, ML basics, data, model deployment.",
    stepsCount: 28,
  },
  {
    id: "full-stack",
    title: "Full Stack",
    description: "Frontend, backend, APIs, databases, deployment.",
    stepsCount: 30,
  },
  {
    id: "dsa",
    title: "DSA Roadmap",
    description: "Arrays, trees, graphs, patterns, practice.",
    stepsCount: 22,
  },
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    description: "Layout, research, systems, prototyping.",
    stepsCount: 20,
  },
];

const FILTER_OPTIONS = ["Most relevant", "Beginner", "Trending"];

interface RoadmapsScreenProps {
  navigation?: any; // For React Navigation
}

export default function RoadmapsScreen({ navigation }: RoadmapsScreenProps) {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const [selectedFilter, setSelectedFilter] = useState("Most relevant");

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
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
        {/* Hero Header Card */}
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
            ALL ROADMAPS
          </Text>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Choose a path to open its stack screen.
          </Text>
          <Text
            style={[styles.heroDescription, { color: theme.textSecondary }]}
          >
            Initial screen shows several mock roadmaps like roadmap.sh. Tapping
            any card opens a detailed roadmap view.
          </Text>
        </View>

        {/* Roadmaps Grid (2 Columns) */}
        <View style={styles.gridContainer}>
          {ROADMAPS_DATA.map((item) => (
            <Pressable
              key={item.id}
              onPress={
                () => {
                  router.push(`/(tabs)/(roadmap)/${item.id}`);
                }
              }
              style={[
                styles.gridCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <Text style={[styles.roadmapTitle, { color: theme.textPrimary }]}>
                {item.title}
              </Text>

              <Text
                style={[
                  styles.roadmapDescription,
                  { color: theme.textSecondary },
                ]}
                numberOfLines={3}
              >
                {item.description}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={[styles.stepsText, { color: theme.textMuted }]}>
                  {item.stepsCount} steps
                </Text>

                
                  {/* </Link> */}
                  <View
                    style={[
                      styles.openButton,
                      { backgroundColor: theme.badgeBackground },
                    ]}
                  >
                    <Text
                      style={[
                        styles.openButtonText,
                        { color: theme.textPrimary },
                      ]}
                    >
                      Open
                    </Text>
                  </View>Link
              </View>
            </Pressable>
          ))}
        </View>

        {/* Filters Section */}
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
              Filters
            </Text>
            <View
              style={[styles.badge, { backgroundColor: theme.badgeBackground }]}
            >
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                Optional
              </Text>
            </View>
          </View>

          {/* Horizontal Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_OPTIONS.map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.8}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive
                        ? theme.primary
                        : theme.badgeBackground,
                      borderColor: isActive ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: isActive
                          ? theme.primaryButtonText
                          : theme.textSecondary,
                      },
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  gridCard: {
    // Calculates width for two cards per row minus spacing
    width: "47.5%",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    justify: "space-between",
    minHeight: 180,
  },
  roadmapTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  roadmapDescription: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  stepsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  openButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  openButtonText: {
    fontSize: 14,
    fontWeight: "600",
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
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
