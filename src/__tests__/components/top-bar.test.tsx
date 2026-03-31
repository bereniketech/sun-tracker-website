import { fireEvent, render, screen } from "@testing-library/react";
import { TopBar } from "@/components/shell/top-bar";

const mockSignOut = vi.fn();

let mockPathname = "/";
let mockUser: { id: string; email: string } | null = null;

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: mockSignOut,
    getAccessToken: vi.fn().mockResolvedValue(null),
  }),
}));

describe("TopBar", () => {
  beforeEach(() => {
    mockPathname = "/";
    mockUser = null;
    mockSignOut.mockReset();
  });

  it("does not render on the login route", () => {
    mockPathname = "/login";

    render(<TopBar />);

    expect(screen.queryByRole("banner")).toBeNull();
  });

  it("shows login icon link when user is signed out", () => {
    render(<TopBar />);

    expect(screen.getByRole("link", { name: "Go to login" })).toHaveAttribute("href", "/login");
  });

  it("shows sign out action and calls signOut when clicked", () => {
    mockUser = { id: "u1", email: "observer@helios.dev" };

    render(<TopBar />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect(mockSignOut).toHaveBeenCalledOnce();
  });
});
