import MapView, { Marker } from "react-native-maps";
import type { Coordinates } from "@/src/hooks/useLocation";
import { colors } from "@/src/theme/colors";
import type { Place } from "@/src/types/place";

type MapSurfaceProps = {
  places: Place[];
  currentLocation: Coordinates | null;
  onSelectPlace?: (id: string) => void;
  compact?: boolean;
};

export default function MapSurface({ places, currentLocation, onSelectPlace, compact = false }: MapSurfaceProps) {
  const initialRegion = currentLocation
    ? { ...currentLocation, latitudeDelta: 0.08, longitudeDelta: 0.08 }
    : { latitude: -14.235, longitude: -51.925, latitudeDelta: 35, longitudeDelta: 35 };

  return (
    <MapView
      style={{ flex: 1, minHeight: compact ? 220 : 340 }}
      initialRegion={initialRegion}
      showsUserLocation={Boolean(currentLocation)}
    >
      {places.map((place) => (
        <Marker
          key={place.id}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          title={place.name}
          description={place.city}
          pinColor={place.status === "Visitado" ? colors.visited : colors.planned}
          onPress={() => onSelectPlace?.(place.id)}
        />
      ))}
    </MapView>
  );
}
