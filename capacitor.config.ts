import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.dday',
  appName: 'D-DAY',
  webDir: 'dist'
};

export default config;

// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.yourname.dday',
  appName: 'D-DAY',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Show for 2 seconds
      backgroundColor: "#0f172a", // Match your theme-color in index.html
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
    },
  },
};