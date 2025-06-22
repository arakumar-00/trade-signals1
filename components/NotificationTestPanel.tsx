import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Bell, Send, TestTube, Award, TrendingUp, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  sendTestNotification,
  sendSignalNotification,
  sendAchievementNotification,
  registerForPushNotifications,
} from '../lib/notifications';

export default function NotificationTestPanel() {
  const { colors, fontSizes } = useTheme();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterDevice = async () => {
    setIsRegistering(true);
    try {
      const deviceId = await registerForPushNotifications();
      if (deviceId) {
        Alert.alert('Success', `Device registered with ID: ${deviceId.substring(0, 8)}...`);
      } else {
        Alert.alert('Error', 'Failed to register device for notifications');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register device');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleSignalNotification = async () => {
    try {
      await sendSignalNotification({
        id: 'test-signal-123',
        pair: 'XAU/USD',
        type: 'BUY',
        entry_price: 2345.67,
        status: 'active',
      });
      Alert.alert('Success', 'Signal notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send signal notification');
    }
  };

  const handleAchievementNotification = async () => {
    try {
      await sendAchievementNotification({
        title: 'Winning Streak',
        description: 'You\'ve achieved a 5-day winning streak!',
        type: 'streak',
      });
      Alert.alert('Success', 'Achievement notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send achievement notification');
    }
  };

  const testButtons = [
    {
      id: 'register',
      title: 'Register Device',
      description: 'Register this device for push notifications',
      icon: Bell,
      color: colors.primary,
      onPress: handleRegisterDevice,
      loading: isRegistering,
    },
    {
      id: 'test',
      title: 'Test Notification',
      description: 'Send a basic test notification',
      icon: TestTube,
      color: colors.secondary,
      onPress: handleTestNotification,
    },
    {
      id: 'signal',
      title: 'Signal Alert',
      description: 'Send a trading signal notification',
      icon: TrendingUp,
      color: colors.success,
      onPress: handleSignalNotification,
    },
    {
      id: 'achievement',
      title: 'Achievement',
      description: 'Send an achievement notification',
      icon: Award,
      color: colors.warning,
      onPress: handleAchievementNotification,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    title: {
      fontSize: fontSizes.subtitle,
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
    testButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    testButtonDisabled: {
      opacity: 0.6,
    },
    testButtonIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    testButtonContent: {
      flex: 1,
    },
    testButtonTitle: {
      fontSize: fontSizes.medium,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'Inter-SemiBold',
      marginBottom: 2,
    },
    testButtonDescription: {
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
    },
    sendIcon: {
      marginLeft: 8,
    },
    warning: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${colors.warning}15`,
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
    },
    warningIcon: {
      marginRight: 8,
    },
    warningText: {
      flex: 1,
      fontSize: fontSizes.small,
      color: colors.warning,
      fontFamily: 'Inter-Regular',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Bell size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>Notification Testing</Text>
          <Text style={styles.subtitle}>Test push notification system</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {testButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.testButton,
              button.loading && styles.testButtonDisabled,
            ]}
            onPress={button.onPress}
            disabled={button.loading}
          >
            <View style={[
              styles.testButtonIcon,
              { backgroundColor: `${button.color}20` }
            ]}>
              <button.icon size={20} color={button.color} />
            </View>
            <View style={styles.testButtonContent}>
              <Text style={styles.testButtonTitle}>
                {button.loading ? 'Processing...' : button.title}
              </Text>
              <Text style={styles.testButtonDescription}>
                {button.description}
              </Text>
            </View>
            <Send size={16} color={colors.textSecondary} style={styles.sendIcon} />
          </TouchableOpacity>
        ))}

        <View style={styles.warning}>
          <AlertCircle size={16} color={colors.warning} style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Notifications require device permissions and may not work in web preview. 
            Test on a physical device for best results.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}