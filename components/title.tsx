import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Title = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Diabetes App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f1f1fff",
    textAlign: "center",
    letterSpacing: 1,
  },
});

export default Title;
