import React, { useEffect, useState } from "react";
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
  FlatList,
  ActivityIndicator,
} from "react-native";
import { colors, spacing, borderRadius } from "@/theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { Modal } from "react-native";
import { Theme } from "../../../.expo/types/router";

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
// Configuration for local or cloud AI models
const AI_ENDPOINT = "http://192.168.0.105:1234/v1/chat/completions";
  
// Component
const ChatMessageItem = React.memo(
  ({ item, theme }: { item: ChatMessage; theme: Theme }) => {
    const isUser = item.sender === "You";
    return (
      <View
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
        <Text style={[styles.messageText, { color: isUser ? "#E2E8F0" : theme.textSecondary }]}>
          {item.text}
        </Text>
      </View>
    );
  }
);

// 2. Header & Suggested Prompts (Used in ListHeaderComponent for Inverted List)
const HeaderSection = React.memo(
  ({
    theme,
    showPrompts,
    onSelectPrompt,
  }: {
    theme: Theme;
    showPrompts: boolean;
    onSelectPrompt: (prompt: string) => void;
  }) => (
    <View style={styles.headerSectionContainer}>
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
        <Text style={[styles.heroDescription, { color: theme.textSecondary }]}>
          Chat UI should feel compact, readable, and quick to start.
        </Text>
      </View>

      {/* Suggested Prompts Section */}
      {showPrompts && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
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

          <View style={styles.promptsWrap}>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => onSelectPrompt(prompt)}
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
      )}
    </View>
  )
);

// 3. Clear Session Modal Component
const OptionMenuModal = React.memo(
  ({
    visible,
    onClose,
    onClearSession,
    theme,
  }: {
    visible: boolean;
    onClose: () => void;
    onClearSession: () => void;
    theme: Theme;
  }) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
            Options
          </Text>
          <Pressable
            style={styles.clearButton}
            onPress={() => {
              onClearSession();
              onClose();
            }}
          >
            <Text style={styles.clearButtonText}>Clear Chat Session</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={{ color: theme.textSecondary }}>Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
);

// --- Main Screen ---
export default function ChatbotScreen() {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme === "light" ? colors.light : colors.dark;

  // Inverted list requires newest messages at index 0
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    // Hide prompts section on first interaction
    if (!hasInteracted) setHasInteracted(true);

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "You",
      text: text.trim(),
    };

    const placeholderId = `ai-temp-${Date.now()}`;
    const placeholderMsg: ChatMessage = {
      id: placeholderId,
      sender: "AI",
      text: "Thinking...",
    };

    // Prepend new messages for INVERTED FlatList (Index 0 is bottom of screen)
    setMessages((prev) => [placeholderMsg, userMsg, ...prev]);
    if (!textToSend) setInputText("");
    setIsLoading(true);

    try {
      // Build full conversation history (ordered chronologically old -> new)
      const chatHistory = [...messages]
        .reverse()
        .filter((msg) => !msg.id.startsWith("ai-temp-"))
        .map((msg) => ({
          role: msg.sender === "You" ? "user" : "assistant",
          content: msg.text,
        }));

      // Add current message
      chatHistory.push({ role: "user", content: text.trim() });

      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory, // Full conversational context payload
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      const aiText =
        data.choices?.[0]?.message?.content || "No response generated.";

      // Replace "Thinking..." placeholder with AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholderId
            ? { id: (Date.now() + 1).toString(), sender: "AI", text: aiText }
            : msg
        )
      );
    } catch (error) {
      console.error("AI Fetch Error:", error);
      // Replace "Thinking..." placeholder with error text
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholderId
            ? {
                id: (Date.now() + 1).toString(),
                sender: "AI",
                text: "Failed to connect to AI server. Please check your network.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSession = () => {
    setMessages([]);
    setHasInteracted(false);
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

      {/* Top Header Bar */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Chatbot
        </Text>
        <Pressable
          onPress={() => setIsModalVisible(true)}
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

      {/* Chat Messages Timeline (Inverted FlatList) */}
      <FlatList
        inverted={true}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }: { item: ChatMessage }) => (
          <ChatMessageItem item={item} theme={theme} />
        )}
        // In inverted mode, ListFooterComponent displays at the TOP of the screen
        ListFooterComponent={
          <HeaderSection
            theme={theme}
            showPrompts={!hasInteracted}
            onSelectPrompt={(prompt) => handleSendMessage(prompt)}
          />
        }
      />

      {/* Floating Bottom Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              editable={!isLoading}
            />
            <Pressable
              onPress={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              style={[
                styles.sendButton,
                {
                  backgroundColor:
                    isLoading || !inputText.trim()
                      ? theme.textMuted
                      : theme.primary,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator  size="small" color="#FFF" />
              ) : (
                <Text
                  style={[
                    styles.sendButtonText,
                    { color: theme.primaryButtonText },
                  ]}
                >
                  Send
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal Options */}
      <OptionMenuModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onClearSession={handleClearSession}
        theme={theme}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  clearButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: spacing.xxl + 60 ,
    paddingBottom: 10,
  },
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
