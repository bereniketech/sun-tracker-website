import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
});

export async function rateLimit(ip: string): Promise<RateLimitResponse> {
  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    // On Redis error, fail open (allow request) but log
    console.error("Rate limit check failed:", error);
    return {
      success: true,
      limit: 60,
      remaining: 60,
      reset: Date.now() + 60000,
    };
  }
}
