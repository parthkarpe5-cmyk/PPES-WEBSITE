import { Stack } from 'expo-router';

export default function TeacherLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Teacher Dashboard',
          headerLargeTitle: true,
        }} 
      />
      <Stack.Screen 
        name="build-test" 
        options={{ 
          title: 'Create New Test',
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}
