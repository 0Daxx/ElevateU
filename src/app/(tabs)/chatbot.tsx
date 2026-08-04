import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  useColorScheme,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors, spacing, borderRadius } from "@/theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";

interface ChatMessage {
  id: string;
  sender: "AI" | "You";
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "AI",
    text: "Hello Rahul. Share your goal and I will suggest the next steps.",
  },
  {
    id: "2",
    sender: "You",
    text: "I want to become an AI engineer.",
  },
  {
    id: "3",
    sender: "AI",
    text: "Start with Python, DSA, ML basics, then small projects and resume improvement.",
  },
];

const SUGGESTED_PROMPTS = [
  "How to become AI engineer?",
  "Best React Native courses",
  "Improve my resume",
  "Interview questions",
];

export default function ChatbotScreen() {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [clickedPrompt, setClickedPrompt] = useState<boolean | null>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: text.trim(),
    };

    // 1. Instantly append user message & clear input
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    try {
      // 2. Use machine IP or 10.0.2.2 (Android emulator) instead of 127.0.0.1
      // Most local servers (LM Studio/Ollama) use standard OpenAI format: /v1/chat/completions
      const response = await fetch(
        "http://192.168.0.105:1234/v1/chat/completions",
        {
          // const response = await fetch("exp://192.168.0.105:8081/v1/chat/completions", {
          // const response = await fetch("http://192.168.1.50:1234/v1/chat/completions", {
          // const response = await fetch("http://192.168.1.50:1234/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: text.trim() , context: messages.map((msg) => ({ role: msg.sender === "You" ? "user" : "assistant", content: msg.text })) }],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      // 3. Parse JSON from server
      const data = await response.json();

      // Extract text (adjust path depending on your local AI server payload shape)
      const aiText =
        data.choices?.[0]?.message?.content || "No response generated.";

      // 4. Append actual AI response to messages state
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "AI",
        text: aiText,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Fetch Error:", error);

      // Fallback UI error message
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "AI",
        text: "Failed to reach AI server. Please check your local network connection.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={
          systemColorScheme === "light" ? "dark-content" : "light-content"
        }
      />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Chatbot
        </Text>
        <Pressable
          style={[
            styles.menuButton,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.menuIcon, { color: theme.textPrimary }]}>
            •••
          </Text>
        </Pressable>
      </View>

      {/* <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      > */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            AI ASSISTANT
          </Text>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Ask for career guidance, learning, or interview prep.
          </Text>
          <Text
            style={[styles.heroDescription, { color: theme.textSecondary }]}
          >
            Chat UI should feel compact, readable, and quick to start.
          </Text>
        </View>

        {/* Suggested Prompts Section */}
        <View
        // Hide after pressing a prompt 
          style={[
            styles.card,
            clickedPrompt && { display: "none" },
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              // visibility: clickedPrompt ? "hidden" : "visible",
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Suggested prompts
            </Text>
            <View
              style={[styles.badge, { backgroundColor: theme.badgeBackground }]}
            >
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                One tap
              </Text>
            </View>
          </View>

          {/* Prompt Chips */}
          <View style={styles.promptsWrap}>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => {
                  handleSendMessage(prompt);
                  setClickedPrompt(true);
                }}
                style={[
                  styles.promptChip,
                  {
                    backgroundColor: theme.badgeBackground,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.promptChipText,
                    { color: theme.textSecondary },
                  ]}
                >
                  {prompt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Chat Messages Timeline */}
        <View style={styles.chatList}>
          {messages.map((item) => {
            const isUser = item.sender === "You";
            return (
              <View
                key={item.id}
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubbleAlign : styles.aiBubbleAlign,
                  {
                    backgroundColor: isUser ? "#132A2F" : theme.cardBackground,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.senderLabel,
                    { color: isUser ? "#34D399" : theme.textPrimary },
                  ]}
                >
                  {item.sender}
                </Text>

                {/* Ai text in markdown , might add later  */}
                <Text
                  style={[styles.messageText, { color: theme.textSecondary }]}
                >
                  {item.text}
                </Text>
                {/* <EnrichedMarkdownText markdown={item.text} /> */}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Input Bar */}

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        behavior="position"
      >
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Type your message..."
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage()}
            />
            <Pressable
              onPress={() => handleSendMessage()}
              style={[styles.sendButton, { backgroundColor: theme.primary }]}
            >
              <Text
                style={[
                  styles.sendButtonText,
                  { color: theme.primaryButtonText },
                ]}
              >
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontSize: 14,
    fontWeight: "700",
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: 90, // Room for bottom input bar
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  promptsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  promptChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  promptChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  chatList: {
    gap: spacing.md,
  },
  messageBubble: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    maxWidth: "85%",
  },
  aiBubbleAlign: {
    alignSelf: "flex-start",
  },
  userBubbleAlign: {
    alignSelf: "flex-end",
  },
  senderLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    paddingHorizontal: spacing.xs,
  },
  sendButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
