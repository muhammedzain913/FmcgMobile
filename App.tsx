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
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loaded] = useFonts({
    JostBold: require("./app/assets/fonts/Jost-Bold.ttf"),
    JostSemiBold: require("./app/assets/fonts/Jost-SemiBold.ttf"),
    JostLight: require("./app/assets/fonts/Jost-Light.ttf"),
    JostMedium: require("./app/assets/fonts/Jost-Medium.ttf"),
    JostRegular: require("./app/assets/fonts/Jost-Regular.ttf"),
    JostExtraLight: require("./app/assets/fonts/Jost-ExtraLight.ttf"),
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
