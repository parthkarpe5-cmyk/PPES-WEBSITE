import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { QuestionType, Question } from '../../types/test';

export default function BuildTest() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [passingPercentage, setPassingPercentage] = useState('60');
  const [postTestMessage, setPostTestMessage] = useState('');
  const [isManualRelease, setIsManualRelease] = useState(true);

  const [questions, setQuestions] = useState<Partial<Question>[]>([]);

  const totalPoints = questions.reduce((acc, q) => acc + (q.points || 0), 0);

  const addQuestion = (type: QuestionType) => {
    setQuestions([...questions, { 
      id: Date.now().toString(), 
      type, 
      text: '', 
      points: 5,
      options: type === 'MCQ' ? ['', '', '', ''] : (type === 'TRUE_FALSE' ? ['True', 'False'] : []),
      correctAnswer: ''
    }]);
  };

  const updateQuestion = (index: number, key: string, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[key] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    if (updated[qIndex].options) {
      updated[qIndex].options![optIndex] = value;
    }
    setQuestions(updated);
  };

  const pickImage = async (index: number) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateQuestion(index, 'imageUrl', result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title || !description || questions.length === 0) {
      Alert.alert('Error', 'Please fill all fields and add at least one question.');
      return;
    }
    Alert.alert('Success', 'Test published successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const renderQuestionBuilder = (q: Partial<Question>, index: number) => {
    return (
      <View key={q.id} style={styles.questionCard}>
        <View style={styles.qHeader}>
          <Text style={styles.qTypeBadge}>{q.type.replace('_', ' ')}</Text>
          <TouchableOpacity onPress={() => setQuestions(questions.filter((_, i) => i !== index))} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Question Text"
          placeholderTextColor="#a0aec0"
          value={q.text}
          onChangeText={(val) => updateQuestion(index, 'text', val)}
          multiline
        />

        {/* Image Upload UI */}
        <View style={styles.imageUploadContainer}>
          {q.imageUrl ? (
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: q.imageUrl }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity 
                style={styles.removeImageBtn} 
                onPress={() => updateQuestion(index, 'imageUrl', undefined)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(index)}>
              <Text style={styles.uploadBtnText}>📸 Upload Reference Image</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Points for this question:</Text>
          <TextInput
            style={[styles.input, styles.pointsInput]}
            keyboardType="numeric"
            value={q.points?.toString()}
            onChangeText={(val) => updateQuestion(index, 'points', parseInt(val) || 0)}
          />
        </View>

        {q.type === 'MCQ' && (
          <View style={styles.optionsContainer}>
            <Text style={styles.label}>Options:</Text>
            {q.options?.map((opt, i) => (
              <TextInput
                key={i}
                style={styles.input}
                placeholder={`Option ${i + 1}`}
                placeholderTextColor="#a0aec0"
                value={opt}
                onChangeText={(val) => updateOption(index, i, val)}
              />
            ))}
            <TextInput
              style={[styles.input, styles.correctAnswerInput]}
              placeholder="Correct Answer (Exact Match)"
              placeholderTextColor="#718096"
              value={q.correctAnswer as string}
              onChangeText={(val) => updateQuestion(index, 'correctAnswer', val)}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Total Points Sticky Indicator */}
        <View style={styles.totalPointsBadge}>
          <Text style={styles.totalPointsText}>Total Points: {totalPoints}</Text>
        </View>

        <View style={styles.headerCard}>
          <Text style={styles.sectionTitle}>Test Details</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Test Title" 
            placeholderTextColor="#a0aec0"
            value={title} 
            onChangeText={setTitle} 
          />
          <TextInput 
            style={[styles.input, { height: 80 }]} 
            placeholder="Description" 
            placeholderTextColor="#a0aec0"
            multiline 
            value={description} 
            onChangeText={setDescription} 
          />
          
          <View style={styles.row}>
            <Text style={styles.label}>Duration (mins):</Text>
            <TextInput 
              style={[styles.input, { flex: 1, marginBottom: 0 }]} 
              placeholder="e.g. 30" 
              keyboardType="numeric" 
              value={duration} 
              onChangeText={setDuration} 
            />
          </View>
          
          <View style={[styles.row, { marginTop: 16 }]}>
            <Text style={styles.label}>Passing Score (%):</Text>
            <TextInput 
              style={[styles.input, { flex: 1, marginBottom: 0 }]} 
              placeholder="e.g. 60" 
              keyboardType="numeric" 
              value={passingPercentage} 
              onChangeText={setPassingPercentage} 
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Manual Result Release</Text>
            <Switch
              value={isManualRelease}
              onValueChange={setIsManualRelease}
              trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
            />
          </View>
          <Text style={styles.helperText}>
            {isManualRelease ? 'Students will NOT see answers immediately. You must release them manually.' : 'Students will see their answers immediately after submission.'}
          </Text>

          <Text style={[styles.label, { marginTop: 16, marginBottom: 8 }]}>Custom Post-Test Message:</Text>
          <TextInput 
            style={[styles.input, { height: 60 }]} 
            placeholder="e.g. Great job! I'll review your essays shortly." 
            placeholderTextColor="#a0aec0"
            multiline 
            value={postTestMessage} 
            onChangeText={setPostTestMessage} 
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Questions ({questions.length})</Text>
        
        {questions.map((q, i) => renderQuestionBuilder(q, i))}

        <View style={styles.addButtonsContainer}>
          <Text style={styles.addSectionLabel}>Add New Question:</Text>
          <View style={styles.addBtnGrid}>
            <TouchableOpacity style={styles.addBtn} onPress={() => addQuestion('MCQ')}>
              <Text style={styles.addBtnText}>MCQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => addQuestion('DESCRIPTIVE')}>
              <Text style={styles.addBtnText}>Descriptive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => addQuestion('CODING')}>
              <Text style={styles.addBtnText}>Coding</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Publish Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  totalPointsBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  totalPointsText: { color: 'white', fontWeight: '800', fontSize: 16 },
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 16 },
  input: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#334155',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  label: { fontSize: 16, color: '#475569', marginRight: 12, fontWeight: '600' },
  helperText: { fontSize: 12, color: '#64748b', marginTop: 4, fontStyle: 'italic' },
  pointsInput: { width: 90, marginBottom: 0, textAlign: 'center' },
  questionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  qTypeBadge: { 
    backgroundColor: '#e0e7ff', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    fontWeight: '700', 
    color: '#4f46e5',
    textTransform: 'uppercase',
    fontSize: 12
  },
  deleteBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  deleteText: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  imageUploadContainer: { marginBottom: 16 },
  uploadBtn: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  uploadBtnText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  imagePreviewWrapper: { position: 'relative', width: '100%', height: 160, borderRadius: 12, overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%' },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  optionsContainer: { marginTop: 8 },
  correctAnswerInput: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    marginTop: 8,
  },
  addButtonsContainer: { marginTop: 10, paddingBottom: 20 },
  addSectionLabel: { fontSize: 16, fontWeight: '700', color: '#475569', marginBottom: 12 },
  addBtnGrid: { flexDirection: 'row', gap: 12 },
  addBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e0',
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: { color: '#334155', fontWeight: '700', fontSize: 14 },
  footer: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  saveButton: { 
    backgroundColor: '#10b981', 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: 'white', fontWeight: '800', fontSize: 18 },
});
