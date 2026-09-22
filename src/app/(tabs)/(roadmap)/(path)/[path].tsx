import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useRoadmapStore } from "@/context/roadmapContext";

export default function Path() {
  const { path } = useLocalSearchParams();
  // fetch data for path 
  const { topics , projects} = useRoadmapStore();

  const roadmap = topics.find((topic) => topic.id === path);
  // ERROR LESSON :  path MUST be the same as the [path] in the file name, otherwise it will not work. 
  
  
  return (
    <View>
      <Text>Path</Text>
      <Text>Roadmap Name: {path || "No Name"} </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
