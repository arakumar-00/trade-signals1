import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const currencyRates = {
    USD: 1,
    INR: 83.2,
    EUR: 0.93,
    GBP: 0.79,
    JPY: 157.4,
};

const CalculatorScreen = () => {
    const { colors, fontSizes } = useTheme();
    const [amount, setAmount] = useState('');
    const [conversionResult, setConversionResult] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY'>('INR');

    const handleCalculate = () => {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
            const converted = parsedAmount * currencyRates[selectedCurrency];
            setConversionResult(`${converted.toFixed(2)} ${selectedCurrency}`);
        } else {
            setConversionResult('Invalid input');
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Currency Calculator</Text>

            <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter amount in USD"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <View style={styles.currencyRow}>
                {Object.keys(currencyRates).map((cur) => (
                    <TouchableOpacity
                        key={cur}
                        onPress={() => setSelectedCurrency(cur as any)}
                        style={[styles.currencyButton, selectedCurrency === cur && { backgroundColor: colors.primary }]}
                    >
                        <Text
                            style={{
                                color: selectedCurrency === cur ? colors.background : colors.textSecondary,
                                fontWeight: '600',
                            }}
                        >
                            {cur}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.calculateButton, { backgroundColor: colors.primary }]}
                onPress={handleCalculate}
            >
                <Text style={{ color: colors.background, fontWeight: 'bold' }}>Calculate</Text>
            </TouchableOpacity>

            {conversionResult !== '' && (
                <Text style={[styles.resultText, { color: colors.text }]}>{conversionResult}</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    currencyRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    currencyButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    calculateButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    resultText: {
        fontSize: 20,
        textAlign: 'center',
    },
});

export default CalculatorScreen;
