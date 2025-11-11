import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ProfileButton = () => {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push("/profile");
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.profileButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleProfilePress}
      >
        <Ionicons name="person" size={24} color="#000000ff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 32,
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffffff",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

export default ProfileButton;
