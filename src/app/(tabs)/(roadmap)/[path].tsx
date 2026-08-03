import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function Path() {
  const { path } = useLocalSearchParams();
  // ERROR LESSON :  path MUST be the same as the [path] in the file name, otherwise it will not work. 
  return (
    <View>
      <Text>Path</Text>
      <Text>Roadmap Name: {path || "No Name"} </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
