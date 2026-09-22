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
} from "react-native";
import { colors, spacing, borderRadius } from "@/theme/theme";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoadmapStore } from "@/context/roadmapContext";

type TabType = "roadmap" | "projects";

export default function RoadmapScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const { topics, projects } = useRoadmapStore();
  const [activeTab, setActiveTab] = useState<TabType>("roadmap");

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={
          systemColorScheme === "light" ? "dark-content" : "light-content"
        }
      />

      {/* Tab Header */}
      <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
        <Pressable
          activeOpacity={0.8}
          onPress={() => setActiveTab("roadmap")}
          style={[
            styles.tab,
            activeTab === "roadmap" && {
              borderBottomColor: theme.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "roadmap" ? theme.textPrimary : theme.textSecondary,
                fontWeight: activeTab === "roadmap" ? "700" : "500",
              },
            ]}
          >
            Roadmap
          </Text>
        </Pressable>

        <Pressable
          activeOpacity={0.8}
          onPress={() => setActiveTab("projects")}
          style={[
            styles.tab,
            activeTab === "projects" && {
              borderBottomColor: theme.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "projects" ? theme.textPrimary : theme.textSecondary,
                fontWeight: activeTab === "projects" ? "700" : "500",
              },
            ]}
          >
            Projects
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "roadmap" ? (
          // Roadmap Content
          <>
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
                LEARNING PATH
              </Text>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                Track your progress through topics
              </Text>
              <Text style={[styles.heroDescription, { color: theme.textSecondary }]}>
                Select a topic to view subtopics and resources. Mark your progress as you learn.
              </Text>
            </View>

            {/* Topics List */}
            {topics.map((topic) => (
              <View
                key={topic.id}
                style={[
                  styles.topicCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.topicTitle, { color: theme.textPrimary }]}>
                  {topic.title}
                </Text>

                {/* Subtopics */}
                {topic.subtopics.map((subtopic) => (
                  <Pressable
                    key={subtopic.id}
                    style={[
                      styles.subtopicItem,
                      {
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    onPress={() => {
                      // Navigate to subtopic detail or show resources
                      console.log(`Opening ${subtopic.title}`);
                    }}
                  >
                    <View style={styles.subtopicLeft}>
                      <View
                        style={[
                          styles.statusIndicator,
                          {
                            backgroundColor:
                              subtopic.status === "Done" ? theme.successBadgeBg :
                              subtopic.status === "Skip" ? theme.warningBadgeBg :
                              theme.primary,
                          },
                        ]}
                      />
                      <View>
                        <Text style={[styles.subtopicTitle, { color: theme.textPrimary }]}>
                          {subtopic.title}
                        </Text>
                        <Text style={[styles.difficultyText, { color: theme.textMuted }]}>
                          {subtopic.difficulty}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            subtopic.status === "Done" ? theme.successBadgeBg :
                            subtopic.status === "Skip" ? theme.warningBadgeBg :
                            theme.badgeBackground,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              subtopic.status === "Done" ? theme.successBadgeText :
                              subtopic.status === "Skip" ? theme.warningBadgeText :
                              theme.textSecondary,
                          },
                        ]}
                      >
                        {subtopic.status}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ))}
          </>
        ) : (
          // Projects Content
          <>
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
                PRACTICAL PROJECTS
              </Text>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                Build real-world applications
              </Text>
              <Text style={[styles.heroDescription, { color: theme.textSecondary }]}>
                Complete project tasks to solidify your learning and build your portfolio.
              </Text>
            </View>

            {/* Projects List */}
            {projects.map((project) => (
              <Pressable
                key={project.id}
                style={[
                  styles.projectCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() => {
                  // Navigate to project detail
                  console.log(`Opening project: ${project.title}`);
                }}
              >
                <View style={styles.projectHeader}>
                  <Text style={[styles.projectTitle, { color: theme.textPrimary }]}>
                    {project.title}
                  </Text>
                  <View
                    style={[
                      styles.difficultyBadge,
                      {
                        backgroundColor:
                          project.difficulty === "Beginner" ? theme.successBadgeBg :
                          project.difficulty === "Intermediate" ? theme.warningBadgeBg :
                          theme.badgeBackground,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyBadgeText,
                        {
                          color:
                            project.difficulty === "Beginner" ? theme.successBadgeText :
                            project.difficulty === "Intermediate" ? theme.warningBadgeText :
                            theme.textSecondary,
                        },
                      ]}
                    >
                      {project.difficulty}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.projectDescription, { color: theme.textSecondary }]}>
                  {project.description}
                </Text>

                <View style={styles.tasksPreview}>
                  <Text style={[styles.tasksLabel, { color: theme.textMuted }]}>
                    {project.tasks.filter(t => t.isCompleted).length} / {project.tasks.length} tasks completed
                  </Text>

                  {/* Mini progress bar */}
                  <View style={[styles.progressTrack, { backgroundColor: theme.badgeBackground }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${(project.tasks.filter(t => t.isCompleted).length / project.tasks.length) * 100}%`,
                          backgroundColor: theme.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
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
  topicCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtopicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  subtopicLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  subtopicTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  difficultyText: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  projectCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tasksPreview: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  tasksLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});