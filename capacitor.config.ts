import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.ketravelan.app",
  appName: "Ketravelan",
  webDir: "dist",
  // Comment out for production builds, keep for development hot-reload
  // server: {
  //   url: "https://76f09fa7-ec9b-4b08-b9b8-98db71262664.lovableproject.com?forceHideBadge=true",
  //   cleartext: true,
  // },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#1a1a2e",
    preferredContentMode: "mobile",
  },
  android: {
    backgroundColor: "#1a1a2e",
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1a1a2e",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#1a1a2e",
    },
  },
};

export default config;
