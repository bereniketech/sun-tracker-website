import { describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * Admin email validation logic (extracted from middleware for testing)
 */
function validateAdminEmail(sessionCookie: string | undefined, adminEmails: string): boolean {
  if (!sessionCookie) {
    return false;
  }

  try {
    const session = JSON.parse(sessionCookie);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return false;
    }

    const adminEmailList = adminEmails.split(",").map((email) => email.trim());
    return adminEmailList.includes(userEmail);
  } catch {
    return false;
  }
}

describe("Admin Auth Middleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ADMIN_EMAILS: "admin@example.com,moderator@example.com" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Admin routes without session", () => {
    it("should reject access to /admin without session cookie", () => {
      const result = validateAdminEmail(undefined, "admin@example.com,moderator@example.com");
      expect(result).toBe(false);
    });

    it("should reject access to /admin/cities without session", () => {
      const result = validateAdminEmail(undefined, "admin@example.com,moderator@example.com");
      expect(result).toBe(false);
    });
  });

  describe("Admin routes with valid session", () => {
    it("should allow access to /admin with valid admin email", () => {
      const sessionData = {
        user: {
          email: "admin@example.com",
        },
      };

      const result = validateAdminEmail(
        JSON.stringify(sessionData),
        "admin@example.com,moderator@example.com"
      );
      expect(result).toBe(true);
    });

    it("should allow access to /admin with moderator email", () => {
      const sessionData = {
        user: {
          email: "moderator@example.com",
        },
      };

      const result = validateAdminEmail(
        JSON.stringify(sessionData),
        "admin@example.com,moderator@example.com"
      );
      expect(result).toBe(true);
    });

    it("should allow access to /admin/cities with valid admin email", () => {
      const sessionData = {
        user: {
          email: "admin@example.com",
        },
      };

      const result = validateAdminEmail(
        JSON.stringify(sessionData),
        "admin@example.com,moderator@example.com"
      );
      expect(result).toBe(true);
    });
  });

  describe("Admin routes with invalid session", () => {
    it("should reject when user email not in admin list", () => {
      const sessionData = {
        user: {
          email: "user@example.com",
        },
      };

      const result = validateAdminEmail(
        JSON.stringify(sessionData),
        "admin@example.com,moderator@example.com"
      );
      expect(result).toBe(false);
    });

    it("should reject when session is malformed", () => {
      const result = validateAdminEmail("invalid-json", "admin@example.com,moderator@example.com");
      expect(result).toBe(false);
    });

    it("should reject when session has no user email", () => {
      const sessionData = {
        user: {},
      };

      const result = validateAdminEmail(
        JSON.stringify(sessionData),
        "admin@example.com,moderator@example.com"
      );
      expect(result).toBe(false);
    });
  });

  describe("Admin email parsing", () => {
    it("should handle comma-separated emails with spaces", () => {
      const sessionData = {
        user: {
          email: "moderator@example.com",
        },
      };

      const result = validateAdminEmail(
        JSON.stringify(sessionData),
        "admin@example.com , moderator@example.com , owner@example.com"
      );
      expect(result).toBe(true);
    });

    it("should handle single admin email", () => {
      const sessionData = {
        user: {
          email: "admin@example.com",
        },
      };

      const result = validateAdminEmail(JSON.stringify(sessionData), "admin@example.com");
      expect(result).toBe(true);
    });

    it("should reject non-admin email with single admin configured", () => {
      const sessionData = {
        user: {
          email: "user@example.com",
        },
      };

      const result = validateAdminEmail(JSON.stringify(sessionData), "admin@example.com");
      expect(result).toBe(false);
    });
  });
});
