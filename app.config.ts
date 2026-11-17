import type { ExpoConfig } from "expo/config";

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
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.diarioviagens",
  },
  plugins: [
    "expo-asset",
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
