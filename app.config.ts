import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const googleMapsAndroidApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY?.trim();
const googleMapsIosApiKey = process.env.GOOGLE_MAPS_IOS_API_KEY?.trim();

const config: ExpoConfig = {
  name: "DiarioViagens",
  slug: "diarioviagens",
  version: "1.0.0",
  orientation: "default",
  icon: "./assets/icon.png",
  scheme: "diarioviagens",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.diarioviagens",
    ...(googleMapsIosApiKey ? { config: { googleMapsApiKey: googleMapsIosApiKey } } : {}),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.diarioviagens",
    ...(googleMapsAndroidApiKey ? { config: { googleMaps: { apiKey: googleMapsAndroidApiKey } } } : {}),
  },
  plugins: [
    "expo-asset",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "Sua localização é usada para mostrar você no mapa do Diário de Viagens.",
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "A câmera é usada para fotografar os lugares do seu diário.",
        microphonePermission: false,
        recordAudioAndroid: false,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "A galeria é usada para escolher fotos dos lugares do seu diário.",
        cameraPermission: false,
        microphonePermission: false,
      },
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Acesse suas fotos para escolher lembranças do diário.",
        savePhotosPermission: "Salve na galeria as fotos feitas no Diário de Viagens.",
        granularPermissions: ["photo"],
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/splash-icon.png",
      },
    ],
  ],
};

export default config;
