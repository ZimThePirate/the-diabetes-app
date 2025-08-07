import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';

interface UserDetailProps {
    onNext: () => void;
    onBack?: () => void;
}

const UserDetail = ({ onNext, onBack }: UserDetailProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const calculateAge = (dob: string) => {
        if (!dob) return null;

        const parts = dob.split('/');
        if (parts.length !== 3) return null;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

        const birthDate = new Date(year, month, day);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 0 ? age : null;
    };

    const age = calculateAge(dateOfBirth);

    const handleSubmit = () => {
        if (firstName && lastName && weight && height && dateOfBirth) {
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
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter your first name"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter your last name"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="Enter your weight"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput
                            style={styles.input}
                            value={height}
                            onChangeText={setHeight}
                            placeholder="Enter your height"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            value={dateOfBirth}
                            onChangeText={setDateOfBirth}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="#9CA3AF"
                        />
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
        backgroundColor: '#fff',
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
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
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
        fontWeight: '500',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
        gap: 12,
    },
    button: {
        backgroundColor: '#111',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
        flex: 1,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        flex: 1,
    },
    buttonPressed: {
        opacity: 0.85,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    secondaryButtonText: {
        color: '#374151',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    ageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#10B981',
    },
    ageLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    ageValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
});

export default UserDetail;