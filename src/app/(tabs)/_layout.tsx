import { Tabs } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";

export default function RootLayout() {
  const isLoggedIn = false;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
    {/* <Tabs options={{ headerShown: false }} > */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="home" size={24} color="black" />,
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="person" size={24} color="black" />,
          tabBarLabel: "Profile",
        }}
      />
      <Tabs.Screen
        name="(roadmap)"
        options={{
          tabBarIcon: () => <Ionicons name="list" size={24} 
          color="black" />,
          headerShown: false,
          tabBarLabel: "Roadmaps",
        }}
      />
      <Tabs.Screen
        name="assessment"
        options={{
          tabBarIcon: () => (
            <Ionicons name="checkmark-circle" size={24} color="black" />
          ),
          headerShown: false,
          tabBarLabel: "Assessment",
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="chatbubbles" size={24} color="black" />,
          tabBarLabel: "Chatbot",
        }}
      />
    </Tabs>
    // <Tabs  />
  );
}
