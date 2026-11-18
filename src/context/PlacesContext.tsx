import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Place, PlaceDraft, PlaceStatus } from "@/src/types/place";

const STORAGE_KEY = "diario-de-viagens:places:v1";

type PlacesContextValue = {
  places: Place[];
  isLoaded: boolean;
  storageError: string | null;
  savePlace: (draft: PlaceDraft) => Promise<Place>;
  updateStatus: (id: string, status: PlaceStatus) => Promise<void>;
  removePlace: (id: string) => Promise<void>;
  findPlace: (id: string) => Place | undefined;
};

const PlacesContext = createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: PropsWithChildren) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const parsed = JSON.parse(raw) as Place[];
        if (Array.isArray(parsed)) {
          setPlaces(parsed.map((place) => ({
            ...place,
            photoAssetId: place.photoAssetId ?? null,
          })));
        }
      })
      .catch((error) => {
        console.warn("Não foi possível carregar o diário local.", error);
        if (active) setStorageError("Não foi possível carregar o diário local. Reinicie o app antes de fazer alterações para evitar perda de dados.");
      })
      .finally(() => {
        if (active) setIsLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (next: Place[]) => {
    if (storageError) throw new Error(storageError);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setPlaces(next);
    } catch (error) {
      console.warn("Não foi possível salvar o diário neste dispositivo.", error);
      throw new Error("Não foi possível salvar no armazenamento do dispositivo. Confira o espaço disponível e tente novamente.");
    }
  }, [storageError]);

  const savePlace = useCallback(
    async (draft: PlaceDraft) => {
      const existing = draft.id ? places.find((place) => place.id === draft.id) : undefined;
      const place: Place = {
        ...draft,
        id: existing?.id ?? draft.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: existing?.createdAt ?? draft.createdAt ?? new Date().toISOString(),
      };
      const next = existing
        ? places.map((item) => (item.id === place.id ? place : item))
        : [place, ...places];
      await persist(next);
      return place;
    },
    [persist, places],
  );

  const updateStatus = useCallback(
    async (id: string, status: PlaceStatus) => {
      await persist(places.map((place) => (place.id === id ? { ...place, status } : place)));
    },
    [persist, places],
  );

  const removePlace = useCallback(
    async (id: string) => {
      await persist(places.filter((place) => place.id !== id));
    },
    [persist, places],
  );

  const value = useMemo(
    () => ({ places, isLoaded, storageError, savePlace, updateStatus, removePlace, findPlace: (id: string) => places.find((place) => place.id === id) }),
    [places, isLoaded, storageError, savePlace, updateStatus, removePlace],
  );

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) throw new Error("usePlaces deve ser usado dentro de PlacesProvider.");
  return context;
}
