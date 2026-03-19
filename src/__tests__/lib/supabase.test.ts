import { describe, expect, it } from "vitest";
import { extractAccessToken } from "@/lib/supabase";

describe("extractAccessToken", () => {
  it("returns the token from a valid Bearer header", () => {
    expect(extractAccessToken("Bearer mytoken123")).toBe("mytoken123");
  });

  it("returns null for a null header", () => {
    expect(extractAccessToken(null)).toBeNull();
  });

  it("returns null when the prefix is not Bearer", () => {
    expect(extractAccessToken("Basic dXNlcjpwYXNz")).toBeNull();
    expect(extractAccessToken("Token abc")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(extractAccessToken("")).toBeNull();
  });

  it("preserves the full token including dots and dashes", () => {
    const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc-def";
    expect(extractAccessToken(`Bearer ${jwt}`)).toBe(jwt);
  });
});
