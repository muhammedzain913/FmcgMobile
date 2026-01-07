import React, {useRef, useState } from "react";
import {StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import Geocoder from "react-native-geocoding";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { LocationRequest } from "../../types/requests/locationRequest";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
type DeliveryLocationScreenProps = StackScreenProps<
  RootStackParamList,
  "DeliveryLocation"
>;

const DeliveryLocation = ({navigation} : DeliveryLocationScreenProps) => {
  const mapRef = useRef<MapView>(null);
  const [mLat, setMLat] = useState<number>(0); //latitude position
  const [mLong, setMLong] = useState<number>(0); //longitude position-
  const [cordinates, setCordinates] = React.useState({
    latitude: 29.3759,
    longitude: 47.9774,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const getAddress = async (latitude: number, longitude: number) => {
    Geocoder.init("AIzaSyCCaCcEgHXf2_kO12KR3-TwSnXNcc0HcEY");
    const res = await Geocoder.from(latitude, longitude);

    const addressComponents = res.results[0].address_components;

    console.log("addressComponents", addressComponents);
    const userId = useSelector((x : any) => x?.user?.userInfo.id);
    const [location, setLocation] = useState<LocationRequest>({
      userId: userId,
      governorate: "",
      street: "",
      block: 0,
      city: "",
      country: "",
    });

    const getTheExactAddress = (addressComponents: any[], field: string) => {
      return (
        addressComponents.filter((comp) => comp.types.includes(field))[0]
          ?.long_name || ""
      );
    };

    setLocation({
      ...location,
      governorate: getTheExactAddress(
        addressComponents,
        "administrative_area_level_1"
      ),
      street: getTheExactAddress(addressComponents, "route"),
      city: getTheExactAddress(addressComponents, "locality"),
      country: getTheExactAddress(addressComponents, "country"),
    });
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setMLat(position.coords.latitude);
        setMLong(position.coords.longitude);
        setCordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        currentLocationHandler(
          position.coords.latitude,
          position.coords.longitude
        );
        getAddress(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const currentLocationHandler = (latitude: number, longitude: number) => {
    let currentRegion = {
      latitude: latitude, // latitude from geolocation
      longitude: longitude, // longitude from geolocation
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    mapRef?.current?.animateToRegion(currentRegion, 3 * 1000);
  };

  const navigateToNextScreen = () => {
    console.log("navigating to next screen");
  }

  return (
    <View style={styles.container}>
      {/* MAP AT THE BOTTOM */}

      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: cordinates.latitude, // Center of Kuwait
          longitude: cordinates.longitude,
          latitudeDelta: 1, // Bigger number = zoomed out view
          longitudeDelta: 1,
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >
        <Marker
          coordinate={cordinates}
          title={"title"}
          description={"description"}
        ></Marker>
      </MapView>

      {/* AUTOCOMPLETE ON TOP OF MAP */}
      <View
        style={{ justifyContent: "center", alignItems: "center", bottom: 80 }}
      >
        <TouchableOpacity
          style={{
            width: "50%",
            height: 30,
            alignSelf: "center",
            position: "absolute",
            backgroundColor: "white",
            bottom: 20, // Adjusted positioning
            borderWidth: 1,
            borderColor: "green",
            borderRadius: 10,
            justifyContent: "center",
          }}
          onPress={getLocation}
        >
          <Text style={{ color: "green", textAlign: "center", fontSize: 12 }}>
            {loading === true
              ? "Your location is fetching..."
              : "use current location"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer} pointerEvents="box-none">
        <GooglePlacesAutocomplete
          placeholder="Search for a place"
          fetchDetails={true}
          enablePoweredByContainer={false}
          query={{
            key: "AIzaSyCCaCcEgHXf2_kO12KR3-TwSnXNcc0HcEY",
            language: "en",
          }}
          onFail={(err) => console.log("FAIL:", err)}
          onNotFound={() => console.log("Not found")}
          onPress={(data, details) => {
            console.log("details", details);
            console.log("data", data);
            console.log("CITY", details?.address_components[0].types[0]);
            console.log("formattedAddress", details?.formatted_address);
            setCordinates({
              latitude: details?.geometry.location.lat || 0,
              longitude: details?.geometry.location.lng || 0,
            });
            currentLocationHandler(
              details?.geometry.location.lat || 0,
              details?.geometry.location.lng || 0
            );
            getAddress(
              details?.geometry.location.lat || 0,
              details?.geometry.location.lng || 0
            );
          }}
          styles={{
            container: {
              flex: 0,
            },
            textInputContainer: {
              backgroundColor: "white",
              borderRadius: 10,
              paddingHorizontal: 10,
            },
            textInput: {
              height: 44,
              borderRadius: 10,
            },
          }}
        />
      </View>

      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <TouchableOpacity
          onPress={navigateToNextScreen}
          style={{
            height: 50,
            backgroundColor: "green",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeliveryLocation;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 999, // IMPORTANT FOR ANDROID + iOS
    elevation: 10, // ANDROID ONLY
  },

  container: {
    flex: 1,
  },
  triggerStyle: {
    height: 40,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp("90%"),
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  triggerText: {
    fontSize: 16,
  },
});
