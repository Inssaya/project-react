import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="schools" />
      <Stack.Screen name="classes" />
      <Stack.Screen name="students" />
      <Stack.Screen name="teachers" />
      <Stack.Screen name="majors" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="grades" />
    </Stack>
  );
}
