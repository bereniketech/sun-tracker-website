import { EDUCATIONAL_ENTRIES, type EducationalTermKey } from "@/lib/educational-content";

describe("educational-content", () => {
  it("contains all 6 required educational term keys", () => {
    const expectedKeys: EducationalTermKey[] = [
      "golden-hour",
      "blue-hour",
      "solar-noon",
      "shadow-ratio",
      "azimuth",
      "elevation",
    ];

    expectedKeys.forEach((key) => {
      expect(EDUCATIONAL_ENTRIES).toHaveProperty(key);
    });

    expect(Object.keys(EDUCATIONAL_ENTRIES)).toHaveLength(6);
  });

  it("all entries have term, shortDefinition, and fullExplanation", () => {
    Object.values(EDUCATIONAL_ENTRIES).forEach((entry) => {
      expect(entry.term).toBeDefined();
      expect(typeof entry.term).toBe("string");
      expect(entry.term.length).toBeGreaterThan(0);

      expect(entry.shortDefinition).toBeDefined();
      expect(typeof entry.shortDefinition).toBe("string");
      expect(entry.shortDefinition.length).toBeGreaterThan(0);

      expect(entry.fullExplanation).toBeDefined();
      expect(typeof entry.fullExplanation).toBe("string");
      expect(entry.fullExplanation.length).toBeGreaterThan(0);
    });
  });

  it("all shortDefinition values are 20 words or less", () => {
    Object.values(EDUCATIONAL_ENTRIES).forEach((entry) => {
      const wordCount = entry.shortDefinition.toLowerCase().trim().split(/\s+/).length;
      expect(wordCount).toBeLessThanOrEqual(20);
    });
  });

  it("all fullExplanation values are non-empty", () => {
    Object.values(EDUCATIONAL_ENTRIES).forEach((entry) => {
      expect(entry.fullExplanation.trim().length).toBeGreaterThan(0);
    });
  });

  it("photographyTip is optional but string when present", () => {
    Object.values(EDUCATIONAL_ENTRIES).forEach((entry) => {
      if (entry.photographyTip !== undefined) {
        expect(typeof entry.photographyTip).toBe("string");
      }
    });
  });
});
