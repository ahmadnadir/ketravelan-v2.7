import { Capacitor } from "@capacitor/core";

/**
 * Initialize Capacitor plugins for native mobile functionality.
 * This function should be called once when the app starts.
 */
export async function initializeCapacitor() {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Initialize Status Bar
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    
    // On Android, set the background color
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#1a1a2e" });
    }

    // Initialize Splash Screen - will auto-hide after configured duration
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();

    // Initialize Keyboard for better form handling on iOS
    const { Keyboard } = await import("@capacitor/keyboard");
    
    // Add keyboard event listeners for iOS scroll adjustments
    if (Capacitor.getPlatform() === "ios") {
      Keyboard.addListener("keyboardWillShow", () => {
        document.body.classList.add("keyboard-open");
      });

      Keyboard.addListener("keyboardWillHide", () => {
        document.body.classList.remove("keyboard-open");
      });
    }

    // Initialize Push Notifications
    await initializePushNotifications();

    console.log("Capacitor initialized successfully");
  } catch (error) {
    console.warn("Failed to initialize Capacitor plugins:", error);
  }
}

/**
 * Initialize push notifications: request permission, register, and set up listeners.
 * The device token is logged to console — in production you'd send it to your backend.
 */
async function initializePushNotifications() {
  const { PushNotifications } = await import("@capacitor/push-notifications");

  // Check current permission status
  const permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt" || permStatus.receive === "prompt-with-rationale") {
    const requested = await PushNotifications.requestPermissions();
    if (requested.receive !== "granted") {
      console.log("Push notification permission denied");
      return;
    }
  } else if (permStatus.receive !== "granted") {
    console.log("Push notification permission not granted");
    return;
  }

  // Register with APNs / FCM
  await PushNotifications.register();

  // Listener: registration succeeded — receive the device token
  PushNotifications.addListener("registration", (token) => {
    console.log("Push registration token:", token.value);
    // TODO: Send token.value to your backend to associate with the user
  });

  // Listener: registration failed
  PushNotifications.addListener("registrationError", (error) => {
    console.error("Push registration error:", error);
  });

  // Listener: notification received while app is in foreground
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("Push received in foreground:", notification);
    // You can show an in-app toast/banner here
  });

  // Listener: user tapped on a notification (app was in background/killed)
  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    console.log("Push notification tapped:", action);
    // Navigate based on action.notification.data if needed
  });
}

/**
 * Check if running on a native platform (iOS or Android)
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Get the current platform
 */
export function getPlatform(): "ios" | "android" | "web" {
  return Capacitor.getPlatform() as "ios" | "android" | "web";
}
