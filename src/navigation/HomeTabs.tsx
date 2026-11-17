import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ListScreen from "@/src/screens/ListScreen";
import MapScreen from "@/src/screens/MapScreen";
import StatsScreen from "@/src/screens/StatsScreen";
import type { MainTabParamList } from "@/src/navigation/types";

const Tabs = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Lista"
        component={ListScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="Mapa"
        component={MapScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="Estatísticas"
        component={StatsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} /> }}
      />
    </Tabs.Navigator>
  );
}
