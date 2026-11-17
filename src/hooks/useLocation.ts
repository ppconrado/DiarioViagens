import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

export type Coordinates = { latitude: number; longitude: number };

export function useLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setPermissionDenied(true);
        setLocation(null);
        return;
      }
      setPermissionDenied(false);
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude });
    } catch {
      setErrorMessage("Não foi possível obter sua localização agora. Confira o GPS e tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const startup = setTimeout(() => { void refreshLocation(); }, 0);
    return () => clearTimeout(startup);
  }, [refreshLocation]);

  return { location, loading, permissionDenied, errorMessage, refreshLocation };
}
