import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ProfileButton from "../components/profileButton";
import HistoryButton from "../components/historyButton";
import AddReport from "../components/add-report";
import Title from "../components/title";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; sender: "me" | "expert" }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const listRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    loadUserContext();
  }, []);

  const loadUserContext = async () => {
    try {
      const storedUserData = await SecureStore.getItemAsync("userData");
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }

      const storedHistory = await SecureStore.getItemAsync("reportHistory");
      if (storedHistory) {
        setReportHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error loading user context:", error);
    }
  };

  const buildSystemPrompt = () => {
    let prompt = "You are a diabetes expert providing personalized advice. ";

    if (userData) {
      prompt += `\n\nUser Profile:
- Name: ${userData.firstName} ${userData.lastName}
- Age: ${userData.age} years
- Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- BMI: ${
        userData.weight && userData.height
          ? (
              parseFloat(userData.weight) /
              Math.pow(parseFloat(userData.height) / 100, 2)
            ).toFixed(1)
          : "N/A"
      }`;
    }

    if (reportHistory.length > 0) {
      prompt += "\n\nPrevious Report History (most recent first):";
      reportHistory.slice(0, 5).forEach((report, index) => {
        const date = new Date(report.date).toLocaleDateString();
        prompt += `\n\nReport ${index + 1} (${date}):
- Risk Level: ${report.riskLevel}
- Detected Values: ${Object.entries(report.detectedValues)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")}
- Recommendations: ${report.recommendations.join(", ")}`;
      });
    }

    prompt +=
      "\n\nProvide personalized, evidence-based advice considering the user's profile and medical history. Be empathetic, encouraging, and specific in your recommendations. If you notice concerning patterns in their reports, gently suggest consulting healthcare professionals.";

    return prompt;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    await loadUserContext();

    const userMsg = { role: "user", content: message.trim() };
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: message, sender: "me" },
    ]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://your server ip address:4000/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "hf.co/lmstudio-community/medgemma-4b-it-GGUF:Q4_K_M",
          messages: [{ role: "system", content: buildSystemPrompt() }, userMsg],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data?.message?.content ?? "Sorry, I couldn't generate a response.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: reply, sender: "expert" },
      ]);
    } catch (err) {
      console.error("Chat error", err);
      const errorMessage =
        err instanceof Error ? err.message : "Network error occurred";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `Error: ${errorMessage}. Please try again.`,
          sender: "expert",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.topBar}>
        <HistoryButton />
        <View style={{ paddingTop: 32 }}>
          <Title />
        </View>
        <ProfileButton />
      </View>

      <View style={styles.centerContent}>
        {messages.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.message}>
              {userData
                ? `Hello ${userData.firstName}! Chat with your Diabetes Expert.`
                : "Chat with the Diabetes Expert!"}
            </Text>
            {reportHistory.length > 0 && (
              <Text style={styles.subtitle}>
                I have access to your {reportHistory.length} previous report
                {reportHistory.length !== 1 ? "s" : ""} to provide personalized
                advice.
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === "me"
                    ? styles.messageBubbleRight
                    : styles.messageBubbleLeft,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <AddReport />
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.sendButtonPressed,
            isLoading && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? "hourglass" : "arrow-up"}
            size={24}
            color="black"
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  centerContent: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: "80%",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginVertical: 6,
  },
  messageBubbleRight: {
    backgroundColor: "#DCFCE7",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  messageBubbleLeft: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 32,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#F9FAFB",
    maxHeight: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffffff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
});
