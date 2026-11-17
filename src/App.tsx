import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { PlacesProvider } from './context/PlacesContext';
import { Navigation } from './navigation';

Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <PlacesProvider>
      <Navigation
        theme={theme}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </PlacesProvider>
  );
}
