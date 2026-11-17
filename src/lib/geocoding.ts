import * as Location from "expo-location";
import type { Coordinates } from "@/src/hooks/useLocation";

export async function geocodeAddress(enderecoCompleto: string): Promise<Coordinates | null> {
  const results = await Location.geocodeAsync(enderecoCompleto);
  const first = results[0];
  return first ? { latitude: first.latitude, longitude: first.longitude } : null;
}
