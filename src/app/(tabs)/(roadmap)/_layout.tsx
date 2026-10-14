import Stack from "expo-router/stack";

export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" options={{
      title: "Roadmap",
      // headerShown: true,
    }} />
    <Stack.Screen name="[path]" options={{
      title: "Path",
      // headerShown: true,
    }} />
  </Stack>;
}