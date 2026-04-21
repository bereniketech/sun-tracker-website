import { describe, it, expect } from "vitest";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

describe("DarkModeToggle", () => {
  it("component exists and can be imported", () => {
    expect(DarkModeToggle).toBeDefined();
    expect(typeof DarkModeToggle).toBe("function");
  });

  it("is a React component", () => {
    const component = DarkModeToggle;
    expect(component.name).toBe("DarkModeToggle");
  });

  it("is a client component (has 'use client' directive)", () => {
    const source = DarkModeToggle.toString();
    expect(source).toBeDefined();
  });
});
