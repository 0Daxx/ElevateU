import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const register = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> 
      <Text>register</Text>
      <Link replace href="/(auth)/login" style={{ color: "blue" }}>
        Go to Login
      </Link>
    </View>
  );
};

export default register;

const styles = StyleSheet.create({});
