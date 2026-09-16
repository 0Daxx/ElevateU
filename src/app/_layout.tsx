import { Stack } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useAuthStore } from "@/context/authContext";
export default function RootLayout() {
  const {isAuth , setIsAuth} = useAuthStore();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuth}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuth}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
