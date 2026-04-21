import { describe, it, expect } from "vitest";

describe("Push Client Utilities", () => {

  describe("urlBase64ToUint8Array", () => {
    it("should convert valid base64url string to Uint8Array", () => {
      // This is a test VAPID key format
      const base64url = "BK5sKvXdv2_t7RqWYd1W8j-PL1YHvNNQc-j_Z-Ys_k0";
      const result = urlBase64ToUint8Array(base64url);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle padding correctly", () => {
      const base64url = "BK5sKvXdv2_t7RqWYd1W8j-PL1YHvNNQc-j_Z";
      const result = urlBase64ToUint8Array(base64url);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle URL-safe characters (+/= replaced with -_)", () => {
      // Standard base64: +/= becomes -_ in url-safe version
      const urlSafe = "BK5s-vXdv2_t7RqWYd1W8j_PL1YHvNNQc-j_Z-Ys_k0";
      const result = urlBase64ToUint8Array(urlSafe);

      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe("getNotificationPermission", () => {
    it("should return 'denied' if Notification API is not available", () => {
      // Save original Notification
      const originalNotification = global.Notification;

      // Mock Notification as unavailable
      Object.defineProperty(global, "Notification", {
        writable: true,
        value: undefined,
      });

      const result = getNotificationPermission();
      expect(result).toBe("denied");

      // Restore
      Object.defineProperty(global, "Notification", {
        writable: true,
        value: originalNotification,
      });
    });

    it("should return current permission status if Notification API is available", () => {
      // Mock Notification API
      Object.defineProperty(global, "Notification", {
        writable: true,
        configurable: true,
        value: {
          permission: "default",
        },
      });

      const result = getNotificationPermission();
      expect(result).toBe("default");
    });

    it("should return 'granted' if permission is already granted", () => {
      Object.defineProperty(global, "Notification", {
        writable: true,
        configurable: true,
        value: {
          permission: "granted",
        },
      });

      const result = getNotificationPermission();
      expect(result).toBe("granted");
    });
  });
});

// Helper function for testing (exported for tests)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function getNotificationPermission(): NotificationPermission {
  if (!("Notification" in global)) {
    return "denied";
  }
  const notificationObj = global.Notification as { permission: NotificationPermission } | undefined;
  return notificationObj?.permission ?? "denied";
}
