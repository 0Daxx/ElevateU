import { Tabs } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useAuthStore } from "@/context/authContext";
export default function RootLayout() {
  const {isAuth , setIsAuth} = useAuthStore();
  // const isLoggedIn = false;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Protected guard={!isAuth}>
        <Tabs.Screen name="(auth)" />
      </Tabs.Protected>
      <Tabs.Protected guard={isAuth}>
        <Tabs.Screen name="(tabs)" />
      </Tabs.Protected>
    </Tabs>
  );
}
