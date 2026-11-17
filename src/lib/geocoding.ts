import { Platform } from "react-native";
import * as Location from "expo-location";
import type { Coordinates } from "@/src/hooks/useLocation";

// O app nativo usa a API solicitada no enunciado; o preview web usa Nominatim.
export async function geocodeAddress(enderecoCompleto: string): Promise<Coordinates | null> {
  if (Platform.OS === "web") {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(enderecoCompleto)}`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("O serviço de mapas não respondeu.");
    const results = (await response.json()) as { lat: string; lon: string }[];
    return results[0]
      ? { latitude: Number(results[0].lat), longitude: Number(results[0].lon) }
      : null;
  }

  const results = await Location.geocodeAsync(enderecoCompleto);
  const first = results[0];
  return first ? { latitude: first.latitude, longitude: first.longitude } : null;
}
