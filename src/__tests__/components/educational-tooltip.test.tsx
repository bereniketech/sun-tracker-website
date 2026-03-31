import { fireEvent, render, screen } from "@testing-library/react";
import { EducationalTooltip } from "@/components/panels/educational-tooltip";
import { useEducationalDismissal } from "@/hooks/use-educational-dismissal";

vi.mock("@/hooks/use-educational-dismissal", () => ({
  useEducationalDismissal: vi.fn(),
}));

describe("EducationalTooltip", () => {
  const dismissMock = vi.fn();
  const mockedUseEducationalDismissal = vi.mocked(useEducationalDismissal);

  beforeEach(() => {
    dismissMock.mockReset();
    mockedUseEducationalDismissal.mockReturnValue({
      isDismissed: () => false,
      dismiss: dismissMock,
      resetAll: vi.fn(),
    });
  });

  it("renders children only when the term is dismissed", () => {
    mockedUseEducationalDismissal.mockReturnValue({
      isDismissed: () => true,
      dismiss: dismissMock,
      resetAll: vi.fn(),
    });

    render(<EducationalTooltip term="azimuth">Azimuth</EducationalTooltip>);

    expect(screen.getByText("Azimuth")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Azimuth" })).not.toBeInTheDocument();
  });

  it("opens on click and shows short definition", () => {
    render(<EducationalTooltip term="azimuth">Azimuth</EducationalTooltip>);

    fireEvent.click(screen.getByRole("button", { name: "Azimuth" }));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText(/compass direction where the sun appears/i)).toBeInTheDocument();
  });

  it("calls dismiss when Got it is pressed", () => {
    render(<EducationalTooltip term="azimuth">Azimuth</EducationalTooltip>);

    fireEvent.click(screen.getByRole("button", { name: "Azimuth" }));
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));

    expect(dismissMock).toHaveBeenCalledWith("azimuth");
  });

  it("closes the popover on Escape", () => {
    render(<EducationalTooltip term="azimuth">Azimuth</EducationalTooltip>);

    const trigger = screen.getByRole("button", { name: "Azimuth" });
    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
