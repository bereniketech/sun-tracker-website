import { describe, it, expect, vi } from "vitest";
import { POST as subscribeHandler } from "@/app/api/push/subscribe/route";
import { POST as unsubscribeHandler } from "@/app/api/push/unsubscribe/route";
import { NextRequest } from "next/server";

// Mock Supabase
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  })),
}));

describe("Push Notifications API Routes", () => {
  describe("POST /api/push/subscribe", () => {
    it("should return 401 if authorization header is missing", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "https://example.com/endpoint",
          keys: {
            p256dh: "test_p256dh",
            auth: "test_auth",
          },
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Missing or invalid authorization header");
    });

    it("should return 401 if authorization header is malformed", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "InvalidHeader",
        },
        body: JSON.stringify({
          endpoint: "https://example.com/endpoint",
          keys: {
            p256dh: "test_p256dh",
            auth: "test_auth",
          },
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(401);
    });

    it("should return 400 if request body is invalid", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          endpoint: "not-a-url", // Invalid URL
          keys: {
            p256dh: "test_p256dh",
            auth: "test_auth",
          },
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Invalid request body");
    });

    it("should return 500 if Supabase environment variables are missing", async () => {
      // Save original env values
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Temporarily unset them
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const mockRequest = new NextRequest("http://localhost:3000/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          endpoint: "https://example.com/endpoint",
          keys: {
            p256dh: "test_p256dh",
            auth: "test_auth",
          },
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body.error).toBe("Supabase configuration missing");

      // Restore env
      if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
    });
  });

  describe("POST /api/push/unsubscribe", () => {
    it("should return 401 if authorization header is missing", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "https://example.com/endpoint",
        }),
      });

      const response = await unsubscribeHandler(mockRequest);
      expect(response.status).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Missing or invalid authorization header");
    });

    it("should return 400 if request body is invalid", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          endpoint: "not-a-url", // Invalid URL
        }),
      });

      const response = await unsubscribeHandler(mockRequest);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Invalid request body");
    });

    it("should return 500 if Supabase environment variables are missing", async () => {
      // Save original env values
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Temporarily unset them
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const mockRequest = new NextRequest("http://localhost:3000/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          endpoint: "https://example.com/endpoint",
        }),
      });

      const response = await unsubscribeHandler(mockRequest);
      expect(response.status).toBe(500);

      // Restore env
      if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
    });
  });
});
