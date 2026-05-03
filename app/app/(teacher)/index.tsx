import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_TESTS } from '../../constants/mockData';
import { Test } from '../../types/test';

export default function TeacherDashboard() {
  const router = useRouter();

  const renderTestItem = ({ item }: { item: Test }) => (
    <View style={styles.testCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.testTitle}>{item.title}</Text>
      </View>
      <Text style={styles.testDescription}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.statsText}>{item.questions.length} Qs • {item.durationMinutes} mins</Text>
        <TouchableOpacity style={styles.gradeButton}>
          <Text style={styles.gradeButtonText}>View Submissions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Your Tests</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/(teacher)/build-test')}
        >
          <Text style={styles.createButtonText}>+ Create Test</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_TESTS}
        keyExtractor={(item) => item.id}
        renderItem={renderTestItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  createButton: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#48bb78',
  },
  cardHeader: {
    marginBottom: 8,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  testDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    paddingTop: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '500',
  },
  gradeButton: {
    backgroundColor: '#ebf4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  gradeButtonText: {
    color: '#3182ce',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
