import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { upsertUserProfile, createNotification } from './database';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface PushNotificationData {
  type: 'signal' | 'achievement' | 'announcement' | 'alert';
  title: string;
  message: string;
  data?: any;
}

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false; // Web notifications require different handling
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

// Get FCM token and save to database
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return null;
    }

    if (Platform.OS === 'web') {
      return null; // Web push notifications require different setup
    }

    // Get the token that uniquely identifies this device
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Save token to user profile
    await upsertUserProfile({
      user_id: userId,
      fcm_token: token,
      device_type: Platform.OS as 'ios' | 'android',
      app_version: '1.0.0', // You can get this from app.json or package.json
    });

    console.log('Push notification token registered:', token);
    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

// Send a local notification (for testing)
export async function sendLocalNotification(data: PushNotificationData): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.message,
        data: data.data,
      },
      trigger: null, // Send immediately
    });

    // Also save to database
    await createNotification({
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
}

// Handle notification responses
export function setupNotificationListeners() {
  // Handle notification received while app is foregrounded
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  // Handle user tapping on notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response:', response);
    
    // You can navigate to specific screens based on notification data
    const data = response.notification.request.content.data;
    if (data?.type === 'signal' && data?.signal_id) {
      // Navigate to signal details
      console.log('Navigate to signal:', data.signal_id);
    }
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

// Test notification function
export async function sendTestNotification(): Promise<void> {
  const testData: PushNotificationData = {
    type: 'signal',
    title: 'Test Signal Alert',
    message: 'This is a test notification from your trading app!',
    data: {
      signal_id: 'test-123',
      pair: 'XAU/USD',
    },
  };

  await sendLocalNotification(testData);
}