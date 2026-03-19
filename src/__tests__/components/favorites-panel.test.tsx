import { act, fireEvent, render, screen } from "@testing-library/react";
import { FavoritesPanel } from "@/components/panels/favorites-panel";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const mockGetAccessToken = vi.fn().mockResolvedValue("test-token");
const mockSignOut = vi.fn();

// Default: unauthenticated
let mockUser: { id: string; email: string } | null = null;

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: mockSignOut,
    getAccessToken: mockGetAccessToken,
  }),
}));

// AuthModal is a dependency — render a lightweight stub to isolate FavoritesPanel
vi.mock("@/components/auth/auth-modal", () => ({
  AuthModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="auth-modal" /> : null,
}));

const SAMPLE_FAVORITES = [
  { id: 1, user_id: "u1", name: "New York", lat: 40.7128, lng: -74.006, created_at: "" },
  { id: 2, user_id: "u1", name: "Paris", lat: 48.8566, lng: 2.3522, created_at: "" },
];

function setupStore() {
  useSunTrackerStore.setState({
    location: { lat: 40.7128, lng: -74.006 },
    locationName: "New York",
    dateTime: new Date("2026-03-19T12:00:00.000Z"),
    isAnimating: false,
    sunData: null,
    activeOverlays: new Set(["sun-position"]),
    photographerMode: false,
    isMobile: false,
  });
}

describe("FavoritesPanel — unauthenticated", () => {
  beforeEach(() => {
    mockUser = null;
    setupStore();
  });

  it("renders the panel with a Sign-in button", () => {
    render(<FavoritesPanel />);
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("opens the auth modal when 'Save current location' is clicked without a user", async () => {
    render(<FavoritesPanel />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save current location/i }));
    });
    expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
  });

  it("shows the auth modal when the Sign-in header button is clicked", () => {
    render(<FavoritesPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
  });
});

describe("FavoritesPanel — authenticated", () => {
  beforeEach(() => {
    mockUser = { id: "u1", email: "test@test.com" };
    setupStore();
  });

  it("fetches and renders favorites on mount", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ favorites: SAMPLE_FAVORITES }),
      }),
    );

    await act(async () => {
      render(<FavoritesPanel />);
    });

    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  it("sends a POST request and refreshes the list when saving", async () => {
    const fetchMock = vi
      .fn()
      // First call: GET /api/favorites
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ favorites: [] }),
      })
      // Second call: POST /api/favorites
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ favorite: SAMPLE_FAVORITES[0] }),
      })
      // Third call: GET /api/favorites after save
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ favorites: [SAMPLE_FAVORITES[0]] }),
      });

    vi.stubGlobal("fetch", fetchMock);

    await act(async () => {
      render(<FavoritesPanel />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save current location/i }));
    });

    const postCall = fetchMock.mock.calls.find(
      ([url, opts]: [string, RequestInit]) =>
        url === "/api/favorites" && opts.method === "POST",
    );
    expect(postCall).toBeDefined();
  });

  it("removes a favorite from the list when delete is clicked", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ favorites: SAMPLE_FAVORITES }),
        })
        .mockResolvedValueOnce({ ok: true }),
    );

    await act(async () => {
      render(<FavoritesPanel />);
    });

    expect(screen.getByText("Paris")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByLabelText("Delete Paris"));
    });

    expect(screen.queryByText("Paris")).toBeNull();
  });

  it("updates the store location when a favorite is clicked", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ favorites: SAMPLE_FAVORITES }),
      }),
    );

    await act(async () => {
      render(<FavoritesPanel />);
    });

    fireEvent.click(screen.getByRole("button", { name: /^Paris/ }));

    const { location, locationName } = useSunTrackerStore.getState();
    expect(location).toEqual({ lat: 48.8566, lng: 2.3522 });
    expect(locationName).toBe("Paris");
  });

  it("shows an error message when saving fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ favorites: [] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: "Failed to save favorite." }),
        }),
    );

    await act(async () => {
      render(<FavoritesPanel />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save current location/i }));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Failed to save favorite.");
  });
});
