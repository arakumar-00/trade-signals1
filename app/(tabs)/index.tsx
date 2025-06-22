import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { TrendingUp, TrendingDown, Settings2, Bell } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AssetSwitcher from '../../components/AssetSwitcher';
import TimeframeSwitcher from '../../components/TimeframeSwitcher';
import NotificationSheet from '@/components/NotificationSheet';
import SetupGuide from '@/components/SetupGuide';
import ConnectionStatus from '@/components/ConnectionStatus';
import MarketOverview from '@/components/MarketOverview';
import { fetchMarketData, fetchTechnicalIndicators, fetchEconomicEvents, MarketData, TechnicalIndicator, EconomicEvent } from '../../lib/database';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { colors, fontSizes } = useTheme();
  const [selectedAsset, setSelectedAsset] = useState<'XAU/USD' | 'XAG/USD'>('XAU/USD');
  const [timeframe, setTimeframe] = useState('1H');
  const [setupGuideVisible, setSetupGuideVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);

  useEffect(() => {
    loadData();
  }, [selectedAsset]);

  const loadData = async () => {
    try {
      const [market, indicators, events] = await Promise.all([
        fetchMarketData(),
        fetchTechnicalIndicators(selectedAsset),
        fetchEconomicEvents(),
      ]);

      setMarketData(market);
      setTechnicalIndicators(indicators);
      setEconomicEvents(events);
    } catch (error) {
      console.error('Error loading home screen data:', error);
    }
  };

  const currentData = marketData.find(item => item.pair === selectedAsset) || {
    price: selectedAsset === 'XAU/USD' ? 2345.67 : 29.45,
    change: selectedAsset === 'XAU/USD' ? 12.34 : -0.23,
    change_percent: selectedAsset === 'XAU/USD' ? 0.53 : -0.77,
    high: selectedAsset === 'XAU/USD' ? 2356.89 : 29.78,
    low: selectedAsset === 'XAU/USD' ? 2334.12 : 29.12,
    volume: selectedAsset === 'XAU/USD' ? '2.4M' : '1.8M',
  };

  const getTradingViewHTML = (symbol: string) => `
    <html>
      <body style="margin:0;padding:0;">
        <iframe src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_f9b65&symbol=${symbol.replace("/", "")}&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=light&style=1&timezone=exchange" style="width:100%;height:100%;border:none;"></iframe>
      </body>
    </html>
  `;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: fontSizes.title + 4,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
    },
    subtitle: {
      fontSize: fontSizes.medium,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      marginTop: 2,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Gold & Silver Signals</Text>
          <Text style={styles.subtitle}>Live Trading Opportunities</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setSetupGuideVisible(true)}
          >
            <Settings2 size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setNotificationVisible(true)}
          >
            <Bell size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ConnectionStatus />
      <MarketOverview />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <AssetSwitcher selectedAsset={selectedAsset} onAssetChange={setSelectedAsset} />

        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          marginHorizontal: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: fontSizes.subtitle, fontWeight: 'bold', color: colors.text }}> {selectedAsset} </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {currentData.change >= 0 ? (
                <TrendingUp size={16} color={colors.success} />
              ) : (
                <TrendingDown size={16} color={colors.error} />
              )}
              <Text style={{ color: currentData.change >= 0 ? colors.success : colors.error }}>
                {currentData.change >= 0 ? '+' : ''}{currentData.change_percent.toFixed(2)}%
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>{currentData.price.toFixed(2)}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.small, color: colors.textSecondary }}>High</Text>
              <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>{currentData.high.toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.small, color: colors.textSecondary }}>Low</Text>
              <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>{currentData.low.toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: fontSizes.small, color: colors.textSecondary }}>Volume</Text>
              <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>{currentData.volume}</Text>
            </View>
          </View>
        </View>

        <TimeframeSwitcher
          selectedTimeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />

        {Platform.OS === 'web' ? (
          <View
            style={{
              height: 300,
              marginHorizontal: 20,
              marginBottom: 24,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: colors.surface,
            }}
          >
            <iframe
              srcDoc={getTradingViewHTML(selectedAsset)}
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-scripts allow-same-origin"
            />
          </View>
        ) : (
          <View
            style={{
              height: 300,
              marginHorizontal: 20,
              marginBottom: 24,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: colors.surface,
            }}
          >
            <WebView
              source={{ html: getTradingViewHTML(selectedAsset) }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
          </View>
        )}

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: fontSizes.subtitle, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Technical Indicators</Text>
          <View style={{ gap: 12 }}>
            {technicalIndicators.map((indicator, index) => (
              <View key={indicator.id} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>{indicator.indicator_name}</Text>
                  <Text style={{ fontSize: fontSizes.medium, color: indicator.color }}>{indicator.value}</Text>
                </View>
                <Text style={{ fontSize: fontSizes.small, color: indicator.color }}>{indicator.status}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: fontSizes.subtitle, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Today's Economic Events</Text>
          <View style={{ gap: 12 }}>
            {economicEvents.map(event => (
              <View key={event.id} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: fontSizes.medium, color: colors.primary }}>{event.time}</Text>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    backgroundColor:
                      event.impact === 'high'
                        ? `${colors.error}33`
                        : event.impact === 'medium'
                          ? `${colors.warning}33`
                          : `${colors.textSecondary}33`,
                  }}>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: colors.text }}>{event.impact.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Text style={{ fontSize: fontSizes.small, color: colors.primary, backgroundColor: `${colors.primary}20`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>{event.currency}</Text>
                  <Text style={{ fontSize: fontSizes.medium, color: colors.text, flex: 1 }}>{event.event_name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: fontSizes.small, color: colors.textSecondary }}>Forecast: {event.forecast}</Text>
                  <Text style={{ fontSize: fontSizes.small, color: colors.textSecondary }}>Previous: {event.previous}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <NotificationSheet
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />

      <SetupGuide
        visible={setupGuideVisible}
        onClose={() => setSetupGuideVisible(false)}
      />
    </SafeAreaView>
  );
}