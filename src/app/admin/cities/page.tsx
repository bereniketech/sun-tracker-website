"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { createCity, deleteCity, updateCity } from "../actions";

interface City {
  id: number;
  slug: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface FormData {
  name: string;
  country: string;
  lat: string;
  lng: string;
  timezone: string;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    country: "",
    lat: "",
    lng: "",
    timezone: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadCities();
  }, []);

  async function loadCities() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/cities");
      if (!response.ok) throw new Error("Failed to load cities");
      const data = await response.json();
      setCities(data);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load cities",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenDialog(city?: City) {
    if (city) {
      setEditingId(city.id);
      setFormData({
        name: city.name,
        country: city.country,
        lat: city.lat.toString(),
        lng: city.lng.toString(),
        timezone: city.timezone,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        country: "",
        lat: "",
        lng: "",
        timezone: "",
      });
    }
    setShowDialog(true);
  }

  function handleCloseDialog() {
    setShowDialog(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const input = {
        name: formData.name,
        country: formData.country,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        timezone: formData.timezone,
      };

      let result;
      if (editingId) {
        result = await updateCity({ ...input, id: editingId });
      } else {
        result = await createCity(input);
      }

      if (result.success) {
        setMessage({
          type: "success",
          text: editingId ? "City updated successfully" : "City created successfully",
        });
        handleCloseDialog();
        loadCities();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Operation failed",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this city?")) return;

    try {
      const result = await deleteCity(id);
      if (result.success) {
        setMessage({
          type: "success",
          text: "City deleted successfully",
        });
        loadCities();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to delete city",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cities</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add City
        </button>
      </div>

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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Country</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Latitude</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Longitude</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timezone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cities.map((city) => (
                <tr key={city.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{city.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{city.country}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{city.lat.toFixed(4)}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{city.lng.toFixed(4)}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{city.timezone}</td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDialog(city)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingId ? "Edit City" : "Add New City"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    required
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    required
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., America/New_York"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
