
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9b7391334b0143cab7ef732485058868',
  appName: 'BroodBot',
  webDir: 'dist',
  server: {
    url: 'https://9b739133-4b01-43ca-b7ef-732485058868.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff"
    }
  }
};

export default config;
