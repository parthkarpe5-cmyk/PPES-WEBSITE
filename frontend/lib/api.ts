import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
});

// Mocked user for now. In a real app, this would come from Auth Context.
export const MOCK_USER = {
  id: 'student_12',
  name: 'John Doe',
  role: 'student', // change to 'teacher' to test teacher view
};

// export const MOCK_USER = {
//   id: 'teacher_101', // Change ID to simulate a different user
//   name: 'Mr. Smith',
//   role: 'teacher',   // Change 'student' to 'teacher'
// };

// export const MOCK_TEACHER = {
//   id: 'teacher_456',
//   name: 'Mr. Smith',
//   role: 'teacher'
// };

// Interceptor to attach user headers
api.interceptors.request.use((config) => {
  config.headers['x-user-id'] = MOCK_USER.id;
  config.headers['x-user-role'] = MOCK_USER.role;
  return config;
});

// Subjects and Teachers
export const getSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data.data;
};

export const getTeachersForSubject = async (subjectId: string) => {
  const response = await api.get(`/subjects/${subjectId}/teachers`);
  return response.data.data;
};

export const getAllTeachers = async () => {
  const response = await api.get('/teachers');
  return response.data.data;
};

// Doubts
export const getDoubts = async (params?: { subject_id?: string; teacher_id?: string }) => {
  const response = await api.get('/doubts', { params });
  return response.data.data;
};

export const getDoubtDetails = async (id: string) => {
  const response = await api.get(`/doubts/${id}`);
  return response.data;
};

export const createDoubt = async (data: { 
  title: string, 
  subject_id: string,
  teacher_id?: string,
  initial_message: { text: string, image_url: string | null } 
}) => {
  const response = await api.post('/doubts', data);
  return response.data;
};

export const addMessage = async (data: { doubt_id: string, text: string, image_url: string | null }) => {
  const response = await api.post('/messages', data);
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return `http://localhost:5000${response.data.image_url}`;
};
