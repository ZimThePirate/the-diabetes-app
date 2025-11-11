import React, { useState } from "react";
import { View, Pressable, StyleSheet, Modal, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Upload from "./upload";

const AddReport = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = async (result: any) => {
    setAnalysis(result);
    setIsAnalyzing(false);

    try {
      const existingHistory = await SecureStore.getItemAsync("reportHistory");
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      const newReport = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...result,
      };
      history.push(newReport);
      await SecureStore.setItemAsync("reportHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleAddPress = () => {
    setModalVisible(true);
    setAnalysis(null);
    setIsAnalyzing(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.addReport,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleAddPress}
      >
        <FontAwesome6 name="add" size={24} color="black" />
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawer}>
            {isAnalyzing ? (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Analyzing Report...</Text>
                <Text style={styles.loadingText}>
                  Please wait while we analyze your report
                </Text>
              </View>
            ) : analysis ? (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Analysis Result</Text>
                <Text style={styles.riskLevel}>
                  Risk Level: {analysis.riskLevel}
                </Text>
                <Text style={styles.recommendationsTitle}>
                  Recommendations:
                </Text>
                {analysis.recommendations.map((rec: string, index: number) => (
                  <Text key={index} style={styles.recommendation}>
                    • {rec}
                  </Text>
                ))}
                <Text style={styles.valuesTitle}>Detected Values:</Text>
                {Object.entries(analysis.detectedValues).map(([key, value]) => (
                  <Text key={key} style={styles.value}>
                    {key}: {String(value)}
                  </Text>
                ))}
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Upload
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisStart={handleAnalysisStart}
                />
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  addReport: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffffff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    backgroundColor: "#fff",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  drawerButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  drawerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: "#000",
    fontSize: 14,
  },
  analysisContainer: {
    padding: 20,
    alignItems: "center",
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111",
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
    alignSelf: "flex-start",
  },
  recommendation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  valuesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#111",
    alignSelf: "flex-start",
  },
  value: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});

export default AddReport;
