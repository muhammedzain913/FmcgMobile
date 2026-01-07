import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import DropdownMenu from "../../components/DropDown/DropDownMenu";
import { citiesAndBlocks } from "../../data";
import MenuOption from "../../components/DropDown/MenuOption";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Block, City } from "../../types/area";
import { AppDispatch } from "../../redux/store";
import { saveUserLocation } from "../../redux/reducer/userReducer";
import { unwrapResult } from "@reduxjs/toolkit";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import Button from "../../components/Button/Button";
import { COLORS } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";
type UserLocationScreenProps = StackScreenProps<
  RootStackParamList,
  "UserLocation"
>;

const apiPath = ApiClient();

const UserLocation = ({ navigation }: UserLocationScreenProps) => {
  const [governorates, setGovernorates] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const [governorate, setGovernorate] = useState<any>({});
  const [cities, setCities] = useState<any[]>([]);
  const [city, setCity] = useState<any>({});
  const [blocks, setBlocks] = useState<any[]>([]);
  const [govVisible, setGovVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [blockVisible, setBlockVisible] = useState(false);
  const [block, setBlock] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const navigateToNextScreen = async () => {
    const updatedLocation = {
      userId,
      country: "Kuwait",
      governorate: governorate.name,
      city: city.name,
      block: block.name,
    };

    try {
      setLoading(true);
      const response = await dispatch(saveUserLocation(updatedLocation));
      const result = unwrapResult(response);
      console.log("Location saved successfully:", result);
      navigation.navigate("DrawerNavigation", { screen: "Home" });
    } catch (error) {
      console.log("Error registering user:", error);
      Alert.alert(
        "Registration Error",
        "Failed to register user. Please try again."
      );
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGovernertes = async () => {
      const response = await apiPath.get(`${Url}/api/governorates`);
      setGovernorates(response.data);
    };
    fetchGovernertes();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      const id = governorate.id;
      const response = await apiPath.get(
        `${Url}/api/governorates/${id}/cities`
      );
      console.log(response);
      setCities(response.data);
      setCity(null);
    };
    fetchCities();
  }, [governorate]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const response = await apiPath.get(`${Url}/api/cities/${city.id}/blocks`);
      setBlocks(response.data);
      setBlock(null);
    };
    fetchBlocks();
  }, [city]);



  return (
    <>
      <View style={{ padding: 16 }}>
        <Text>Select Your Governorate</Text>
        <DropdownMenu
          visible={govVisible}
          handleOpen={() => setGovVisible(true)}
          handleClose={() => setGovVisible(false)}
          trigger={
            <View style={styles.triggerStyle}>
              <Text style={styles.triggerText}>
                {governorate ? governorate.name : "Select Governerate"}
              </Text>
            </View>
          }
        >
          {governorates.map((block: any, index) => {
            return (
              <MenuOption
                key={index}
                onSelect={() => {
                  setGovernorate(block);
                  setGovVisible(false);
                }}
              >
                <Text>{block.name}</Text>
              </MenuOption>
            );
          })}
        </DropdownMenu>

        {cities && cities.length > 0 && (
          <>
            <Text>Select Your City</Text>
            <DropdownMenu
              visible={cityVisible}
              handleOpen={() => setCityVisible(true)}
              handleClose={() => setCityVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {city ? city.name : "Select City"}
                  </Text>
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {cities.map((city, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setCity(city);
                        setCityVisible(false);
                      }}
                    >
                      <Text>{city.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>
          </>
        )}

        {blocks && blocks.length > 0 && (
          <>
            <Text>Select Your Block</Text>
            <DropdownMenu
              visible={blockVisible}
              handleOpen={() => setBlockVisible(true)}
              handleClose={() => setBlockVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {block ? block.name : "Select Block"}
                  </Text>
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {blocks.map((block, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setBlock(block);
                        setBlockVisible(false);
                      }}
                    >
                      <Text>{block.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>
          </>
        )}
      </View>

      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Button
            title="Save"
            color={theme.dark ? COLORS.white : COLORS.primary}
            text={theme.dark ? COLORS.primary : COLORS.white}
            onPress={navigateToNextScreen}
          />
        )}
      </View>
    </>
  );
};

export default UserLocation;
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
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
