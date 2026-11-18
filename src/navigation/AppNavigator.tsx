import { NavigationContainer, type Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlaceDetailsScreen from "@/src/screens/PlaceDetailsScreen";
import PlaceFormScreen from "@/src/screens/PlaceFormScreen";
import { MainTabsNavigator } from "./MainTabsNavigator";
import type { RootStackParamList } from "./navigation-types";

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppNavigatorProps = {
  theme: Theme;
  onReady: () => void;
};

export function AppNavigator({ theme, onReady }: AppNavigatorProps) {
  return (
    <NavigationContainer theme={theme} onReady={onReady}>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="Cadastro"
          component={PlaceFormScreen}
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Detalhes"
          component={PlaceDetailsScreen}
          options={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
