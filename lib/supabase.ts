import { createClient } from '@supabase/supabase-js';

// Environment variables with better error handling
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables not found. Using mock data mode.');
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      persistSession: false, // Disable auth persistence for demo app
    },
  }
);

// Add connection test function
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('signals').select('count').limit(1);
    return !error;
  } catch (error) {
    console.log('Supabase connection test failed:', error);
    return false;
  }
}

// Database types
export interface Signal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry_price: number;
  current_price?: number;
  take_profit_levels: number[];
  stop_loss: number;
  status: 'active' | 'closed' | 'pending';
  accuracy: number;
  timestamp: string;
  description?: string;
  risk_reward?: string;
  pnl?: number;
  created_at: string;
}

export interface MarketData {
  pair: string;
  price: number;
  change: number;
  change_percent: number;
  high: number;
  low: number;
  volume: string;
}