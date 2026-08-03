import { Stack } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";

export default function RootLayout() {
  const isLoggedIn = true;
  // const isLoggedIn = false;

  // TODO :  Replace with your actual authentication logic
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
