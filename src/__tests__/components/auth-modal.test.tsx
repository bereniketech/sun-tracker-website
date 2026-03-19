import { act, fireEvent, render, screen } from "@testing-library/react";
import { AuthModal } from "@/components/auth/auth-modal";

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue(null),
  }),
}));

describe("AuthModal", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignUp.mockReset();
  });

  it("does not render when isOpen is false", () => {
    render(<AuthModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the sign-in form when isOpen is true", () => {
    render(<AuthModal isOpen onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Heading
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("switches to sign-up mode when 'Create one' is clicked", () => {
    render(<AuthModal isOpen onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Create one" }));
    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
  });

  it("shows an error message on failed sign-in", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid credentials" });
    render(<AuthModal isOpen onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("calls onClose after a successful sign-in", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const onClose = vi.fn();
    render(<AuthModal isOpen onClose={onClose} />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);
    });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows a success message after sign-up instead of closing", async () => {
    mockSignUp.mockResolvedValue({ error: null });
    render(<AuthModal isOpen onClose={vi.fn()} />);

    // Switch to sign-up mode
    fireEvent.click(screen.getByRole("button", { name: "Create one" }));

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "new@user.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "newpass" } });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", { name: "Create account" }).closest("form")!,
      );
    });

    expect(screen.getByRole("status")).toHaveTextContent(/check your email/i);
  });

  it("closes when the backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen onClose={onClose} />);
    // Click the backdrop (the outermost dialog div)
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes when the × button is clicked", () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close auth modal"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
