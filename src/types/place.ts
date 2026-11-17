export type PlaceStatus = "Quero visitar" | "Visitado";

export type Place = {
  id: string;
  name: string;
  description: string;
  street: string;
  number: string;
  city: string;
  state: string;
  status: PlaceStatus;
  photoAssetId: string | null;
  /** URI usada por registros antigos, antes da migração para Media Library. */
  photoUri?: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
};

export type PlaceDraft = Omit<Place, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

export const placeStatuses: PlaceStatus[] = ["Quero visitar", "Visitado"];

export function fullAddress(place: Pick<Place, "street" | "number" | "city" | "state">) {
  return `${place.street}, ${place.number} · ${place.city}, ${place.state}, Brasil`;
}
