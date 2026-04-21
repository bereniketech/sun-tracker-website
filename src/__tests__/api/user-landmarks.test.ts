import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/user-landmarks/route";
import { DELETE } from "@/app/api/user-landmarks/[id]/route";
import { NextRequest } from "next/server";

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  createServerClient: vi.fn(),
  extractAccessToken: vi.fn(),
}));

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
};

import { createServerClient, extractAccessToken } from "@/lib/supabase";

beforeEach(() => {
  vi.clearAllMocks();
  const typedCreateServerClient = createServerClient as unknown as ReturnType<typeof vi.fn>;
  typedCreateServerClient.mockReturnValue(mockSupabase);
});

describe("User Landmarks API Routes", () => {
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
  };

  const mockLandmark = {
    id: "landmark-123",
    user_id: "user-123",
    name: "Stonehenge Viewpoint",
    lat: 51.1789,
    lng: -1.8262,
    notes: "Great view of the stones",
    created_at: new Date().toISOString(),
  };

  describe("GET /api/user-landmarks", () => {
    it("should return 401 if not authenticated", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(null);
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Unauthorized" },
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks");
      const response = await GET(request);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Unauthorized.");
    });

    it("should return user's landmarks when authenticated", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockLandmark],
            error: null,
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.landmarks).toEqual([mockLandmark]);
    });

    it("should handle database errors gracefully", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Database error" },
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks");
      const response = await GET(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe("Failed to fetch landmarks.");
    });
  });

  describe("POST /api/user-landmarks", () => {
    it("should return 401 if not authenticated", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(null);
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Unauthorized" },
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks", {
        method: "POST",
        body: JSON.stringify({
          name: "Test Landmark",
          lat: 51.1789,
          lng: -1.8262,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("should return 400 if request body is invalid JSON", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks", {
        method: "POST",
        body: "invalid json {",
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe("Invalid JSON body.");
    });

    it("should return 400 if name is missing", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks", {
        method: "POST",
        body: JSON.stringify({
          lat: 51.1789,
          lng: -1.8262,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should return 400 if coordinates are invalid", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks", {
        method: "POST",
        body: JSON.stringify({
          name: "Test",
          lat: 95.5, // Out of range
          lng: -1.8262,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should create a landmark when given valid input", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockLandmark,
            error: null,
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks", {
        method: "POST",
        body: JSON.stringify({
          name: "Stonehenge Viewpoint",
          lat: 51.1789,
          lng: -1.8262,
          notes: "Great view of the stones",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.landmark).toEqual(mockLandmark);
    });

    it("should handle database errors when creating landmark", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Database error" },
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks", {
        method: "POST",
        body: JSON.stringify({
          name: "Test",
          lat: 51.1789,
          lng: -1.8262,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe("Failed to save landmark.");
    });
  });

  describe("DELETE /api/user-landmarks/[id]", () => {
    it("should return 401 if not authenticated", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(null);
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Unauthorized" },
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks/landmark-123", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: "landmark-123" }) });
      expect(response.status).toBe(401);
    });

    it("should return 404 if landmark not found or doesn't belong to user", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      const mockSelect = vi.fn().mockReturnValue(mockSelectChain);

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const request = new NextRequest("http://localhost:3000/api/user-landmarks/landmark-123", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: "landmark-123" }) });
      expect(response.status).toBe(404);
    });

    it("should delete a landmark belonging to the user", async () => {
      ((extractAccessToken as unknown) as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockLandmark,
          error: null,
        }),
      };

      const mockSelect = vi.fn().mockReturnValue(mockSelectChain);

      const mockDeleteChain = {
        eq: vi.fn().mockReturnThis(),
      };

      const mockDelete = vi.fn().mockReturnValue(mockDeleteChain);

      mockSupabase.from.mockReturnValueOnce({
        select: mockSelect,
      });

      mockSupabase.from.mockReturnValueOnce({
        delete: mockDelete,
      });

      // Setup the second eq() call in the delete chain
      mockDeleteChain.eq = vi
        .fn()
        .mockReturnValueOnce(mockDeleteChain)
        .mockReturnValueOnce(
          Promise.resolve({
            data: null,
            error: null,
          }),
        );

      const request = new NextRequest("http://localhost:3000/api/user-landmarks/landmark-123", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: "landmark-123" }) });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });
});
