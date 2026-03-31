import { render, screen } from "@testing-library/react";
import { LightingInsightCard } from "@/components/panels/lighting-insight-card";
import type { LightingInsight, LightingLabel } from "@/lib/lighting-insight";

const BASE_SUGGESTIONS = [
  { label: "Shot A", technique: "Technique A." },
  { label: "Shot B", technique: "Technique B." },
];

function makeInsight(label: LightingLabel, warningMessage?: string): LightingInsight {
  return {
    label,
    headline: `Headline for ${label}`,
    warningMessage,
    shotSuggestions: BASE_SUGGESTIONS,
  };
}

const ALL_LABELS: LightingLabel[] = ["GOLDEN", "BLUE", "TWILIGHT", "NIGHT", "HARSH", "SOFT"];

describe("LightingInsightCard", () => {
  test.each(ALL_LABELS)("renders badge and headline for %s label", (label) => {
    render(<LightingInsightCard insight={makeInsight(label)} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(`Headline for ${label}`)).toBeInTheDocument();
  });

  test("renders shot suggestions", () => {
    render(<LightingInsightCard insight={makeInsight("GOLDEN")} />);
    expect(screen.getByText("Shot A")).toBeInTheDocument();
    expect(screen.getByText("Shot B")).toBeInTheDocument();
  });

  test("renders warningMessage when provided", () => {
    const insight = makeInsight("HARSH", "Warning: harsh light!");
    render(<LightingInsightCard insight={insight} />);
    expect(screen.getByText(/Warning: harsh light!/)).toBeInTheDocument();
  });

  test("does not render warning when warningMessage is absent", () => {
    render(<LightingInsightCard insight={makeInsight("SOFT")} />);
    expect(screen.queryByText(/⚠/)).not.toBeInTheDocument();
  });

  test("renders technique text for suggestions", () => {
    render(<LightingInsightCard insight={makeInsight("BLUE")} />);
    expect(screen.getByText(/Technique A\./)).toBeInTheDocument();
  });
});
