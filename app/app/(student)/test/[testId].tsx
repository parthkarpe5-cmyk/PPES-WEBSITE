import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image, SafeAreaView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_TESTS, MOCK_STUDENT_ATTEMPTS } from '../../../constants/mockData';
import { Question } from '../../../types/test';

const { width } = Dimensions.get('window');

export default function TestInterface() {
  const { testId } = useLocalSearchParams();
  const router = useRouter();
  
  const test = MOCK_TESTS.find(t => t.id === testId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(test ? test.durationMinutes * 60 : 0);

  useEffect(() => {
    if (!test) {
      Alert.alert('Error', 'Test not found', [{ text: 'OK', onPress: () => router.back() }]);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];

  const handleAnswerChange = (val: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleMultiSelectChange = (val: string) => {
    setAnswers(prev => {
      const current = (prev[currentQuestion.id] as string[]) || [];
      if (current.includes(val)) {
        return { ...prev, [currentQuestion.id]: current.filter(item => item !== val) };
      } else {
        return { ...prev, [currentQuestion.id]: [...current, val] };
      }
    });
  };

  const handleSubmit = () => {
    // Evaluation Logic
    let autoScore = 0;
    let totalPoints = 0;
    let requiresManualReview = false;

    test.questions.forEach(q => {
      totalPoints += q.points;
      const studentAnswer = answers[q.id];

      if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
        if (studentAnswer === q.correctAnswer) {
          autoScore += q.points;
        }
      } else if (q.type === 'MULTIPLE_SELECT') {
        const correctArray = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        const studentArray = Array.isArray(studentAnswer) ? studentAnswer : [];
        const isMatch = correctArray.length === studentArray.length && correctArray.every(val => studentArray.includes(val as string));
        if (isMatch) {
          autoScore += q.points;
        }
      } else {
        // Coding & Descriptive are manually reviewed
        requiresManualReview = true;
      }
    });

    const finalScoreStr = requiresManualReview ? `Pending (${autoScore} auto-graded)` : `${autoScore} / ${totalPoints}`;

    const hasAttempted = MOCK_STUDENT_ATTEMPTS.some(att => att.testId === test.id);
    
    if (!hasAttempted) {
      MOCK_STUDENT_ATTEMPTS.push({
        testId: test.id,
        testTitle: test.title,
        timestamp: new Date().toLocaleString(),
        score: finalScoreStr,
        answers: answers
      });
    }

    // Direct replacement without browser alert blocking
    router.replace(`/(student)/result?testId=${test.id}`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isTimeCritical = timeLeft < 300;
  const isTimeWarning = timeLeft < 600;
  const timerBgColor = isTimeCritical ? '#fee2e2' : (isTimeWarning ? '#fef3c7' : '#d1fae5');
  const timerTextColor = isTimeCritical ? '#ef4444' : (isTimeWarning ? '#d97706' : '#10b981');

  const renderQuestionInput = (q: Question) => {
    const value = answers[q.id];

    switch (q.type) {
      case 'MCQ':
      case 'TRUE_FALSE':
        return (
          <View style={styles.optionsContainer}>
            {q.options?.map((opt, i) => {
              const isSelected = value === opt;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleAnswerChange(opt)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        );
      case 'MULTIPLE_SELECT':
        const multiValue = Array.isArray(value) ? value : [];
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.multiSelectInstruction}>(Select all that apply)</Text>
            {q.options?.map((opt, i) => {
              const isSelected = multiValue.includes(opt);
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleMultiSelectChange(opt)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        );
      case 'DESCRIPTIVE':
      case 'CODING':
        return (
          <View>
            <Text style={styles.manualReviewWarning}>Teacher will manually review and assign points.</Text>
            <TextInput
              style={[styles.textInput, q.type === 'CODING' && styles.codingInput]}
              multiline
              placeholder={q.type === 'CODING' ? "Write your code here..." : "Type your detailed answer here..."}
              placeholderTextColor="#94a3b8"
              value={value as string || ''}
              onChangeText={handleAnswerChange}
              textAlignVertical="top"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.testTitle} numberOfLines={1}>{test.title}</Text>
          <View style={[styles.timerContainer, { backgroundColor: timerBgColor }]}>
            <Text style={[styles.timerText, { color: timerTextColor }]}>⏱ {formatTime(timeLeft)}</Text>
          </View>
        </View>

        <View style={styles.progressWrapper}>
          <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {test.questions.length}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionTypeBadge}>{currentQuestion.type.replace('_', ' ')}</Text>
            <Text style={styles.pointsText}>{currentQuestion.points} points</Text>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          
          {currentQuestion.imageUrl && (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: currentQuestion.imageUrl }} style={styles.questionImage} resizeMode="cover" />
            </View>
          )}
          
          <View style={styles.inputArea}>
            {renderQuestionInput(currentQuestion)}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          disabled={currentQuestionIndex === 0}
          onPress={() => setCurrentQuestionIndex(prev => prev - 1)}
        >
          <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>← Prev</Text>
        </TouchableOpacity>

        {currentQuestionIndex === test.questions.length - 1 ? (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Test</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButtonPrimary} onPress={() => setCurrentQuestionIndex(prev => prev + 1)}>
            <Text style={styles.navButtonTextPrimary}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, zIndex: 10 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  testTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', flex: 1, marginRight: 16 },
  timerContainer: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  timerText: { fontWeight: '800', fontSize: 16 },
  progressWrapper: { width: '100%' },
  progressText: { fontSize: 14, color: '#64748b', marginBottom: 8, fontWeight: '600' },
  progressBarBg: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },
  
  content: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 100 },
  questionCard: { backgroundColor: '#fff', padding: 24, borderRadius: 20, shadowColor: '#64748b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5, borderWidth: 1, borderColor: '#f8fafc' },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  questionTypeBadge: { backgroundColor: '#eff6ff', color: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  pointsText: { color: '#64748b', fontWeight: '700', fontSize: 14 },
  questionText: { fontSize: 22, color: '#0f172a', lineHeight: 32, fontWeight: '600' },
  imageWrapper: { marginTop: 20, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  questionImage: { width: '100%', height: 250, backgroundColor: '#f8fafc' },
  
  inputArea: { marginTop: 28 },
  optionsContainer: { gap: 16 },
  optionButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#f1f5f9', padding: 18, borderRadius: 16, backgroundColor: '#fff' },
  optionButtonSelected: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  radioCircle: { height: 24, width: 24, borderRadius: 12, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  radioCircleSelected: { borderColor: '#3b82f6' },
  radioDot: { height: 12, width: 12, borderRadius: 6, backgroundColor: '#3b82f6' },
  checkbox: { height: 24, width: 24, borderRadius: 6, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  checkboxSelected: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  optionText: { fontSize: 17, color: '#334155', flex: 1, fontWeight: '500' },
  optionTextSelected: { color: '#1e3a8a', fontWeight: '700' },
  multiSelectInstruction: { fontSize: 14, color: '#64748b', marginBottom: -4, fontStyle: 'italic' },
  manualReviewWarning: { fontSize: 14, color: '#d97706', marginBottom: 12, fontStyle: 'italic', fontWeight: '600' },
  
  textInput: { borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 16, padding: 20, minHeight: 180, fontSize: 16, backgroundColor: '#f8fafc', color: '#0f172a', lineHeight: 24 },
  codingInput: { fontFamily: 'monospace', backgroundColor: '#0f172a', color: '#e2e8f0', borderColor: '#1e293b', fontSize: 14 },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  navButton: { paddingHorizontal: 28, paddingVertical: 16, borderRadius: 14, backgroundColor: '#f1f5f9' },
  navButtonDisabled: { opacity: 0.4 },
  navButtonText: { color: '#475569', fontWeight: '700', fontSize: 16 },
  navButtonTextDisabled: { color: '#94a3b8' },
  navButtonPrimary: { paddingHorizontal: 36, paddingVertical: 16, borderRadius: 14, backgroundColor: '#3b82f6' },
  navButtonTextPrimary: { color: '#fff', fontWeight: '800', fontSize: 16 },
  submitButton: { paddingHorizontal: 36, paddingVertical: 16, borderRadius: 14, backgroundColor: '#10b981' },
  submitButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
