import React from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  compact?: boolean;
  onPicked?: (result: any) => void;
  onAnalysisComplete?: (analysis: any) => void;
  onAnalysisStart?: () => void;
};

const Upload = ({
  compact = false,
  onPicked,
  onAnalysisComplete,
  onAnalysisStart,
}: Props) => {
  const handlePickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access photos is required."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      console.log("Picked image", result);
      onPicked?.(result);
      onAnalysisStart?.();
      setTimeout(() => {
        onAnalysisComplete?.({
          riskLevel: "Low",
          recommendations: ["Continue monitoring", "Healthy diet"],
          detectedValues: { glucose: "98 mg/dL" },
        });
      }, 2000);
    }
  };

  const handleTakePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access camera is required."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      console.log("Captured photo", result);
      onPicked?.(result);
      onAnalysisStart?.();
      setTimeout(() => {
        onAnalysisComplete?.({
          riskLevel: "Medium",
          recommendations: ["Consult doctor", "Check HbA1c levels"],
          detectedValues: { glucose: "140 mg/dL" },
        });
      }, 2000);
    }
  };

  const handleDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if ((result as any).type !== "cancel") {
      console.log("Selected file:", result);
      onPicked?.(result);
      onAnalysisStart?.();
      setTimeout(() => {
        onAnalysisComplete?.({
          riskLevel: "High",
          recommendations: [
            "Immediate medical attention",
            "Lifestyle changes needed",
          ],
          detectedValues: { glucose: "200 mg/dL", hba1c: "8.5%" },
        });
      }, 2000);
    }
  };

  const handlePress = () => {
    handlePickFromLibrary();
  };

  const handleLongPress = () => {
    handleTakePhoto();
  };

  if (compact) {
    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
      >
        <Ionicons name="camera" size={20} color="#fff" />
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          onPress={handleTakePhoto}
          style={({ pressed }) => [
            styles.smallButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons name="camera" size={32} color="#fff" />
        </Pressable>
        <Pressable
          onPress={handleDocument}
          style={({ pressed }) => [
            styles.smallButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons name="document" size={32} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 32,
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
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  smallButton: {
    backgroundColor: "#111",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: "#111",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconButtonPressed: {
    opacity: 0.85,
  },
});

export default Upload;
