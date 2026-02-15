import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store, persistor } from "./app/redux/store";
import Route from "./app/navigation/Route";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
export default function App() {
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loaded] = useFonts({
    // Lato fonts - load with exact names used in code
    Lato: require("./app/assets/fonts/Lato-Regular.ttf"),
    "Lato-Regular": require("./app/assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./app/assets/fonts/Lato-Bold.ttf"),
    "Lato-Light": require("./app/assets/fonts/Lato-Light.ttf"),
    "Lato-Black": require("./app/assets/fonts/Lato-Black.ttf"),
    "Lato-Thin": require("./app/assets/fonts/Lato-Thin.ttf"),
    "Lato-Italic": require("./app/assets/fonts/Lato-Italic.ttf"),
    // Map SemiBold and Medium to Bold (since those font files don't exist)
    "Lato-SemiBold": require("./app/assets/fonts/Lato-Bold.ttf"),
    "Lato-Medium": require("./app/assets/fonts/Lato-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Route />
          </PersistGate>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
