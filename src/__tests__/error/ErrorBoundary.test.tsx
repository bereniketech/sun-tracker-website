import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

// Component that throws an error during render
const ThrowingComponent = () => {
  throw new Error("Test error message");
};

// Component that renders normally
const SafeComponent = () => {
  return <div>Safe content</div>;
};

// Conditional component that can throw or render safe
interface ConditionalComponentProps {
  shouldThrow: boolean;
}

const ConditionalComponent = ({ shouldThrow }: ConditionalComponentProps) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>Recovered content</div>;
};

// Simple fallback component
const SimpleFallback = ({ resetErrorBoundary }: { resetErrorBoundary?: () => void }) => (
  <div>
    <div>An error occurred</div>
    {resetErrorBoundary && <button onClick={resetErrorBoundary}>Try again</button>}
  </div>
);

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests to keep output clean
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary fallback={<SimpleFallback />}>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("renders fallback component when an error is thrown", () => {
    render(
      <ErrorBoundary fallback={<SimpleFallback />}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("An error occurred")).toBeInTheDocument();
  });

  it("calls componentDidCatch when an error is caught", () => {
    const componentDidCatchSpy = vi.spyOn(ErrorBoundary.prototype, "componentDidCatch");

    render(
      <ErrorBoundary fallback={<SimpleFallback />}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(componentDidCatchSpy).toHaveBeenCalled();
    const [error] = componentDidCatchSpy.mock.calls[0];
    expect(error.message).toBe("Test error message");
  });

  it("logs error to console in componentDidCatch", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<SimpleFallback />}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("resets error state when reset button is clicked", () => {
    // Use a wrapper to control whether the component throws
    const TestWrapper = () => {
      const [shouldThrow, setShouldThrow] = useState(true);

      return (
        <>
          <ErrorBoundary fallback={<SimpleFallback />}>
            <ConditionalComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
          <button onClick={() => setShouldThrow(false)}>Fix error</button>
        </>
      );
    };

    render(<TestWrapper />);

    // Verify error is shown
    expect(screen.getByText("An error occurred")).toBeInTheDocument();

    // Fix the error condition
    const fixButton = screen.getByRole("button", { name: /fix error/i });
    fireEvent.click(fixButton);

    // Click reset button
    const resetButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(resetButton);

    // After reset, the component should render successfully
    expect(screen.getByText("Recovered content")).toBeInTheDocument();
    expect(screen.queryByText("An error occurred")).not.toBeInTheDocument();
  });

  it("accepts a custom fallback prop and renders it", () => {
    const CustomFallback = () => <div>Custom error UI</div>;

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
  });
});
