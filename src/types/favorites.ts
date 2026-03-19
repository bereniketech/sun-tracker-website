export interface Favorite {
  id: number;
  user_id: string;
  name: string;
  lat: number;
  lng: number;
  created_at: string;
}

export interface CreateFavoriteInput {
  name: string;
  lat: number;
  lng: number;
}
