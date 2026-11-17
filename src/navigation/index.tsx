import { NavigationContainer, type Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlaceDetailsScreen from "@/src/screens/PlaceDetailsScreen";
import PlaceFormScreen from "@/src/screens/PlaceFormScreen";
import { MainTabs } from "./HomeTabs";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

type NavigationProps = {
  theme: Theme;
  onReady: () => void;
};

export function Navigation({ theme, onReady }: NavigationProps) {
  return (
    <NavigationContainer theme={theme} onReady={onReady}>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={PlaceFormScreen} options={{ title: "Cadastro" }} />
        <Stack.Screen name="Detalhes" component={PlaceDetailsScreen} options={{ title: "Detalhes" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
