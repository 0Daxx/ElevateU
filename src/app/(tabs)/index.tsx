import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from "@/theme/theme" ;

interface HomeScreenProps {
  navigation?: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === 'light' ? colors.light : colors.dark;

  const navigateTo = (screenName: string) => {
    if (navigation) {
      navigation.navigate(screenName);
    } else {
      console.log(`Navigating to: ${screenName}`);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={systemColorScheme === 'light' ? 'dark-content' : 'light-content'} />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Home</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.menuButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.menuIcon, { color: theme.textPrimary }]}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Hero Greeting Card */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            GOOD EVENING
          </Text>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Rahul, keep building your career path.
          </Text>
          <Text style={[styles.heroDescription, { color: theme.textSecondary }]}>
            Single-screen summary of progress, recommendations, and the next action the user should take.
          </Text>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={() => navigateTo('Assessment')}
            >
              <Text style={[styles.primaryButtonText, { color: theme.primaryButtonText }]}>
                Take Assessment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.secondaryButton, { backgroundColor: theme.badgeBackground, borderColor: theme.cardBorder }]}
              onPress={() => navigateTo('Roadmaps')}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>
                Explore Roadmaps
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.gridRow}>
          <View style={[styles.gridCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Career match</Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>89%</Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>AI / ML Engineer</Text>
          </View>

          <View style={[styles.gridCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>ATS score</Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>78</Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>resume ready</Text>
          </View>

          <View style={[styles.gridCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Roadmap</Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>3/8</Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>completed</Text>
          </View>
        </View>

        {/* Recommended Career Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recommended career</Text>
            <View style={[styles.badge, { backgroundColor: theme.successBadgeBg }]}>
              <Text style={[styles.badgeText, { color: theme.successBadgeText }]}>Best match</Text>
            </View>
          </View>

          <Text style={[styles.careerTitle, { color: theme.textPrimary }]}>AI/ML Engineer</Text>

          {/* Progress Track */}
          <View style={[styles.progressTrack, { backgroundColor: theme.progressBarBg, marginTop: spacing.md }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: '89%', backgroundColor: theme.progressBar },
              ]}
            />
          </View>
        </View>

        {/* Skill Progress Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Skill progress</Text>
            <View style={[styles.badge, { backgroundColor: theme.badgeBackground }]}>
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>Live summary</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>React Native</Text>
              <Text style={[styles.itemValue, { color: theme.textPrimary }]}>80%</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>JavaScript</Text>
              <Text style={[styles.itemValue, { color: theme.textPrimary }]}>70%</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>DSA</Text>
              <Text style={[styles.itemValue, { color: theme.textPrimary }]}>40%</Text>
            </View>
          </View>
        </View>

        {/* Recommended Courses Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recommended courses</Text>
            <View style={[styles.badge, { backgroundColor: theme.warningBadgeBg }]}>
              <Text style={[styles.badgeText, { color: theme.warningBadgeText }]}>2 new</Text>
            </View>
          </View>

          <View style={styles.tagsRow}>
            {['Machine Learning Basics', 'React Native Advanced'].map((course) => (
              <View
                key={course}
                style={[
                  styles.courseChip,
                  { backgroundColor: theme.badgeBackground, borderColor: theme.cardBorder },
                ]}
              >
                <Text style={[styles.courseChipText, { color: theme.textSecondary }]}>{course}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Internship Suggestions Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Internship suggestions
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.badgeBackground }]}>
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>Open roles</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={[styles.itemText, styles.flexWrap, { color: theme.textPrimary }]}>
                Frontend Developer Intern
              </Text>
              <Text style={[styles.itemSubValue, { color: theme.textSecondary }]}>remote</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, styles.flexWrap, { color: theme.textPrimary }]}>
                AI Intern
              </Text>
              <Text style={[styles.itemSubValue, { color: theme.textSecondary }]}>entry-level</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Footer Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick actions</Text>
            <View style={[styles.badge, { backgroundColor: theme.badgeBackground }]}>
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>Tap to open</Text>
            </View>
          </View>

          <View style={styles.quickActionsGrid}>
            {[
              { label: 'Assessment', screen: 'Assessment' },
              { label: 'Resume', screen: 'Resume' },
              { label: 'Chatbot', screen: 'Chatbot' },
              { label: 'Profiles', screen: 'Profile' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                activeOpacity={0.7}
                onPress={() => navigateTo(action.screen)}
                style={[
                  styles.quickActionCard,
                  { backgroundColor: theme.badgeBackground, borderColor: theme.cardBorder },
                ]}
              >
                <Text style={[styles.quickActionText, { color: theme.textSecondary }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 16,
    fontWeight: '700',
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
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricSubtext: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  careerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  listContainer: {
    marginTop: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  flexWrap: {
    flex: 1,
    paddingRight: spacing.md,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  itemSubValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  courseChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  quickActionCard: {
    width: '48%',
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});