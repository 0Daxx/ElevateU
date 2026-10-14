import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Modal,
  Vibration,
  // Clipboard,
  Alert,
} from "react-native";
// import {useClipboard} from '@react-native-clipboard/clipboard';
import { SafeAreaView } from "react-native-safe-area-context";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { colors, spacing, borderRadius } from "@/theme/theme";

// --- Types ---
export interface ChatMessage {
  id: string;
  sender: "AI" | "You";
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
}

type Theme = {
  background: string;
  cardBackground: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryButtonText: string;
  badgeBackground: string;
  badgeText: string;
  divider: string;
};

// --- Configuration ---
const AI_ENDPOINT = "http://192.168.0.107:1234/v1/chat/completions";

const SUGGESTED_PROMPTS = [
  "How to become an AI engineer?",
  "Best React Native courses",
  "Improve my resume",
  "Interview questions",
];

const DEFAULT_SESSION: ChatSession = {
  id: "default-1",
  name: "New Session",
  messages: [
    {
      id: "1",
      sender: "AI",
      text: "Hello! Share your goal and I will suggest the next steps.",
      timestamp: Date.now(),
    },
  ],
};

// --- Components ---

const ChatMessageItem = React.memo(
  ({
    item,
    theme,
    onLongPress,
    onCopy,
    isLastAiMessage,
    onRegenerate,
  }: {
    item: ChatMessage;
    theme: Theme;
    onLongPress: () => void;
    onCopy: () => void;
    isLastAiMessage: boolean;
    onRegenerate: () => void;
  }) => {
    const isUser = item.sender === "You";
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? styles.userBubbleAlign : styles.aiBubbleAlign,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? "#132A2F" : theme.cardBackground,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.messageHeader}>
            <Text
              style={[
                styles.senderLabel,
                { color: isUser ? "#34D399" : theme.textPrimary },
              ]}
            >
              {item.sender}
            </Text>
            <Text style={[styles.timestamp, { color: theme.textMuted }]}>
              {time}
            </Text>
          </View>

          {isUser ? (
            <Text style={[styles.messageText, { color: "#E2E8F0" }]}>
              {item.text}
            </Text>
          ) : (
            // <EnrichedMarkdownText
            <Text>
              {item.text}
            </Text>
              // markdown={item.text}
              // style={{ color: theme.textSecondary }}
            // />
          )}

          {!isUser && (
            <View style={styles.aiActions}>
              <Pressable onPress={onCopy} style={styles.actionButton}>
                <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                  Copy
                </Text>
              </Pressable>
              {isLastAiMessage && (
                <Pressable onPress={onRegenerate} style={styles.actionButton}>
                  <Text
                    style={{
                      color: theme.primary,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Regenerate
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
        {isUser && (
          <Pressable
            onLongPress={() => {
              Vibration.vibrate(10);
              onLongPress();
            }}
            style={styles.editHint}
          >
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>
              Long press to edit
            </Text>
          </Pressable>
        )}
      </View>
    );
  }
);

const HeaderSection = React.memo(
  ({
    theme,
    showPrompts,
    onSelectPrompt,
  }: {
    theme: Theme;
    showPrompts: boolean;
    onSelectPrompt: (prompt: string) => void;
  }) => {
    if (!showPrompts) return null;
    return (
      <View style={styles.headerSectionContainer}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            AI ASSISTANT
          </Text>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Ask for career guidance, learning, or interview prep.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Suggested prompts
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.badgeBackground }]}>
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
                  { backgroundColor: theme.badgeBackground, borderColor: theme.cardBorder },
                ]}
              >
                <Text style={[styles.promptChipText, { color: theme.textSecondary }]}>
                  {prompt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }
);

// --- Main Screen ---
export default function ChatbotScreen() {
  // const Clipboard = useClipboard();
  const systemColorScheme = useColorScheme();
  const theme = (systemColorScheme === "light" ? colors.light : colors.dark) as Theme;

  const [sessions, setSessions] = useState<ChatSession[]>([DEFAULT_SESSION]);
  const [activeSessionId, setActiveSessionId] = useState(DEFAULT_SESSION.id);
  const [inputText, setInputText] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Session Management Modals
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);

  // Scroll & Abort refs
  const flatListRef = useRef<FlatList>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || DEFAULT_SESSION;
  const lastAiMessageId = [...activeSession.messages].reverse().find((m) => m.sender === "AI")?.id;

  // --- Helpers ---
  const updateSessionMessages = useCallback(
    (sessionId: string, updater: (msgs: ChatMessage[]) => ChatMessage[]) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: updater(s.messages) } : s))
      );
    },
    []
  );

  const scrollToBottom = () => {
    // In inverted FlatList, offset 0 is the bottom (newest messages)
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const onScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(offsetY > 50);
  };

  // --- AI Generation Logic ---
  const generateAIResponse = async (currentMessages: ChatMessage[], newUserText: string) => {
    setIsLoading(true);
    const placeholderId = `ai-temp-${Date.now()}`;
    const placeholderMsg: ChatMessage = {
      id: placeholderId,
      sender: "AI",
      text: "Thinking...",
      timestamp: Date.now(),
    };

    const messagesWithPlaceholder = [...currentMessages, placeholderMsg];
    updateSessionMessages(activeSessionId, () => messagesWithPlaceholder);
    scrollToBottom();

    abortControllerRef.current = new AbortController();

    try {
      const chatHistory = currentMessages.map((msg) => ({
        role: msg.sender === "You" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`Server status ${response.status}`);
      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "No response generated.";

      updateSessionMessages(activeSessionId, (prev) =>
        prev.map((m) =>
          m.id === placeholderId ? { ...m, id: `ai-${Date.now()}`, text: aiText } : m
        )
      );
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted by user");
        updateSessionMessages(activeSessionId, (prev) =>
          prev.filter((m) => !m.id.startsWith("ai-temp-"))
        );
      } else {
        console.error("AI Fetch Error:", error);
        updateSessionMessages(activeSessionId, (prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? { ...m, id: `ai-${Date.now()}`, text: "Failed to connect to AI server." }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // --- Actions ---
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    Vibration.vibrate(10);
    if (!hasInteracted) setHasInteracted(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: text.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...activeSession.messages, userMsg];
    updateSessionMessages(activeSessionId, () => newMessages);
    setInputText("");

    await generateAIResponse(newMessages, text.trim());
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleEditMessage = (messageId: string) => {
    const msg = activeSession.messages.find((m) => m.id === messageId);
    if (msg) {
      setInputText(msg.text);
      setEditingMessageId(messageId);
      Vibration.vibrate(10);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !inputText.trim()) return;

    const msgIndex = activeSession.messages.findIndex((m) => m.id === editingMessageId);
    if (msgIndex === -1) return;

    Vibration.vibrate(10);

    // PRUNE: Keep only messages up to the edited one
    const prunedMessages = activeSession.messages.slice(0, msgIndex);
    const updatedMessage: ChatMessage = {
      id: editingMessageId,
      sender: "You",
      text: inputText.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...prunedMessages, updatedMessage];
    updateSessionMessages(activeSessionId, () => newMessages);
    setEditingMessageId(null);
    setInputText("");

    // Regenerate from this point
    await generateAIResponse(newMessages, inputText.trim());
  };

  const handleRegenerate = () => {
    const lastAiIndex = [...activeSession.messages].reverse().findIndex((m) => m.sender === "AI");
    if (lastAiIndex === -1) return;

    const actualIndex = activeSession.messages.length - 1 - lastAiIndex;
    const prunedMessages = activeSession.messages.slice(0, actualIndex);

    updateSessionMessages(activeSessionId, () => prunedMessages);

    const lastUserMsg = prunedMessages[prunedMessages.length - 1];
    if (lastUserMsg && lastUserMsg.sender === "You") {
      generateAIResponse(prunedMessages, lastUserMsg.text);
    }
  };

  // --- Session Management ---
  const handleCreateSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Session ${sessions.length + 1}`,
      messages: [
        { id: Date.now().toString(), sender: "AI", text: "New session started. How can I help?", timestamp: Date.now() }
      ],
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setShowSessionModal(false);
    setHasInteracted(false);
  };

  const handleDeleteSession = (id: string) => {
    if (sessions.length === 1) {
      Alert.alert("Cannot Delete", "You must have at least one session.");
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(sessions.find((s) => s.id !== id)?.id || "");
    }
  };

  const openRenameModal = (session: ChatSession) => {
    setSessionToRename(session.id);
    setRenameText(session.name);
    setShowRenameModal(true);
  };

  const saveRename = () => {
    if (sessionToRename && renameText.trim()) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionToRename ? { ...s, name: renameText.trim() } : s))
      );
      setShowRenameModal(false);
      setSessionToRename(null);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={systemColorScheme === "light" ? "dark-content" : "light-content"} />

      {/* Top Header Bar */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>
          {activeSession.name}
        </Text>
        <Pressable
          onPress={() => setShowSessionModal(true)}
          style={[styles.menuButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.menuIcon, { color: theme.textPrimary }]}>☰</Text>
        </Pressable>
      </View>

      {/* Chat Messages Timeline */}
      <FlatList
        inverted={true}
        data={[...activeSession.messages].reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ref={flatListRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <ChatMessageItem
            item={item}
            theme={theme}
            onLongPress={() => handleEditMessage(item.id)}
            onCopy={() => {
              // Clipboard.set([{ string: item.text }]);
              // Clipboard.setString(item.text);
              Vibration.vibrate(10);
            }}
            isLastAiMessage={item.id === lastAiMessageId}
            onRegenerate={handleRegenerate}
          />
        )}
        ListFooterComponent={
          <HeaderSection
            theme={theme}
            showPrompts={!hasInteracted}
            onSelectPrompt={handleSendMessage}
          />
        }
      />

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Pressable
          style={[styles.scrollBottomButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          onPress={scrollToBottom}
        >
          <Text style={{ color: theme.textPrimary, fontSize: 18 }}>↓</Text>
        </Pressable>
      )}

      {/* Floating Bottom Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
            ]}
          >
            {inputText.length > 0 && (
              <Pressable onPress={() => setInputText("")} style={styles.clearInputButton}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>✕</Text>
              </Pressable>
            )}

            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder={editingMessageId ? "Edit your message..." : "Type your message..."}
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => (editingMessageId ? handleSaveEdit() : handleSendMessage())}
              editable={!isLoading}
              multiline
              maxLength={500}
            />

            <Text style={[styles.charCount, { color: theme.textMuted }]}>{inputText.length}/500</Text>

            {isLoading ? (
              <Pressable onPress={handleCancel} style={[styles.sendButton, { backgroundColor: "#EF4444" }]}>
                <Text style={[styles.sendButtonText, { color: "#FFF" }]}>Cancel</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => (editingMessageId ? handleSaveEdit() : handleSendMessage())}
                disabled={!inputText.trim()}
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? theme.primary : theme.textMuted },
                ]}
              >
                <Text style={[styles.sendButtonText, { color: theme.primaryButtonText }]}>
                  {editingMessageId ? "Save" : "Send"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Session Management Modal */}
      <Modal visible={showSessionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Sessions</Text>
              <Pressable onPress={() => setShowSessionModal(false)}>
                <Text style={{ color: theme.textPrimary, fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>

            <Pressable
              style={[styles.newSessionButton, { backgroundColor: theme.primary }]}
              onPress={handleCreateSession}
            >
              <Text style={[styles.newSessionText, { color: theme.primaryButtonText }]}>+ New Session</Text>
            </Pressable>

            <ScrollView style={styles.sessionList}>
              {sessions.map((session) => (
                <View
                  key={session.id}
                  style={[
                    styles.sessionItem,
                    {
                      borderColor: theme.cardBorder,
                      backgroundColor: session.id === activeSessionId ? theme.badgeBackground : "transparent",
                    },
                  ]}
                >
                  <Pressable
                    style={styles.sessionNameContainer}
                    onPress={() => {
                      setActiveSessionId(session.id);
                      setShowSessionModal(false);
                    }}
                  >
                    <Text style={[styles.sessionName, { color: theme.textPrimary }]} numberOfLines={1}>
                      {session.name}
                    </Text>
                    <Text style={[styles.sessionCount, { color: theme.textMuted }]}>
                      {session.messages.length} msgs
                    </Text>
                  </Pressable>
                  <View style={styles.sessionActions}>
                    <Pressable onPress={() => openRenameModal(session)} style={styles.actionIcon}>
                      <Text style={{ color: theme.textPrimary, fontSize: 16 }}>✎</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDeleteSession(session.id)} style={styles.actionIcon}>
                      <Text style={{ color: "#EF4444", fontSize: 16 }}>🗑</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Rename Session Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder, width: "85%" }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Rename Session</Text>
            <TextInput
              style={[styles.renameInput, { backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.cardBorder }]}
              value={renameText}
              onChangeText={setRenameText}
              maxLength={30}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowRenameModal(false)} style={styles.modalCancelButton}>
                <Text style={{ color: theme.textSecondary }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveRename} style={[styles.modalSaveButton, { backgroundColor: theme.primary }]}>
                <Text style={[styles.modalSaveText, { color: theme.primaryButtonText }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", flex: 1, marginRight: spacing.md },
  menuButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  menuIcon: { fontSize: 16, fontWeight: "700" },
  listContainer: { paddingHorizontal: 16, paddingTop: spacing.xxl + 40, paddingBottom: 100 },

  // Message Bubbles
  messageWrapper: { marginBottom: spacing.md, maxWidth: "85%" },
  aiBubbleAlign: { alignSelf: "flex-start" },
  userBubbleAlign: { alignSelf: "flex-end" },
  messageBubble: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md },
  messageHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  senderLabel: { fontSize: 12, fontWeight: "700" },
  timestamp: { fontSize: 10, fontWeight: "500" },
  messageText: { fontSize: 15, lineHeight: 22 },
  aiActions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  actionButton: { paddingVertical: 4 },
  editHint: { alignSelf: "flex-end", marginTop: 4 },

  // Input Area
  inputWrapper: { position: "absolute", bottom: 0, left: 0, right: 0, padding: spacing.lg, paddingBottom: spacing.xl },
  inputContainer: { flexDirection: "row", alignItems: "center", borderRadius: borderRadius.xl, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  clearInputButton: { padding: spacing.sm },
  input: { flex: 1, minHeight: 44, maxHeight: 100, fontSize: 15, paddingHorizontal: spacing.xs },
  charCount: { fontSize: 10, marginRight: spacing.xs },
  sendButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.lg },
  sendButtonText: { fontSize: 14, fontWeight: "600" },

  // Scroll Button
  scrollBottomButton: { position: "absolute", bottom: 100, right: 20, width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },

  // Header Section
  headerSectionContainer: { marginBottom: spacing.lg },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
  categoryLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: spacing.xs },
  heroTitle: { fontSize: 22, fontWeight: "800", lineHeight: 28, marginBottom: spacing.xs },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.lg },
  badgeText: { fontSize: 11, fontWeight: "600" },
  promptsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  promptChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, borderWidth: 1 },
  promptChipText: { fontSize: 13, fontWeight: "500" },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: spacing.lg, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  newSessionButton: { padding: spacing.md, borderRadius: borderRadius.lg, alignItems: "center", marginBottom: spacing.lg },
  newSessionText: { fontSize: 15, fontWeight: "700" },
  sessionList: { flexGrow: 0 },
  sessionItem: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, marginBottom: spacing.sm },
  sessionNameContainer: { flex: 1 },
  sessionName: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  sessionCount: { fontSize: 12 },
  sessionActions: { flexDirection: "row", gap: spacing.lg },
  actionIcon: { padding: spacing.xs },

  // Rename Modal Specifics
  renameInput: { width: "100%", borderWidth: 1, borderRadius: borderRadius.lg, padding: spacing.md, fontSize: 15, marginBottom: spacing.lg },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.md },
  modalCancelButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  modalSaveButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: borderRadius.lg },
  modalSaveText: { fontSize: 14, fontWeight: "600" },
});