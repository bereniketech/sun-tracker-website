"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

interface EmailReportToggleProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function EmailReportToggle({ onSuccess, onError }: EmailReportToggleProps) {
  const { user, getAccessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const locationName = useSunTrackerStore((state) => state.locationName);
  const lat = useSunTrackerStore((state) => state.location.lat);
  const lng = useSunTrackerStore((state) => state.location.lng);

  // Load initial subscription status
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      loadSubscriptionStatus();
    }
  }, [user?.email]);

  const loadSubscriptionStatus = async () => {
    try {
      // Try to fetch existing subscription to check status
      // In a real app, you'd have a GET endpoint to check this
      setIsSubscribed(false);
    } catch (err) {
      console.error("Failed to load subscription status:", err);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      if (!email) {
        throw new Error("Email is required");
      }

      if (!lat || !lng || !locationName) {
        throw new Error("Location information is required");
      }

      const response = await fetch("/api/email-reports/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          lat,
          lng,
          location_name: locationName
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubscribed(true);
      setSuccess("Successfully subscribed to monthly email reports!");
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/email-reports/subscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unsubscribe");
      }

      setIsSubscribed(false);
      setSuccess("Successfully unsubscribed from email reports.");
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900">Monthly Email Reports</h3>
          <p className="text-xs text-slate-600 mt-1">
            Get a monthly digest of sun data highlights for your location
          </p>
        </div>

        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
                required
              />
            </div>

            {locationName && (
              <div className="text-xs text-slate-600">
                <span className="font-semibold">Location:</span> {locationName} ({lat.toFixed(4)}, {lng.toFixed(4)})
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-300 p-2">
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 border border-green-300 p-2">
                <p className="text-xs text-green-700">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !locationName}
              className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-green-50 border border-green-300 p-3">
              <p className="text-xs text-green-700 font-semibold mb-1">Subscribed</p>
              <p className="text-xs text-green-700">
                You&apos;ll receive monthly reports at {email}
              </p>
            </div>

            {success && (
              <div className="rounded-lg bg-green-50 border border-green-300 p-2">
                <p className="text-xs text-green-700">{success}</p>
              </div>
            )}

            <button
              onClick={handleUnsubscribe}
              disabled={isLoading}
              className="w-full rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Unsubscribing..." : "Unsubscribe"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
