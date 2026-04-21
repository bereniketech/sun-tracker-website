import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/v1/sun/route";

// Mock the sun calculation with proper sun data
vi.mock("@/lib/sun", () => ({
  computeSunData: vi.fn(() => ({
    sunrise: new Date("2025-06-21T04:45:12Z"),
    sunset: new Date("2025-06-21T20:30:45Z"),
    solarNoon: new Date("2025-06-21T12:38:00Z"),
    goldenHour: {
      start: new Date("2025-06-21T04:45:12Z"),
      end: new Date("2025-06-21T05:45:30Z"),
    },
    goldenHourEvening: {
      start: new Date("2025-06-21T19:30:15Z"),
      end: new Date("2025-06-21T20:30:45Z"),
    },
    blueHour: {
      start: new Date("2025-06-21T04:15:00Z"),
      end: new Date("2025-06-21T04:45:12Z"),
    },
    blueHourEvening: {
      start: new Date("2025-06-21T20:30:45Z"),
      end: new Date("2025-06-21T21:00:30Z"),
    },
    sunAzimuth: 94.32,
    sunElevation: 45.67,
    sunriseAzimuth: 65.5,
    sunsetAzimuth: 294.5,
    shadowDirection: 274.32,
    shadowLengthRatio: 0.99,
    dayLength: 57393,
    dayLengthChange: 120,
  })),
}));

// Mock rate limit - using dynamic import to access the mock
const mockRateLimit = vi.fn() as ReturnType<typeof vi.fn>;
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: mockRateLimit,
}));

interface MockRequest {
  url: string;
  nextUrl: URL;
  ip: string | undefined;
  headers: Headers;
}

function createMockRequest(url: string, ipOrHeaders?: string | Headers): MockRequest {
  const headers = ipOrHeaders instanceof Headers ? ipOrHeaders : new Headers();
  if (typeof ipOrHeaders === "string" && ipOrHeaders) {
    headers.set("x-real-ip", ipOrHeaders);
  }

  return {
    url,
    nextUrl: new URL(url, "http://localhost:3000"),
    ip: typeof ipOrHeaders === "string" ? ipOrHeaders : undefined,
    headers,
  } as MockRequest;
}

describe("GET /api/v1/sun", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockResolvedValue({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60000,
    });
  });

  describe("Valid requests", () => {
    it("should return sun data with valid coordinates and date", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=40.71&lng=-74.00&date=2025-06-21T12:00:00Z"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("lat", 40.71);
      expect(data).toHaveProperty("lng", -74);
      expect(data).toHaveProperty("date");
      expect(data).toHaveProperty("sunrise");
      expect(data).toHaveProperty("sunset");
      expect(data).toHaveProperty("solarNoon");
      expect(data).toHaveProperty("goldenHourMorning");
      expect(data).toHaveProperty("goldenHourEvening");
      expect(data).toHaveProperty("blueHourMorning");
      expect(data).toHaveProperty("blueHourEvening");
      expect(data).toHaveProperty("azimuth");
      expect(data).toHaveProperty("elevation");
      expect(data).toHaveProperty("dayLength");
    });

    it("should include rate limit headers in response", async () => {
      mockRateLimit.mockResolvedValueOnce({
        success: true,
        limit: 60,
        remaining: 58,
        reset: Date.now() + 60000,
      });

      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.headers.get("X-RateLimit-Limit")).toBe("60");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("58");
      expect(response.headers.get("X-RateLimit-Reset")).toBeTruthy();
    });

    it("should include CORS headers", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=51.5&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET");
    });
  });

  describe("Invalid coordinates", () => {
    it("should return 400 for latitude > 90", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=91&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error).toContain("lat");
    });

    it("should return 400 for latitude < -90", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=-91&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
    });

    it("should return 400 for longitude > 180", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=181&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("lng");
    });

    it("should return 400 for longitude < -180", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=-181&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(400);
    });

    it("should return 400 for non-numeric latitude", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=abc&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
    });

    it("should return 400 for non-numeric longitude", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=xyz&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(400);
    });

    it("should return 400 for missing lat parameter", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(400);
    });

    it("should return 400 for missing lng parameter", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(400);
    });
  });

  describe("Invalid dates", () => {
    it("should return 400 for invalid date format", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=invalid-date"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("date");
    });

    it("should return 400 for missing date parameter", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(400);
    });

    it("should accept valid ISO 8601 dates", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21T00:00:00Z"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(200);
    });

    it("should accept date without time", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(200);
    });
  });

  describe("Rate limiting", () => {
    it("should return 429 when rate limit exceeded", async () => {
      mockRateLimit.mockResolvedValueOnce({
        success: false,
        limit: 60,
        remaining: 0,
        reset: Date.now() + 30000,
      });

      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);

      expect(response.status).toBe(429);
      expect(response.headers.get("Retry-After")).toBeTruthy();
    });

    it("should include Retry-After header on 429", async () => {
      const resetTime = Date.now() + 45000;
      mockRateLimit.mockResolvedValueOnce({
        success: false,
        limit: 60,
        remaining: 0,
        reset: resetTime,
      });

      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const retryAfter = response.headers.get("Retry-After");

      expect(response.status).toBe(429);
      expect(retryAfter).toBeTruthy();
      expect(parseInt(retryAfter || "0")).toBeGreaterThan(0);
    });

    it("should pass IP address to rate limit function", async () => {
      const testIp = "192.168.1.1";
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21",
        testIp
      );

      await GET(request as unknown as Request);

      expect(mockRateLimit).toHaveBeenCalledWith(testIp);
    });

    it("should use anonymous IP when no IP headers are present", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21"
      );

      await GET(request as unknown as Request);

      expect(mockRateLimit).toHaveBeenCalledWith("anonymous");
    });
  });

  describe("Response format", () => {
    it("should return proper timezone string", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=40&lng=-75&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(data).toHaveProperty("timezone");
      expect(typeof data.timezone).toBe("string");
    });

    it("should round azimuth and elevation to 2 decimals", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(data.azimuth).toBe(94.32);
      expect(data.elevation).toBe(45.67);
    });

    it("should return ISO 8601 formatted timestamps", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/v1/sun?lat=0&lng=0&date=2025-06-21"
      );

      const response = await GET(request as unknown as Request);
      const data = await response.json();

      expect(data.sunrise).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
      expect(data.sunset).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
      expect(data.solarNoon).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    });
  });
});
