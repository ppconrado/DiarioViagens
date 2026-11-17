import MapView, { Marker } from "react-native-maps";
import type { Coordinates } from "@/src/hooks/useLocation";
import type { Place } from "@/src/types/place";

type MapSurfaceProps = {
  places: Place[];
  currentLocation: Coordinates | null;
};

export default function MapSurface({ places, currentLocation }: MapSurfaceProps) {
  const initialRegion = currentLocation
    ? { ...currentLocation, latitudeDelta: 0.08, longitudeDelta: 0.08 }
    : { latitude: -14.235, longitude: -51.925, latitudeDelta: 35, longitudeDelta: 35 };

  return (
    <MapView
      style={{ flex: 1, minHeight: 340 }}
      initialRegion={initialRegion}
      showsUserLocation={Boolean(currentLocation)}
    >
      {places.map((place) => (
        <Marker
          key={place.id}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          title={place.name}
          description={place.city}
        />
      ))}
    </MapView>
  );
}
