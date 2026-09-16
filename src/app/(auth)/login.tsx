import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { useAuthStore } from "@/context/authContext";
import { useRouter } from "expo-router";

const login = () => {
  const { isAuth, setIsAuth } = useAuthStore();
  const router = useRouter();
  const handleLogin = () => {
    setIsAuth(true);
    router.replace("/(tabs)");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>login</Text>
      <Pressable
        onPress={handleLogin}
        style={{ backgroundColor: "#1ddd", padding: 10, borderRadius: 10 }}
      >
        <Text> LOGIN </Text>
      </Pressable>
      <Link href="/(auth)/register" style={{ color: "blue" }}>
        Go to Register
      </Link>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({});
