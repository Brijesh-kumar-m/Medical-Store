// Backend configuration
// Change this to switch between Firebase and Supabase
const config = {
  // "firebase" or "supabase"
  backendProvider: localStorage.getItem('o2clinic_backend') || 'supabase',

  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // WhatsApp business number
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999',

  // Admin mobile numbers (for simple login admin detection)
  adminMobiles: (import.meta.env.VITE_ADMIN_MOBILES || '9999999999').split(','),

  // Mock mode for development without backend
  useMockData: import.meta.env.VITE_USE_MOCK === 'true' || (!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_FIREBASE_API_KEY),
};

export function setBackendProvider(provider) {
  if (provider !== 'firebase' && provider !== 'supabase') {
    throw new Error('Invalid backend provider. Use "firebase" or "supabase".');
  }
  localStorage.setItem('o2clinic_backend', provider);
  config.backendProvider = provider;
  // Reload to re-initialize services
  window.location.reload();
}

export function getBackendProvider() {
  return config.backendProvider;
}

export default config;
