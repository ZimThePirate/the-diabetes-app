import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";

interface UserDetailProps {
  onNext: () => void;
  onBack?: () => void;
}

const UserDetail = ({ onNext, onBack }: UserDetailProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateDate = (dateStr: string) => {
    if (!dateStr) return false;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return false;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    const date = new Date(year, month, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  };

  const validateNumeric = (value: string, fieldName: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return `${fieldName} must be a positive number`;
    if (fieldName === "Weight" && (num < 20 || num > 300))
      return "Weight must be between 20-300 kg";
    if (fieldName === "Height" && (num < 50 || num > 250))
      return "Height must be between 50-250 cm";
    return "";
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!weight.trim()) newErrors.weight = "Weight is required";
    else {
      const weightError = validateNumeric(weight, "Weight");
      if (weightError) newErrors.weight = weightError;
    }
    if (!height.trim()) newErrors.height = "Height is required";
    else {
      const heightError = validateNumeric(height, "Height");
      if (heightError) newErrors.height = heightError;
    }
    if (!dateOfBirth.trim())
      newErrors.dateOfBirth = "Date of birth is required";
    else if (!validateDate(dateOfBirth))
      newErrors.dateOfBirth = "Date must be in DD/MM/YYYY format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (dob: string) => {
    if (!dob || !validateDate(dob)) return null;

    const parts = dob.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const birthDate = new Date(year, month, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : null;
  };

  const age = calculateAge(dateOfBirth);

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      weight: weight.trim(),
      height: height.trim(),
      dateOfBirth,
      age: calculateAge(dateOfBirth),
    };

    try {
      await SecureStore.setItemAsync("userData", JSON.stringify(userData));
      onNext();
    } catch (error) {
      console.error("Error saving user data:", error);
      onNext();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Personal Details</Text>
        <Text style={styles.subtitle}>Please enter your information</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errors.firstName)
                  setErrors((prev) => ({ ...prev, firstName: "" }));
              }}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (errors.lastName)
                  setErrors((prev) => ({ ...prev, lastName: "" }));
              }}
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={[styles.input, errors.weight && styles.inputError]}
              value={weight}
              onChangeText={(text) => {
                setWeight(text);
                if (errors.weight)
                  setErrors((prev) => ({ ...prev, weight: "" }));
              }}
              placeholder="Enter your weight"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
            {errors.weight && (
              <Text style={styles.errorText}>{errors.weight}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={[styles.input, errors.height && styles.inputError]}
              value={height}
              onChangeText={(text) => {
                setHeight(text);
                if (errors.height)
                  setErrors((prev) => ({ ...prev, height: "" }));
              }}
              placeholder="Enter your height"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
            {errors.height && (
              <Text style={styles.errorText}>{errors.height}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={[styles.input, errors.dateOfBirth && styles.inputError]}
              value={dateOfBirth}
              onChangeText={(text) => {
                setDateOfBirth(text);
                if (errors.dateOfBirth)
                  setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
              }}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
            />
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}
            {age !== null && (
              <View style={styles.ageContainer}>
                <Text style={styles.ageLabel}>Age: </Text>
                <Text style={styles.ageValue}>{age} years old</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {onBack && (
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onBack}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
    gap: 12,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  ageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  ageLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  ageValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
});

export default UserDetail;
