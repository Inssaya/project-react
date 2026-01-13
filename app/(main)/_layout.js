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
      {/* Schools */}
      <Stack.Screen name="schools/index" />
      <Stack.Screen name="schools/create" />
      {/* Classes */}
      <Stack.Screen name="classes/index" />
      <Stack.Screen name="classes/create" />
      {/* Students */}
      <Stack.Screen name="students/index" />
      <Stack.Screen name="students/create" />
      {/* Teachers */}
      <Stack.Screen name="teachers/index" />
      <Stack.Screen name="teachers/create" />
      {/* Majors */}
      <Stack.Screen name="majors/index" />
      <Stack.Screen name="majors/create" />
      {/* Core features */}
      <Stack.Screen name="attendance" />
      <Stack.Screen name="grades" />
    </Stack>
  );
}
