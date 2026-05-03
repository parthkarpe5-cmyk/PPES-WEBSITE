import { Test } from '../types/test';

export const MOCK_TESTS: Test[] = [
  {
    id: 't1',
    title: 'React Native Basics',
    description: 'A beginner level test to check your knowledge on React Native concepts.',
    durationMinutes: 30,
    createdBy: 'teacher_1',
    postTestMessage: 'Great job completing your first React Native test! We will review the coding section shortly.',
    resultReleasePolicy: 'MANUAL',
    passingPercentage: 60,
    questions: [
      {
        id: 'q1',
        type: 'MCQ',
        text: 'Which hook is used to manage state in a functional component?',
        imageUrl: 'https://reactnative.dev/img/tiny_logo.png',
        options: ['useEffect', 'useState', 'useRef', 'useContext'],
        correctAnswer: 'useState',
        points: 5,
      },
      {
        id: 'q2',
        type: 'TRUE_FALSE',
        text: 'React Native can compile to both iOS and Android platforms.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 5,
      },
      {
        id: 'q3',
        type: 'DESCRIPTIVE',
        text: 'Explain the difference between FlatList and ScrollView in React Native.',
        points: 10,
      },
      {
        id: 'q4',
        type: 'CODING',
        text: 'Write a basic counter component using React Native and React Hooks.',
        points: 15,
      }
    ],
  },
  {
    id: 't2',
    title: 'Advanced JavaScript',
    description: 'Test your deep knowledge of closures, prototypes, and async/await.',
    durationMinutes: 45,
    createdBy: 'teacher_1',
    questions: [
      {
        id: 'q5',
        type: 'MCQ',
        text: 'What does `typeof null` evaluate to in JavaScript?',
        options: ['null', 'undefined', 'object', 'number'],
        correctAnswer: 'object',
        points: 5,
      },
      {
        id: 'q6',
        type: 'DESCRIPTIVE',
        text: 'What is a closure in JavaScript? Provide a real-world use case.',
        points: 10,
      }
    ],
  }
];

import { StudentAttemptRecord } from '../types/test';

export let MOCK_STUDENT_ATTEMPTS: StudentAttemptRecord[] = [];
