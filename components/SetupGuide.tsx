import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Database, ExternalLink, Copy, CircleCheck as CheckCircle, ArrowRight, Settings } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SetupGuideProps {
  visible: boolean;
  onClose: () => void;
}

export default function SetupGuide({ visible, onClose }: SetupGuideProps) {
  const { colors, fontSizes } = useTheme();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepIndex: number) => {
    // Note: Clipboard API might not work in web environment
    // This is a placeholder for the copy functionality
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const setupSteps = [
    {
      title: "Create Supabase Project",
      description: "Sign up at supabase.com and create a new project",
      action: "Visit supabase.com",
      code: null,
    },
    {
      title: "Get Project Credentials",
      description: "Navigate to Settings > API in your Supabase dashboard",
      action: "Copy Project URL",
      code: "https://your-project-id.supabase.co",
    },
    {
      title: "Copy Anon Key",
      description: "Copy the 'anon public' key from the API settings",
      action: "Copy Anon Key",
      code: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    {
      title: "Create Environment File",
      description: "Create a .env file in your project root with your credentials",
      action: "Copy .env Template",
      code: `EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here`,
    },
    {
      title: "Run Database Migrations",
      description: "Execute the SQL migrations in your Supabase SQL editor",
      action: "View Migration Files",
      code: "supabase/migrations/*.sql",
    },
  ];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.background,
      borderRadius: 20,
      width: '90%',
      maxWidth: 500,
      maxHeight: '80%',
      overflow: 'hidden',       // Ensures ScrollView renders properly
      flex: 1,                  // Ensures content inside fills available space
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: fontSizes.title,
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
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    intro: {
      padding: 20,
      backgroundColor: `${colors.primary}10`,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    introText: {
      fontSize: fontSizes.medium,
      color: colors.text,
      fontFamily: 'Inter-Regular',
      lineHeight: 22,
    },
    stepsContainer: {
      padding: 20,
    },
    step: {
      marginBottom: 20,
    },
    stepHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    stepNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    stepNumberText: {
      fontSize: fontSizes.small,
      fontFamily: 'Inter-Bold',
      color: colors.background,
    },
    stepTitle: {
      fontSize: fontSizes.subtitle,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      flex: 1,
    },
    stepDescription: {
      fontSize: fontSizes.medium,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 12,
      marginLeft: 36,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginLeft: 36,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: fontSizes.medium,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      flex: 1,
    },
    codeBlock: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginLeft: 36,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    codeText: {
      fontSize: fontSizes.small,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      lineHeight: 18,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerText: {
      fontSize: fontSizes.medium,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Press outside to close */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Modal Content */}
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconContainer}>
                  <Database size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.title}>Setup Guide</Text>
                  <Text style={styles.subtitle}>Connect to Supabase</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Intro Section */}
              <View style={styles.intro}>
                <Text style={styles.introText}>
                  Follow these steps to connect your app to Supabase and enable live trading signals.
                  The app works perfectly in demo mode, but connecting to Supabase will give you real-time data.
                </Text>
              </View>

              {/* Steps */}
              <View style={styles.stepsContainer}>
                {setupSteps.map((step, index) => (
                  <View key={index} style={styles.step}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                    </View>

                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => step.code && copyToClipboard(step.code, index)}
                    >
                      <Text style={styles.actionButtonText}>{step.action}</Text>
                      {copiedStep === index ? (
                        <CheckCircle size={16} color={colors.success} />
                      ) : step.code ? (
                        <Copy size={16} color={colors.textSecondary} />
                      ) : (
                        <ExternalLink size={16} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>

                    {step.code && (
                      <View style={styles.codeBlock}>
                        <Text style={styles.codeText}>{step.code}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Need help? The app works great in demo mode while you set up Supabase.
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>

  );
}