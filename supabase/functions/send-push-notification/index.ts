import { createClient } from 'npm:@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface PushNotificationPayload {
  type: 'signal' | 'achievement' | 'announcement' | 'alert';
  title: string;
  message: string;
  data?: any;
  target_user?: string;
  target_device_ids?: string[];
}

interface FCMMessage {
  to?: string;
  registration_ids?: string[];
  notification: {
    title: string;
    body: string;
    icon?: string;
  };
  data?: any;
  webpush?: {
    headers: {
      TTL: string;
    };
    notification: {
      icon: string;
      badge: string;
    };
  };
}

async function sendFCMNotification(tokens: string[], notification: any): Promise<void> {
  const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
  
  if (!fcmServerKey) {
    console.warn('FCM_SERVER_KEY not configured, skipping FCM send');
    return;
  }

  const message: FCMMessage = {
    registration_ids: tokens,
    notification: {
      title: notification.title,
      body: notification.message,
      icon: '/assets/images/icon.png',
    },
    data: notification.data || {},
    webpush: {
      headers: {
        TTL: '86400', // 24 hours
      },
      notification: {
        icon: '/assets/images/icon.png',
        badge: '/assets/images/icon.png',
      },
    },
  };

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${fcmServerKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FCM request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('FCM send result:', result);
  } catch (error) {
    console.error('Error sending FCM notification:', error);
    throw error;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      const payload: PushNotificationPayload = await req.json();

      // Insert notification into database
      const { data: notification, error: insertError } = await supabase
        .from('notifications')
        .insert({
          type: payload.type,
          title: payload.title,
          message: payload.message,
          data: payload.data,
          target_user: payload.target_user,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to insert notification: ${insertError.message}`);
      }

      // Get FCM tokens for target users
      let fcmTokensQuery = supabase
        .from('user_profiles')
        .select('fcm_token, user_id')
        .not('fcm_token', 'is', null);

      if (payload.target_user) {
        fcmTokensQuery = fcmTokensQuery.eq('user_id', payload.target_user);
      } else if (payload.target_device_ids && payload.target_device_ids.length > 0) {
        fcmTokensQuery = fcmTokensQuery.in('user_id', payload.target_device_ids);
      }

      const { data: userProfiles, error: profilesError } = await fcmTokensQuery;

      if (profilesError) {
        throw new Error(`Failed to get user profiles: ${profilesError.message}`);
      }

      const fcmTokens = userProfiles?.map(profile => profile.fcm_token).filter(Boolean) || [];

      let sendResult = null;
      if (fcmTokens.length > 0) {
        try {
          await sendFCMNotification(fcmTokens, {
            title: payload.title,
            message: payload.message,
            data: payload.data,
          });
          sendResult = { success: true, tokens_sent: fcmTokens.length };
        } catch (error) {
          console.error('FCM send failed:', error);
          sendResult = { success: false, error: error.message };
        }
      }

      // Update notification status
      const { error: updateError } = await supabase
        .from('notifications')
        .update({
          status: sendResult?.success ? 'sent' : 'failed',
          sent_at: new Date().toISOString(),
        })
        .eq('id', notification.id);

      if (updateError) {
        console.error('Failed to update notification status:', updateError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          notification_id: notification.id,
          recipients: userProfiles?.length || 0,
          fcm_result: sendResult,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // GET request - fetch recent notifications
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ notifications }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Notification function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process notification',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});