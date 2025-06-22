import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface MarketData {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function MarketOverview() {
  const { colors, fontSizes } = useTheme();

  // Updated to focus on Gold and Silver
  const marketData: MarketData[] = [
    { pair: 'XAU/USD', price: 2345.67, change: 12.34, changePercent: 0.53 },
    { pair: 'XAG/USD', price: 29.45, change: -0.23, changePercent: -0.77 },
    { pair: 'EUR/USD', price: 1.0867, change: 0.0023, changePercent: 0.21 },
    { pair: 'GBP/USD', price: 1.2634, change: -0.0012, changePercent: -0.09 },
    { pair: 'USD/JPY', price: 149.67, change: 0.45, changePercent: 0.30 },
    { pair: 'AUD/USD', price: 0.6542, change: 0.0018, changePercent: 0.28 },
  ];

  const renderMarketItem = (item: MarketData) => (
    <View key={item.pair} style={styles.marketItem}>
      <Text style={styles.pairText}>{item.pair}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          {item.pair.includes('XAU') || item.pair.includes('XAG')
            ? item.price.toFixed(2)
            : item.price.toFixed(4)}
        </Text>
        <View style={styles.changeContainer}>
          {item.change >= 0 ? (
            <TrendingUp size={12} color={colors.success} />
          ) : (
            <TrendingDown size={12} color={colors.error} />
          )}
          <Text style={[
            styles.changeText,
            item.change >= 0 ? styles.profitText : styles.lossText
          ]}>
            {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    title: {
      fontSize: fontSizes.medium,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-SemiBold',
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    scrollContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    marketItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      minWidth: 120,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pairText: {
      fontSize: fontSizes.medium,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-SemiBold',
      marginBottom: 6,
    },
    priceContainer: {
      gap: 4,
    },
    priceText: {
      fontSize: fontSizes.small,
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    changeText: {
      fontSize: fontSizes.small - 2,
      fontFamily: 'Inter-SemiBold',
    },
    profitText: {
      color: colors.success,
    },
    lossText: {
      color: colors.error,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Overview</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {marketData.map(renderMarketItem)}
      </ScrollView>
    </View>
  );
}