"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";

// Types
interface City {
  id?: number;
  slug: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface CreateCityInput {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface UpdateCityInput extends CreateCityInput {
  id: number;
}

// City Actions
export async function createCity(input: CreateCityInput): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getAdminClient();

    // Generate slug from name
    const slug = input.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const { error } = await admin.from("cities").insert({
      slug,
      name: input.name,
      country: input.country,
      lat: input.lat,
      lng: input.lng,
      timezone: input.timezone,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/cities");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updateCity(input: UpdateCityInput): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getAdminClient();

    const { error } = await admin
      .from("cities")
      .update({
        name: input.name,
        country: input.country,
        lat: input.lat,
        lng: input.lng,
        timezone: input.timezone,
      })
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/cities");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function deleteCity(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getAdminClient();

    const { error } = await admin.from("cities").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/cities");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

// Landmark Actions
export async function deleteLandmark(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getAdminClient();

    const { error } = await admin.from("user_landmarks").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/landmarks");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

// Stats Actions
export async function getStats(): Promise<{
  citiesCount: number;
  landmarksCount: number;
  subscriptionsCount: number;
  error?: string;
}> {
  try {
    const admin = getAdminClient();

    const [citiesData, landmarksData, subscriptionsData] = await Promise.all([
      admin.from("cities").select("id", { count: "exact", head: true }),
      admin.from("landmarks").select("id", { count: "exact", head: true }),
      admin.from("push_subscriptions").select("id", { count: "exact", head: true }),
    ]);

    return {
      citiesCount: citiesData.count || 0,
      landmarksCount: landmarksData.count || 0,
      subscriptionsCount: subscriptionsData.count || 0,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      citiesCount: 0,
      landmarksCount: 0,
      subscriptionsCount: 0,
      error: message,
    };
  }
}
