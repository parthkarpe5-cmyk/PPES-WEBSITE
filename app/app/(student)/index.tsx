import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_TESTS, MOCK_STUDENT_ATTEMPTS } from '../../constants/mockData';
import { Test, StudentAttemptRecord } from '../../types/test';

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'AVAILABLE' | 'HISTORY'>('AVAILABLE');

  const renderTestItem = ({ item }: { item: Test }) => {
    const hasAttempted = MOCK_STUDENT_ATTEMPTS.some(att => att.testId === item.id);
    return (
      <View style={styles.testCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.testTitle}>{item.title}</Text>
          <Text style={styles.durationBadge}>{item.durationMinutes} mins</Text>
        </View>
        <Text style={styles.testDescription}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.questionCount}>{item.questions.length} Questions</Text>
          {hasAttempted ? (
            <View style={[styles.startButton, { backgroundColor: '#e2e8f0' }]}>
              <Text style={[styles.startButtonText, { color: '#64748b' }]}>Completed ✓</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={() => router.push(`/(student)/test/${item.id}`)}>
              <Text style={styles.startButtonText}>Start Test</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderHistoryItem = ({ item }: { item: StudentAttemptRecord }) => {
    return (
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>{item.testTitle}</Text>
          <Text style={styles.historyDate}>{item.timestamp}</Text>
        </View>
        <View style={styles.historyFooter}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={styles.scoreValue}>{item.score}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'AVAILABLE' && styles.tabButtonActive]}
          onPress={() => setActiveTab('AVAILABLE')}
        >
          <Text style={[styles.tabText, activeTab === 'AVAILABLE' && styles.tabTextActive]}>Available Tests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'HISTORY' && styles.tabButtonActive]}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text style={[styles.tabText, activeTab === 'HISTORY' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'AVAILABLE' ? (
        <FlatList
          data={MOCK_TESTS}
          keyExtractor={(item) => item.id}
          renderItem={renderTestItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No available tests.</Text>}
        />
      ) : (
        <FlatList
          data={MOCK_STUDENT_ATTEMPTS}
          keyExtractor={(item, index) => item.testId + index}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>You haven't taken any tests yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  tabButtonActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#0f172a', fontWeight: '800' },
  listContainer: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 40, fontSize: 16 },
  
  testCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  testTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', flex: 1 },
  durationBadge: { backgroundColor: '#eff6ff', color: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, fontSize: 12, fontWeight: '800' },
  testDescription: { fontSize: 14, color: '#64748b', lineHeight: 22, marginBottom: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  questionCount: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  startButton: { backgroundColor: '#3b82f6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  startButtonText: { color: 'white', fontWeight: '800', fontSize: 14 },
  
  historyCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderLeftWidth: 4, borderLeftColor: '#10b981' },
  historyHeader: { marginBottom: 12 },
  historyTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  historyDate: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  historyFooter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 8 },
  scoreLabel: { fontSize: 14, color: '#64748b', fontWeight: '600', marginRight: 8 },
  scoreValue: { fontSize: 16, color: '#10b981', fontWeight: '800' },
});
