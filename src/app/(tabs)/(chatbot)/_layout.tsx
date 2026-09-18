import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
// Import icons (Ionicons comes pre-installed with Expo)
// import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcon } from "expo-router/build/native-tabs"; 
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { ChatMessage } from "./chatbot"; // Adjust path as needed

interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
}

// 1. Create a dedicated component for the Hamburger Button
// We do this so we can safely use the useNavigation hook
function DrawerToggleButton() {
    const navigation = useNavigation();
    
    return (
        <Pressable 
            // onPress={() => navigation.openDrawer()} 
            onPress={() => navigation.openDrawer() } 
            style={{ marginLeft: 15, padding: 5 }}
        >
            {/* The 3 horizontal lines icon */}
            <Ionicons name="menu" size={28} color="black" />
        </Pressable>
    );
}

// 2. Your Custom Sidebar (from previous step)
function CustomSidebar({ 
    chatSessions, 
    onNewChat 
}: { 
    chatSessions: ChatSession[], 
    onNewChat: () => void 
}) {
    const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

    return (
        <View style={styles.sidebarContainer}>
            <Pressable style={styles.newChatButton} onPress={onNewChat}>
                <Text style={styles.newChatText}>+ New Chat</Text>
            </Pressable>

            <FlatList
                data={chatSessions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isActive = sessionId === item.id; 
                    return (
                        <Pressable 
                            style={[styles.sessionItem, isActive && styles.activeSession]}
                            onPress={() => router.push(`/(tabs)/(chatbot)/chatbot?sessionId=${item.id}`)}
                        >
                            <Text style={styles.sessionTitle}>{item.title}</Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

export default function ChatLayout() {
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([
        { id: "1", title: "Session 1", messages: [{
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
  },] },
        { id: "2", title: "Session 2", messages: [] },
        { id: "3", title: "Session 3", messages: [] },
        { id: "4", title: "Session 4", messages: [] }
    ]);

    const handleNewChat = () => {
        const newId = String(Date.now());
        const newSession: ChatSession = {
            id: newId,
            title: `Session ${chatSessions.length + 1}`,
            messages: []
        };
        
        setChatSessions([newSession, ...chatSessions]);
        // Note the updated path to match your folder structure
        router.push(`/(tabs)/(chatbot)/chatbot?sessionId=${newId}`);
    };

    return (
        <Drawer
            drawerContent={(props) => (
                <CustomSidebar 
                    chatSessions={chatSessions} 
                    onNewChat={handleNewChat} 
                />
            )}
        >
            <Drawer.Screen 
                name="chatbot" 
                options={{ 
                    title: "Chat",
                    // 3. EXPLICITLY ADD THE HAMBURGER MENU HERE
                    headerLeft: () => <DrawerToggleButton />,
                    // Ensure the header is actually visible
                    headerShown: true, 
                }} 
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    sidebarContainer: {
        flex: 1,
        paddingTop: 50, 
        backgroundColor: '#fff',
    },
    newChatButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        margin: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    newChatText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sessionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    activeSession: {
        backgroundColor: '#e6f2ff',
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    sessionTitle: {
        fontSize: 16,
        color: '#333',
    },
});