"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import type { Favorite } from "@/types/favorites";

async function buildAuthHeaders(
  getAccessToken: () => Promise<string | null>,
): Promise<Record<string, string>> {
  const token = await getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function FavoritesPanel() {
  const { user, isLoading: isAuthLoading, signOut, getAccessToken } = useAuth();
  const location = useSunTrackerStore((state) => state.location);
  const locationName = useSunTrackerStore((state) => state.locationName);
  const setLocation = useSunTrackerStore((state) => state.setLocation);

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (user) {
      void fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchFavorites(): Promise<void> {
    setIsFetching(true);
    try {
      const headers = await buildAuthHeaders(getAccessToken);
      const res = await fetch("/api/favorites", { headers });
      if (!res.ok) return;
      const body = (await res.json()) as { favorites: Favorite[] };
      setFavorites(body.favorites);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleSave(): Promise<void> {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!location) return;

    setSaveError(null);
    setIsSaving(true);
    try {
      const headers = await buildAuthHeaders(getAccessToken);
      const name =
        locationName.trim() ||
        `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ name, lat: location.lat, lng: location.lng }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setSaveError(body.error ?? "Failed to save favorite.");
        return;
      }
      await fetchFavorites();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number): Promise<void> {
    const headers = await buildAuthHeaders(getAccessToken);
    const res = await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    }
  }

  function handleSelectFavorite(fav: Favorite): void {
    setLocation(fav.lat, fav.lng, fav.name);
  }

  return (
    <>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-800">
            Favorites
          </h2>
          <div className="flex items-center gap-2">
            {user && (
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => void signOut()}
              >
                Sign out
              </button>
            )}
            {!user && !isAuthLoading && (
              <button
                type="button"
                className="rounded-lg border border-amber-400 bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900"
                onClick={() => setAuthModalOpen(true)}
              >
                Sign in
              </button>
            )}
            <button
              type="button"
              className="ml-1 text-xs text-slate-400 hover:text-slate-700"
              onClick={() => setIsOpen((o) => !o)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Collapse favorites" : "Expand favorites"}
            >
              {isOpen ? "▴" : "▾"}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-3 space-y-2">
            <button
              type="button"
              disabled={!location || isSaving}
              className="w-full rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-40"
              onClick={() => void handleSave()}
            >
              {isSaving ? "Saving…" : "Save current location"}
            </button>

            {saveError && (
              <p role="alert" className="text-xs text-red-600">
                {saveError}
              </p>
            )}

            {!user && !isAuthLoading && (
              <p className="text-xs text-slate-500">Sign in to save and view favorites.</p>
            )}

            {isFetching && <p className="text-xs text-slate-400">Loading…</p>}

            {user && !isFetching && favorites.length === 0 && (
              <p className="text-xs text-slate-500">No saved favorites yet.</p>
            )}

            {favorites.length > 0 && (
              <ul className="space-y-1">
                {favorites.map((fav) => (
                  <li
                    key={fav.id}
                    className="flex items-center gap-2 rounded-lg border border-slate-100 p-2"
                  >
                    <button
                      type="button"
                      className="flex-1 text-left text-xs font-medium text-slate-800 hover:text-amber-700"
                      onClick={() => handleSelectFavorite(fav)}
                    >
                      {fav.name}
                      <span className="ml-1 font-normal text-slate-400">
                        ({fav.lat.toFixed(3)}, {fav.lng.toFixed(3)})
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rounded p-0.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-600"
                      onClick={() => void handleDelete(fav.id)}
                      aria-label={`Delete ${fav.name}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
