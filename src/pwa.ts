import { registerSW } from "virtual:pwa-register";
import { toast } from "sonner";

// Register service worker with update prompt handling
export const initPWA = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      toast("Update available", {
        description: "A new version is ready. Reload to update.",
        duration: Infinity,
        action: {
          label: "Reload",
          onClick: () => {
            updateSW(true);
          },
        },
      });
    },
    onOfflineReady() {
      toast.success("App ready for offline use", {
        description: "You can now use Ketravelan without an internet connection.",
        duration: 3000,
      });
    },
    onRegistered(registration) {
      // Check for updates periodically (every 30 minutes)
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });
};
