import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const History = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const history = await SecureStore.getItemAsync('reportHistory');
            if (history) {
                const parsed = JSON.parse(history);
                setReports(parsed.reverse());
            }
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderReport = ({ item }: { item: any }) => (
        <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportDate}>
                    {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={[styles.riskBadge, getRiskStyle(item.riskLevel)]}>
                    {item.riskLevel}
                </Text>
            </View>
            
            <View style={styles.valuesContainer}>
                {Object.entries(item.detectedValues).map(([key, value]) => (
                    <Text key={key} style={styles.valueText}>
                        {key}: {String(value)}
                    </Text>
                ))}
            </View>

            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
            {item.recommendations.map((rec: string, index: number) => (
                <Text key={index} style={styles.recommendationText}>• {rec}</Text>
            ))}
        </View>
    );

    const getRiskStyle = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'high': return styles.riskHigh;
            case 'medium': return styles.riskMedium;
            case 'low': return styles.riskLow;
            default: return styles.riskLow;
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
                    <Text style={styles.loadingText}>Loading history...</Text>
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
            
            <View style={styles.content}>
                <Text style={styles.title}>Report History</Text>
                {reports.length === 0 ? (
                    <View style={styles.card}>
                        <Text style={styles.message}>Your report history will appear here!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={reports}
                        keyExtractor={(item) => item.id}
                        renderItem={renderReport}
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 24,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minWidth: '80%',
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    list: {
        flex: 1,
        width: '100%',
    },
    reportCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    reportDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    riskHigh: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
    },
    riskMedium: {
        backgroundColor: '#FEF3C7',
        color: '#D97706',
    },
    riskLow: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
    },
    valuesContainer: {
        marginBottom: 12,
    },
    valueText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    recommendationsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
});

export default History;