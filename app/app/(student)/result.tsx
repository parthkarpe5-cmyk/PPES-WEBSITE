import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MOCK_TESTS } from '../../constants/mockData';

const SUCCESS_QUOTES = [
  "You've successfully submitted your test! Take a deep breath.",
  "Awesome job! Your hard work is bound to pay off.",
  "Test complete! Time to relax and recharge.",
  "You crushed it! The hardest part is over.",
  "Mission accomplished! Your answers are safely recorded."
];

export default function TestResult() {
  const router = useRouter();
  const { testId } = useLocalSearchParams();

  // Find the test to show teacher's specific message
  const test = MOCK_TESTS.find(t => t.id === testId);

  // Pick a random quote on mount
  const randomQuote = useMemo(() => {
    return SUCCESS_QUOTES[Math.floor(Math.random() * SUCCESS_QUOTES.length)];
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.emoji}>🎉</Text>
        </View>

        <Text style={styles.title}>Test Submitted!</Text>
        
        <Text style={styles.quoteText}>"{randomQuote}"</Text>

        {test?.postTestMessage && (
          <View style={styles.teacherMessageContainer}>
            <Text style={styles.teacherMessageLabel}>Message from your teacher:</Text>
            <Text style={styles.teacherMessageText}>{test.postTestMessage}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            {test?.resultReleasePolicy === 'IMMEDIATE' 
              ? 'Your results have been released. You can view your detailed scorecard in your dashboard.' 
              : 'Your teacher will manually review the descriptive/coding answers. You will be notified once the final marks are published.'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/(student)')}
        >
          <Text style={styles.homeButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#d1fae5'
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  quoteText: {
    fontSize: 18,
    color: '#3b82f6',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 28,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  teacherMessageContainer: {
    backgroundColor: '#fffbeb',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  teacherMessageLabel: {
    fontSize: 14,
    color: '#b45309',
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  teacherMessageText: {
    fontSize: 16,
    color: '#92400e',
    lineHeight: 24,
    fontWeight: '500'
  },
  infoBox: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  homeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
});
