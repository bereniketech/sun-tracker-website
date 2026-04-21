"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./use-auth";
import type { Landmark, CreateLandmarkInput } from "@/types/landmark";

interface UseLandmarksReturn {
  landmarks: Landmark[];
  isLoading: boolean;
  error: string | null;
  createLandmark: (input: CreateLandmarkInput) => Promise<Landmark | null>;
  deleteLandmark: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useLandmarks(): UseLandmarksReturn {
  const { user, isLoading: authLoading, getAccessToken } = useAuth();
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch landmarks on mount and when user changes
  const fetchLandmarks = useCallback(async () => {
    if (!user) {
      setLandmarks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = await getAccessToken();
      const authHeader = token ? `Bearer ${token}` : undefined;

      const response = await fetch("/api/user-landmarks", {
        headers: authHeader ? { Authorization: authHeader } : {},
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch landmarks: ${response.statusText}`);
      }

      const data = await response.json();
      setLandmarks(data.landmarks || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user, getAccessToken]);

  useEffect(() => {
    if (!authLoading) {
      fetchLandmarks();
    }
  }, [user, authLoading, fetchLandmarks]);

  const createLandmark = useCallback(
    async (input: CreateLandmarkInput): Promise<Landmark | null> => {
      if (!user) {
        setError("Not authenticated");
        return null;
      }

      try {
        const token = await getAccessToken();
        const authHeader = token ? `Bearer ${token}` : undefined;

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const tempLandmark: Landmark = {
          id: tempId,
          user_id: user.id,
          name: input.name,
          lat: input.lat,
          lng: input.lng,
          notes: input.notes || null,
          created_at: new Date().toISOString(),
        };

        setLandmarks((prev) => [tempLandmark, ...prev]);

        const response = await fetch("/api/user-landmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          // Rollback on error
          setLandmarks((prev) => prev.filter((l) => l.id !== tempId));
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create landmark");
        }

        const data = await response.json();
        const newLandmark = data.landmark as Landmark;

        // Replace temp landmark with actual landmark
        setLandmarks((prev) =>
          prev.map((l) => (l.id === tempId ? newLandmark : l)),
        );

        return newLandmark;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      }
    },
    [user, getAccessToken],
  );

  const deleteLandmark = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        setError("Not authenticated");
        return false;
      }

      try {
        const token = await getAccessToken();
        const authHeader = token ? `Bearer ${token}` : undefined;

        // Optimistic update
        const previousLandmarks = landmarks;
        setLandmarks((prev) => prev.filter((l) => l.id !== id));

        const response = await fetch(`/api/user-landmarks/${id}`, {
          method: "DELETE",
          headers: authHeader ? { Authorization: authHeader } : {},
        });

        if (!response.ok) {
          // Rollback on error
          setLandmarks(previousLandmarks);
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete landmark");
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return false;
      }
    },
    [user, landmarks, getAccessToken],
  );

  return {
    landmarks,
    isLoading: authLoading || isLoading,
    error,
    createLandmark,
    deleteLandmark,
    refetch: fetchLandmarks,
  };
}
