import { act, fireEvent, render, screen } from "@testing-library/react";
import { LoginForm } from "@/components/login/login-form";

const mockPush = vi.fn();
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

let mockUser: { id: string; email: string } | null = null;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: false,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue(null),
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockSignIn.mockReset();
    mockSignUp.mockReset();
    mockUser = null;
  });

  it("redirects signed-in users to home", () => {
    mockUser = { id: "u1", email: "test@example.com" };

    render(<LoginForm />);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("signs in and navigates to home on success", async () => {
    mockSignIn.mockResolvedValue({ error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Observer ID / Email"), {
      target: { value: "sun@chrono.com" },
    });
    fireEvent.change(screen.getByLabelText("Access Key / Password"), {
      target: { value: "secret-123" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "SIGN IN" }).closest("form")!);
    });

    expect(mockSignIn).toHaveBeenCalledWith("sun@chrono.com", "secret-123");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows sign-in error when auth fails", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid credentials" });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Observer ID / Email"), {
      target: { value: "sun@chrono.com" },
    });
    fireEvent.change(screen.getByLabelText("Access Key / Password"), {
      target: { value: "wrong" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "SIGN IN" }).closest("form")!);
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("toggles to sign-up mode and shows confirmation on success", async () => {
    mockSignUp.mockResolvedValue({ error: null });

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    fireEvent.change(screen.getByLabelText("Observer ID / Email"), {
      target: { value: "new@chrono.com" },
    });
    fireEvent.change(screen.getByLabelText("Access Key / Password"), {
      target: { value: "secure-789" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "CREATE ACCOUNT" }).closest("form")!);
    });

    expect(mockSignUp).toHaveBeenCalledWith("new@chrono.com", "secure-789");
    expect(screen.getByRole("status")).toHaveTextContent(/check your email/i);
  });

  it("navigates home when continuing as guest", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "CONTINUE AS GUEST" }));

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
