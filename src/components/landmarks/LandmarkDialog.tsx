"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Landmark, CreateLandmarkInput } from "@/types/landmark";

interface LandmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateLandmarkInput) => Promise<void>;
  initialLat?: number;
  initialLng?: number;
  initialLandmark?: Landmark;
}

export function LandmarkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialLat,
  initialLng,
  initialLandmark,
}: LandmarkDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with landmark data if editing
  useEffect(() => {
    if (initialLandmark) {
      setName(initialLandmark.name);
      setNotes(initialLandmark.notes || "");
    } else {
      setName("");
      setNotes("");
    }
    setError(null);
  }, [initialLandmark, isOpen]);

  // Open/close dialog
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (!isOpen && dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    setName("");
    setNotes("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (initialLandmark) {
      // Edit mode - for now just close since we don't have update API
      handleClose();
      return;
    }

    if (initialLat === undefined || initialLng === undefined) {
      setError("Coordinates are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        lat: initialLat,
        lng: initialLng,
        notes: notes.trim() || undefined,
      });
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save landmark";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-900 backdrop:bg-black/50"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialLandmark ? "Edit Landmark" : "Create Landmark"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-slate-300">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Stonehenge Viewpoint"
            maxLength={200}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:ring-blue-400/20"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {name.length}/200
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium text-slate-900 dark:text-slate-300">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this landmark..."
            maxLength={1000}
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:ring-blue-400/20"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {notes.length}/1000
          </p>
        </div>

        {initialLat !== undefined && initialLng !== undefined && (
          <div className="space-y-1 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Location</p>
            <p className="text-sm text-slate-900 dark:text-white">
              {initialLat.toFixed(6)}, {initialLng.toFixed(6)}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isSubmitting ? "Saving..." : initialLandmark ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
