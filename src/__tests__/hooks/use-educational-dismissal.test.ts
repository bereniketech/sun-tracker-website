import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEducationalDismissal } from "@/hooks/use-educational-dismissal";

describe("useEducationalDismissal", () => {
  let originalLocalStorage: Storage;

  class MockLocalStorage implements Storage {
    store: Record<string, string> = {};
    length = 0;

    getItem(key: string): string | null {
      return this.store[key] ?? null;
    }

    setItem(key: string, value: string): void {
      this.store[key] = value;
    }

    removeItem(key: string): void {
      delete this.store[key];
    }

    clear(): void {
      this.store = {};
    }

    key(index: number): string | null {
      const keys = Object.keys(this.store);
      return keys[index] ?? null;
    }
  }

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    global.localStorage = new MockLocalStorage() as Storage;
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    vi.clearAllMocks();
  });

  it("isDismissed returns false for fresh hook", () => {
    const { result } = renderHook(() => useEducationalDismissal());
    expect(result.current.isDismissed("golden-hour")).toBe(false);
    expect(result.current.isDismissed("blue-hour")).toBe(false);
  });

  it("dismiss adds term to dismissed set", () => {
    const { result } = renderHook(() => useEducationalDismissal());

    act(() => {
      result.current.dismiss("golden-hour");
    });

    expect(result.current.isDismissed("golden-hour")).toBe(true);
  });

  it("isDismissed returns false for non-dismissed terms", () => {
    const { result } = renderHook(() => useEducationalDismissal());

    act(() => {
      result.current.dismiss("golden-hour");
    });

    expect(result.current.isDismissed("blue-hour")).toBe(false);
  });

  it("persists dismissed terms to localStorage", () => {
    const { result } = renderHook(() => useEducationalDismissal());

    act(() => {
      result.current.dismiss("golden-hour");
      result.current.dismiss("azimuth");
    });

    const stored = localStorage.getItem("edu-dismissed");
    const parsed = stored ? JSON.parse(stored) : [];
    expect(parsed).toContain("golden-hour");
    expect(parsed).toContain("azimuth");
  });

  it("loads dismissed terms from localStorage on mount", () => {
    localStorage.setItem("edu-dismissed", JSON.stringify(["golden-hour", "blue-hour"]));

    const { result } = renderHook(() => useEducationalDismissal());

    expect(result.current.isDismissed("golden-hour")).toBe(true);
    expect(result.current.isDismissed("blue-hour")).toBe(true);
    expect(result.current.isDismissed("solar-noon")).toBe(false);
  });

  it("resetAll clears all dismissals", () => {
    const { result } = renderHook(() => useEducationalDismissal());

    act(() => {
      result.current.dismiss("golden-hour");
      result.current.dismiss("azimuth");
    });

    expect(result.current.isDismissed("golden-hour")).toBe(true);
    expect(result.current.isDismissed("azimuth")).toBe(true);

    act(() => {
      result.current.resetAll();
    });

    expect(result.current.isDismissed("golden-hour")).toBe(false);
    expect(result.current.isDismissed("azimuth")).toBe(false);
  });

  it("resetAll removes localStorage key", () => {
    localStorage.setItem("edu-dismissed", JSON.stringify(["golden-hour"]));

    const { result } = renderHook(() => useEducationalDismissal());

    act(() => {
      result.current.resetAll();
    });

    expect(localStorage.getItem("edu-dismissed")).toBeNull();
  });

  it("handles localStorage failure gracefully", () => {
    const mockStorage = {
      getItem: vi.fn(() => {
        throw new Error("Storage access denied");
      }),
      setItem: vi.fn(() => {
        throw new Error("Storage access denied");
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    vi.stubGlobal("localStorage", mockStorage);

    const { result } = renderHook(() => useEducationalDismissal());

    expect(result.current.isDismissed("golden-hour")).toBe(false);

    act(() => {
      expect(() => result.current.dismiss("golden-hour")).not.toThrow();
    });
  });

  it("dismiss and resetAll use stable references", () => {
    const { result, rerender } = renderHook(() => useEducationalDismissal());

    const dismissBefore = result.current.dismiss;
    const resetAllBefore = result.current.resetAll;

    rerender();

    expect(result.current.dismiss).toBe(dismissBefore);
    expect(result.current.resetAll).toBe(resetAllBefore);
  });
});
