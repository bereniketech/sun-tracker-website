"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteLandmark } from "../actions";

interface UserLandmark {
  id: string;
  user_id: string;
  name: string;
  lat: number;
  lng: number;
  notes: string | null;
  created_at: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export default function LandmarksPage() {
  const [landmarks, setLandmarks] = useState<UserLandmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadLandmarks();
  }, [pagination.page, pagination.pageSize]);

  async function loadLandmarks() {
    try {
      setLoading(true);
      const offset = (pagination.page - 1) * pagination.pageSize;
      const response = await fetch(
        `/api/admin/landmarks?offset=${offset}&limit=${pagination.pageSize}`
      );
      if (!response.ok) throw new Error("Failed to load landmarks");
      const data = await response.json();
      setLandmarks(data.landmarks);
      setPagination((prev) => ({ ...prev, total: data.total }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load landmarks",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this landmark?")) return;

    try {
      const result = await deleteLandmark(id);
      if (result.success) {
        setMessage({
          type: "success",
          text: "Landmark deleted successfully",
        });
        loadLandmarks();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to delete landmark",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Landmarks</h1>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Latitude
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Longitude
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {landmarks.map((landmark) => (
                  <tr key={landmark.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{landmark.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 font-mono text-xs">
                      {landmark.user_id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{landmark.lat.toFixed(6)}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{landmark.lng.toFixed(6)}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(landmark.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <button
                        onClick={() => handleDelete(landmark.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} landmarks
            </div>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={pagination.page === totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
