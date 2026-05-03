import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Student Dashboard',
          headerLargeTitle: true,
        }} 
      />
      <Stack.Screen 
        name="test/[testId]" 
        options={{ 
          title: 'Taking Test',
          headerShown: false,
          gestureEnabled: false, // Prevent swiping back
        }} 
      />
      <Stack.Screen 
        name="result" 
        options={{ 
          title: 'Test Result',
          headerLeft: () => null, // Remove back button
          gestureEnabled: false,
        }} 
      />
    </Stack>
  );
}
