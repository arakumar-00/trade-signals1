import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Award,
  Target,
  TrendingUp,
  Share2,
  Moon,
  Sun,
  Type
} from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors, fontSizes, theme, setTheme, fontSize, setFontSize } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const userStats = {
    memberSince: 'January 2024',
    totalSignals: 127,
    successRate: 68.4,
    totalProfit: 2543.67,
    rank: 'Advanced Trader',
    level: 4,
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing Gold & Silver trading signals app! Get real-time trading opportunities and boost your portfolio.',
        url: 'https://your-app-url.com', // Replace with actual app URL
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const menuItems = [
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: Bell,
      color: colors.warning,
      onPress: () => Alert.alert('Notifications', 'Notification settings coming soon!'),
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      color: colors.success,
      onPress: () => Alert.alert('Security', 'Security settings coming soon!'),
    },
    {
      id: 'share',
      title: 'Share App',
      icon: Share2,
      color: colors.secondary,
      onPress: handleShare,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      color: colors.primary,
      onPress: () => Alert.alert('Help', 'Contact support at help@tradingsignals.com'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
          <item.icon size={20} color={item.color} />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderStat = (icon: any, value: string, label: string, color: string) => (
    <View style={styles.statCard}>
      {React.createElement(icon, { size: 20, color })}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    profileHeader: {
      alignItems: 'center',
      paddingVertical: 24,
      marginBottom: 24,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
    },
    levelBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    levelText: {
      color: colors.background,
      fontSize: fontSizes.small,
      fontFamily: 'Inter-Bold',
    },
    profileInfo: {
      alignItems: 'center',
    },
    userName: {
      fontSize: fontSizes.title,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
      marginBottom: 4,
    },
    userRank: {
      fontSize: fontSizes.medium,
      color: colors.primary,
      fontFamily: 'Inter-SemiBold',
      marginBottom: 4,
    },
    memberSince: {
      fontSize: fontSizes.medium,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 32,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: fontSizes.subtitle,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: fontSizes.subtitle,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingText: {
      fontSize: fontSizes.medium,
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    themeButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    themeButton: {
      // flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    themeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeButtonText: {
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Inter-Medium',
    },
    themeButtonTextActive: {
      color: colors.background,
    },
    fontSizeButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    fontSizeButton: {
      // flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    fontSizeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    fontSizeButtonText: {
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Inter-Medium',
    },
    fontSizeButtonTextActive: {
      color: colors.background,
    },
    menuContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: fontSizes.medium,
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: `${colors.error}20`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: `${colors.error}40`,
    },
    logoutText: {
      fontSize: fontSizes.medium,
      color: colors.error,
      fontFamily: 'Inter-SemiBold',
    },
    versionText: {
      textAlign: 'center',
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      paddingBottom: 20,
    },
  });

  return (

    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? (
        <ScrollView style={{ padding: 20 }}>
          {/* Profile Header */}

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color={colors.text} />
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{userStats.level}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Gold & Silver Trader</Text>
              <Text style={styles.userRank}>{userStats.rank}</Text>
              <Text style={styles.memberSince}>Member since {userStats.memberSince}</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            {renderStat(
              Award,
              `$${userStats.totalSignals.toString()}`,
              'Total Signals',
              colors.warning
            )}
            {renderStat(
              Target,
              `${userStats.successRate}%`,
              'Success Rate',
              colors.success
            )}
            {renderStat(
              TrendingUp,
              `$${userStats.totalProfit.toLocaleString()}`,
              'Total Profit',
              colors.secondary
            )}
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={colors.warning} />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Moon size={20} color={colors.secondary} />
                <Text style={styles.settingText}>Theme</Text>
              </View>
              <View style={styles.themeButtons}>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'light' && styles.themeButtonActive
                  ]}
                  onPress={() => {
                    console.log('Clicked Light'); // Add this
                    setTheme('light');
                  }}
                >
                  <Sun size={14} color={theme === 'light' ? colors.background : colors.textSecondary} />
                  <Text style={[
                    styles.themeButtonText,
                    theme === 'light' && styles.themeButtonTextActive
                  ]}>
                    Light
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'dark' && styles.themeButtonActive
                  ]}
                  onPress={() => setTheme('dark')}
                >
                  <Moon size={14} color={theme === 'dark' ? colors.background : colors.textSecondary} />
                  <Text style={[
                    styles.themeButtonText,
                    theme === 'dark' && styles.themeButtonTextActive
                  ]}>
                    Dark
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'system' && styles.themeButtonActive
                  ]}
                  onPress={() => setTheme('system')}
                >
                  <Settings size={14} color={theme === 'system' ? colors.background : colors.textSecondary} />
                  <Text style={[
                    styles.themeButtonText,
                    theme === 'system' && styles.themeButtonTextActive
                  ]}>
                    Auto
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Type size={20} color={colors.primary} />
                <Text style={styles.settingText}>Font Size</Text>
              </View>
              <View style={styles.fontSizeButtons}>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    fontSize === 'small' && styles.fontSizeButtonActive
                  ]}
                  onPress={() => setFontSize('small')}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    fontSize === 'small' && styles.fontSizeButtonTextActive
                  ]}>
                    S
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    fontSize === 'medium' && styles.fontSizeButtonActive
                  ]}
                  onPress={() => setFontSize('medium')}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    fontSize === 'medium' && styles.fontSizeButtonTextActive
                  ]}>
                    M
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    fontSize === 'large' && styles.fontSizeButtonActive
                  ]}
                  onPress={() => setFontSize('large')}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    fontSize === 'large' && styles.fontSizeButtonTextActive
                  ]}>
                    L
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuContainer}>
              {menuItems.map(renderMenuItem)}
            </View>
          </View>

          {/* Logout Button */}
          {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity> */}

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color={colors.text} />
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{userStats.level}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Gold & Silver Trader</Text>
              <Text style={styles.userRank}>{userStats.rank}</Text>
              <Text style={styles.memberSince}>Member since {userStats.memberSince}</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            {renderStat(
              Award,
              userStats.totalSignals.toString(),
              'Total Signals',
              colors.warning
            )}
            {renderStat(
              Target,
              `${userStats.successRate}%`,
              'Success Rate',
              colors.success
            )}
            {renderStat(
              TrendingUp,
              `$${userStats.totalProfit.toLocaleString()}`,
              'Total Profit',
              colors.secondary
            )}
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={colors.warning} />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Moon size={20} color={colors.secondary} />
                <Text style={styles.settingText}>Theme</Text>
              </View>
              <View style={styles.themeButtons}>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'light' && styles.themeButtonActive
                  ]}
                  onPress={() => {
                    console.log('Clicked Light'); // Add this
                    setTheme('light');
                  }}
                >
                  <Sun size={14} color={theme === 'light' ? colors.background : colors.textSecondary} />
                  <Text style={[
                    styles.themeButtonText,
                    theme === 'light' && styles.themeButtonTextActive
                  ]}>
                    Light
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'dark' && styles.themeButtonActive
                  ]}
                  onPress={() => setTheme('dark')}
                >
                  <Moon size={14} color={theme === 'dark' ? colors.background : colors.textSecondary} />
                  <Text style={[
                    styles.themeButtonText,
                    theme === 'dark' && styles.themeButtonTextActive
                  ]}>
                    Dark
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'system' && styles.themeButtonActive
                  ]}
                  onPress={() => setTheme('system')}
                >
                  <Settings size={14} color={theme === 'system' ? colors.background : colors.textSecondary} />
                  <Text style={[
                    styles.themeButtonText,
                    theme === 'system' && styles.themeButtonTextActive
                  ]}>
                    Auto
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Type size={20} color={colors.primary} />
                <Text style={styles.settingText}>Font Size</Text>
              </View>
              <View style={styles.fontSizeButtons}>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    fontSize === 'small' && styles.fontSizeButtonActive
                  ]}
                  onPress={() => setFontSize('small')}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    fontSize === 'small' && styles.fontSizeButtonTextActive
                  ]}>
                    S
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    fontSize === 'medium' && styles.fontSizeButtonActive
                  ]}
                  onPress={() => setFontSize('medium')}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    fontSize === 'medium' && styles.fontSizeButtonTextActive
                  ]}>
                    M
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    fontSize === 'large' && styles.fontSizeButtonActive
                  ]}
                  onPress={() => setFontSize('large')}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    fontSize === 'large' && styles.fontSizeButtonTextActive
                  ]}>
                    L
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuContainer}>
              {menuItems.map(renderMenuItem)}
            </View>
          </View>

          {/* Logout Button */}
          {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity> */}

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      )}

    </SafeAreaView >
  );
}