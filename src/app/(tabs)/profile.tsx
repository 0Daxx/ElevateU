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

export default function ProfileScreen() {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === 'light' ? colors.light : colors.dark;

  const userSkills = ['React Native', 'JavaScript', 'Python', 'DSA'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={systemColorScheme === 'light' ? 'dark-content' : 'light-content'} />

      {/* Screen Top Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Profile</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.settingsButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.settingsIcon, { color: theme.textPrimary }]}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* User Info Header Card */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.userHeaderContainer}>
            {/* Gradient Avatar Placeholder */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RK</Text>
            </View>

            {/* Info Column */}
            <View style={styles.userInfoCol}>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>Rahul Kumar</Text>
              <Text style={[styles.userDegree, { color: theme.textSecondary }]}>
                B.Tech CSE • 2024–2028
              </Text>

              {/* Quick skill tags */}
              <View style={styles.quickTagsRow}>
                {['React Native', 'Python', 'JavaScript'].map((tag) => (
                  <View key={tag} style={[styles.quickTag, { backgroundColor: theme.badgeBackground }]}>
                    <Text style={[styles.quickTagText, { color: theme.textSecondary }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.gridRow}>
          <View style={[styles.gridCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Profile completeness</Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>72%</Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>keep updating</Text>
          </View>

          <View style={[styles.gridCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Achievements</Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>5</Text>
            <Text style={[styles.metricSubtext, { color: theme.textMuted }]}>courses + projects</Text>
          </View>
        </View>

        {/* Education Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Education</Text>
            <View style={[styles.badge, { backgroundColor: theme.badgeBackground }]}>
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>Editable</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>B.Tech CSE</Text>
              <Text style={[styles.itemValue, { color: theme.textSecondary }]}>2024–2028</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>College name</Text>
              <Text style={[styles.itemValue, { color: theme.textMuted }]}>placeholder</Text>
            </View>
          </View>
        </View>

        {/* Skills Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Skills</Text>
            <View style={[styles.badge, { backgroundColor: theme.successBadgeBg }]}>
              <Text style={[styles.badgeText, { color: theme.successBadgeText }]}>Current</Text>
            </View>
          </View>

          <View style={styles.tagsRow}>
            {userSkills.map((skill) => (
              <View
                key={skill}
                style={[
                  styles.skillTag,
                  { backgroundColor: theme.badgeBackground, borderColor: theme.cardBorder },
                ]}
              >
                <Text style={[styles.skillTagText, { color: theme.textSecondary }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Career Goal Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Career goal</Text>
            <View style={[styles.badge, { backgroundColor: theme.successBadgeBg }]}>
              <Text style={[styles.badgeText, { color: theme.successBadgeText }]}>AI/ML Engineer</Text>
            </View>
          </View>

          <Text style={[styles.goalDescription, { color: theme.textSecondary }]}>
            Use a short, prominent goal label rather than a long paragraph.
          </Text>
        </View>

        {/* Settings Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Settings</Text>
            <View style={[styles.badge, { backgroundColor: theme.badgeBackground }]}>
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>Static</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>Theme</Text>
              <Text style={[styles.itemValue, { color: theme.textSecondary }]}>
                {systemColorScheme === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>Privacy</Text>
              <Text style={[styles.itemValue, { color: theme.textSecondary }]}>Basic</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <View style={styles.listItem}>
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>About app</Text>
              <Text style={[styles.itemValue, { color: theme.textSecondary }]}>Info</Text>
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
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
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
  userHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#5EEAD4', // Aqua gradient color approximation
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  userDegree: {
    fontSize: 13,
    marginBottom: spacing.md,
  },
  quickTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  quickTag: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  quickTagText: {
    fontSize: 12,
    fontWeight: '500',
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
    fontSize: 26,
    fontWeight: '800',
  },
  metricSubtext: {
    fontSize: 12,
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
  listContainer: {
    marginTop: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemValue: {
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
  skillTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  skillTagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  goalDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});