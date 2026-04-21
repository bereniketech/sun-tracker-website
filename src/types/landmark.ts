export interface Landmark {
  id: string;
  user_id: string;
  name: string;
  lat: number;
  lng: number;
  notes?: string | null;
  created_at: string;
}

export interface CreateLandmarkInput {
  name: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface UpdateLandmarkInput {
  name?: string;
  notes?: string;
}
