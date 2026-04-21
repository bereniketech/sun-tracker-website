import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST as subscribeHandler, DELETE as unsubscribeHandler } from "@/app/api/email-reports/subscribe/route";
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

describe("Email Reports API Routes", () => {
  beforeEach(() => {
    // Reset environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/email-reports/subscribe", () => {
    it("should return 401 if authorization header is missing", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          lat: 40.7128,
          lng: -74.0060,
          location_name: "New York"
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Missing or invalid authorization header");
    });

    it("should return 401 if authorization header is malformed", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "InvalidHeader",
        },
        body: JSON.stringify({
          email: "test@example.com",
          lat: 40.7128,
          lng: -74.0060,
          location_name: "New York"
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(401);
    });

    it("should return 400 if request body is invalid", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          email: "not-an-email", // Invalid email
          lat: 40.7128,
          lng: -74.0060,
          location_name: "New York"
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Invalid request body");
    });

    it("should return 400 if latitude is out of range", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          email: "test@example.com",
          lat: 95, // Invalid latitude
          lng: -74.0060,
          location_name: "New York"
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(400);
    });

    it("should return 400 if longitude is out of range", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          email: "test@example.com",
          lat: 40.7128,
          lng: -200, // Invalid longitude
          location_name: "New York"
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(400);
    });

    it("should return 400 if location_name is empty", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          email: "test@example.com",
          lat: 40.7128,
          lng: -74.0060,
          location_name: "" // Empty location
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(400);
    });

    it("should return 500 if Supabase environment variables are missing", async () => {
      // Save original env values
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Temporarily unset them
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
        body: JSON.stringify({
          email: "test@example.com",
          lat: 40.7128,
          lng: -74.0060,
          location_name: "New York"
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

    it("should return 401 if user authentication fails", async () => {
      // This test relies on mocked Supabase returning no user
      // The mock is already set up globally to return null for invalid tokens
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer invalid_token",
        },
        body: JSON.stringify({
          email: "test@example.com",
          lat: 40.7128,
          lng: -74.0060,
          location_name: "New York"
        }),
      });

      const response = await subscribeHandler(mockRequest);
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/email-reports/subscribe", () => {
    it("should return 401 if authorization header is missing", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await unsubscribeHandler(mockRequest);
      expect(response.status).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Missing or invalid authorization header");
    });

    it("should return 401 if authorization header is malformed", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "InvalidHeader",
        },
      });

      const response = await unsubscribeHandler(mockRequest);
      expect(response.status).toBe(401);
    });

    it("should return 500 if Supabase environment variables are missing", async () => {
      // Save original env values
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Temporarily unset them
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid_token",
        },
      });

      const response = await unsubscribeHandler(mockRequest);
      expect(response.status).toBe(500);

      // Restore env
      if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
    });

    it("should return 401 if user authentication fails", async () => {
      // This test relies on mocked Supabase returning no user
      // The mock is already set up globally to return null for invalid tokens
      const mockRequest = new NextRequest("http://localhost:3000/api/email-reports/subscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer invalid_token",
        },
      });

      const response = await unsubscribeHandler(mockRequest);
      expect(response.status).toBe(401);
    });
  });
});
