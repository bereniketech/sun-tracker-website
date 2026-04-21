"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Landmark } from "@/types/landmark";

interface LandmarkMarkerProps {
  landmark: Landmark;
  onEdit: (landmark: Landmark) => void;
  onDelete: (id: string) => void;
}

export function LandmarkMarker({ landmark, onEdit, onDelete }: LandmarkMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Find the map instance in the Leaflet global scope
    const containers = document.querySelectorAll("[data-map-container]");
    if (containers.length === 0) return;

    // Try to get map from the first map container
    const mapContainer = containers[0] as HTMLElement & { _leaflet_map?: L.Map };
    if (!mapContainer._leaflet_map) return;

    mapRef.current = mapContainer._leaflet_map;
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Create custom marker icon with emoji
    const customIcon = L.divIcon({
      html: `<div class="text-2xl">📍</div>`,
      className: "landmark-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Create marker
    const marker = L.marker([landmark.lat, landmark.lng], {
      icon: customIcon,
    }).addTo(map);

    // Create popup content
    const popupContent = `
      <div class="landmark-popup p-2 min-w-[200px]">
        <h3 class="font-bold text-sm mb-1">${escapeHtml(landmark.name)}</h3>
        ${
          landmark.notes
            ? `<p class="text-xs text-gray-600 mb-2">${escapeHtml(landmark.notes)}</p>`
            : ""
        }
        <div class="flex gap-2 mt-2">
          <button class="landmark-edit-btn text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit
          </button>
          <button class="landmark-delete-btn text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    // Event handlers for popup buttons
    marker.on("popupopen", () => {
      const popup = marker.getPopup();
      if (popup) {
        const content = popup.getContent();
        if (typeof content === "string") {
          // Add event listeners to buttons
          setTimeout(() => {
            const editBtn = document.querySelector(".landmark-edit-btn");
            const deleteBtn = document.querySelector(".landmark-delete-btn");

            if (editBtn) {
              editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                onEdit(landmark);
                marker.closePopup();
              });
            }

            if (deleteBtn) {
              deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm("Delete this landmark?")) {
                  onDelete(landmark.id);
                  marker.remove();
                }
              });
            }
          }, 0);
        }
      }
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current && map.hasLayer(markerRef.current)) {
        map.removeLayer(markerRef.current);
      }
    };
  }, [landmark, onEdit, onDelete]);

  return null;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
