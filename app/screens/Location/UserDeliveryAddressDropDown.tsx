import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { COLORS } from "../../constants/theme";
import { Typography } from "../../constants/typography";
import { useSelector } from "react-redux";
import Animated, { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import DropdownMenu from "../../components/DropDown/DropDownMenu";
import MenuOption from "../../components/DropDown/MenuOption";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSaveUserLocation } from "../../hooks/useSaveUserLocation";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { LocationRequest } from "../../types/requests/locationRequest";
import { StatusBar } from "expo-status-bar";

type Props = {
  onChangeLocation: () => void;
};

const UserDeliveryAddressDropDown = ({
  onChangeLocation,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const defaultAddress = useSelector((x: any) => x.user.defaultAddress);
  const { saveLocation } = useSaveUserLocation();
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const [addressType, setAddressType] = useState<string>("");
  const isOpen = useSharedValue(false);

  const [savedAddress, setSavedAddress] = useState<LocationRequest>({
    userId: defaultAddress.userId,
    governorate: defaultAddress.governorate,
    street: "",
    block: defaultAddress.block,
    city: defaultAddress.city,
    phone: "",
    building: "",
    country: defaultAddress.country,
  });

  const handleChange = (text: string, field: keyof LocationRequest) => {
    setSavedAddress((prev) => ({
      ...(prev as LocationRequest),
      [field]: text,
    }));
  };

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  const {
    governorates,
    cities,
    blocks,

    governorate,
    city,
    block,

    setGovernorate,
    setCity,
    setBlock,

    govVisible,
    cityVisible,
    blockVisible,

    setGovVisible,
    setCityVisible,
    setBlockVisible,
  } = useLocationSelector();

  useEffect(() => {
    console.log(
      "this is the governorate city or block",
      governorate,
      city,
      block,
    );
  }, [governorate, city, block]);

  useEffect(() => {
    console.log("default", defaultAddress);
  });

  const onSaveAddress = () => {
    saveLocation({
      payload: {
        userId,
        governorate: governorate?.id,
        city: city?.id,
        block: block?.id,
        country: "Kuwait",
        street: savedAddress.street,
        building: savedAddress.building,
      },
      onSuccess: () => {
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "DrawerNavigation" }],
        // });
      },
      onError: () => {
        Alert.alert("Error", "Failed to save address");
      },
    });
  };

  useEffect(() => {
    console.log("default address from here", defaultAddress);
  }, [savedAddress]);

  useEffect(() => {
    console.log(
      "city address and block",
      city?.name,
      block?.name,
      governorate?.name,
    );
  }, []);
  return (
    <>
      <KeyboardAvoidingView
        style={{  }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{justifyContent : 'space-between'}}>
          <View style={{ gap: 30 }}>
            <View style={{ gap: 50 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "grey",
                  paddingBottom: 20,
                }}
              >
                <View style={{ gap: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{width : 15,height :15}}
                      source={require("../../assets/images/icons/locationpinblack.png")}
                    />
                    <Text
                      style={{
                        fontFamily: "Lato-SemiBold",
                        fontSize: 20,
                        color: "#000",
                      }}
                    >
                      {governorate?.name}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 15,
                        color: "#000",
                      }}
                    >
                      {city?.name} , Block {block?.name}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => {toggleSheet(),onChangeLocation()}}>
                  <View
                    style={{
                      width: 70,
                      height: 30,
                      borderColor: "#000",
                      borderRadius: 8,
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Medium",
                        fontSize: 14,
                        color: "#000",
                      }}
                    >
                      Change
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ gap: 15 }}>
              <Input
                value={defaultAddress?.street}
                onChangeText={(value) => handleChange(value, "street")}
                placeholder="Street"
              />
              <Input
                value={defaultAddress?.phone}
                onChangeText={(value) => handleChange(value, "phone")}
                placeholder="Phone"
              />
              <Input
                onChangeText={(value) => handleChange(value, "building")}
                value={defaultAddress?.building}
                multiline={true}
                numberOfLines={5}
                placeholder="Flat / House no / Building name *"
              />
            </View>

            <View>
              <View>
                <Text style={[Typography.titleMedium, { color: "#000" }]}>
                  Save As
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={styles.buttonView}>
                  <TouchableOpacity onPress={() => setAddressType("Home")}>
                    <Text style={styles.buttonText}>Home</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                  <TouchableOpacity onPress={() => setAddressType("Work")}>
                    <Text style={styles.buttonText}>Work</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                  <TouchableOpacity onPress={() => setAddressType("Other")}>
                    <Text style={styles.buttonText}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Button
                variant=""
                text={"#fff"}
                color={"rgba(30, 18, 61, 1)"}
                title="Save Address"
                onPress={() => {
                  onSaveAddress();
                }}
              />
            )}
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
{/* 
      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        <Animated.View
          style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20 }}
        >
          <Text>Choose governorate</Text>
          <DropdownMenu
            visible={govVisible}
            handleOpen={() => setGovVisible(true)}
            handleClose={() => setGovVisible(false)}
            trigger={
              <View style={styles.triggerStyle}>
                <Text style={styles.triggerText}>
                  {governorate ? governorate?.name : "Select Governerate"}
                </Text>
                <Image
                  source={require("../../assets/images/icons/dropicon.png")}
                />
              </View>
            }
          >
            {governorates.map((block: any, index) => {
              return (
                <MenuOption
                  key={index}
                  onSelect={() => {
                    setGovernorate(block);
                    setCity(null);
                    setBlock(null);
                  }}
                >
                  <Text>{block?.name}</Text>
                </MenuOption>
              );
            })}
          </DropdownMenu>

          <Text>Choose city</Text>

          <DropdownMenu
            visible={cityVisible}
            handleOpen={() => setCityVisible(true)}
            handleClose={() => setCityVisible(false)}
            trigger={
              <View style={styles.triggerStyle}>
                <Text style={styles.triggerText}>
                  {city ? city?.name : "Select City"}
                </Text>
                <Image
                  source={require("../../assets/images/icons/dropicon.png")}
                />
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
                      setBlock(null);
                    }}
                  >
                    <Text>{city?.name}</Text>
                  </MenuOption>
                );
              })}
            </ScrollView>
          </DropdownMenu>

          <Text>Choose city</Text>

          <DropdownMenu
            visible={blockVisible}
            handleOpen={() => setBlockVisible(true)}
            handleClose={() => setBlockVisible(false)}
            trigger={
              <View style={styles.triggerStyle}>
                <Text style={styles.triggerText}>
                  {block ? block.name : "Select Block"}
                </Text>
                <Image
                  source={require("../../assets/images/icons/dropicon.png")}
                />
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
                    <Text>{block?.name}</Text>
                  </MenuOption>
                );
              })}
            </ScrollView>
          </DropdownMenu>

          <Button
            variant="non"
            color={"#1E123D"}
            title="Continue"
            onPress={() => {
              isOpen.value = false;
            }}
          />
        </Animated.View>
      </LocationBottomSheet> */}
    </>
  );
};

export default UserDeliveryAddressDropDown;

const styles = StyleSheet.create({
  buttonView: {
    width: 78,
    height: 32,
    borderRadius: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
  },
  triggerStyle: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
  },
  triggerText: {
    fontSize: 16,
  },
  buttonText: {
    color: "#000",
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    height: 250,
  },
  buttonContainer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  toggleButton: {
    backgroundColor: "#b58df1",
    padding: 12,
    borderRadius: 48,
  },
  toggleButtonText: {
    color: "white",
    padding: 1,
  },
  safeArea: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bottomSheetButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 2,
  },
  bottomSheetButtonText: {
    fontWeight: 600,
    textDecorationLine: "underline",
  },
});
