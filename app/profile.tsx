import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    weight: "",
    height: "",
    dateOfBirth: "",
    age: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await SecureStore.getItemAsync("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserDetails(parsedData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!userDetails.firstName) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Profile Data</Text>
          <Text style={styles.emptySubtitle}>
            Please complete your profile setup first.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your personal information</Text>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.label}>First Name</Text>
              <Text style={styles.value}>{userDetails.firstName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Last Name</Text>
              <Text style={styles.value}>{userDetails.lastName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>{userDetails.dateOfBirth}</Text>
            </View>

            <View style={styles.ageContainer}>
              <Text style={styles.ageLabel}>Age: </Text>
              <Text style={styles.ageValue}>{userDetails.age} years old</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Information</Text>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{userDetails.weight} kg</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.value}>{userDetails.height} cm</Text>
            </View>

            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>BMI: </Text>
              <Text style={styles.bmiValue}>
                {(() => {
                  const w = parseFloat(userDetails.weight);
                  const h = parseFloat(userDetails.height);
                  if (isNaN(w) || isNaN(h) || h === 0) return "N/A";
                  const bmi = w / Math.pow(h / 100, 2);
                  return bmi.toFixed(1);
                })()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  ageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  ageLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  ageValue: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },
  bmiContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  bmiLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  bmiValue: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default Profile;
