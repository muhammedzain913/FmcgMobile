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

type UserDeliveryAddressScreenProps = StackScreenProps<
  RootStackParamList,
  "UserDeliveryAddress"
>;

const UserDeliveryAddress = ({
  navigation,
}: UserDeliveryAddressScreenProps) => {
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
        navigation.reset({
          index: 0,
          routes: [{ name: "DrawerNavigation" }],
        });
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
        style={{ flex: 1, backgroundColor: "#1E123D" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            imageStyle={{ opacity: 0.1 }}
            style={{
              flex: 1,
            }}
            resizeMode="cover"
            source={require("../../assets/images/bg.png")}
          >
            <View style={{ gap: 30 }}>
              <View style={{ gap: 50 }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#F0F0F0",
                    borderRadius: 8,
                    borderWidth: 1,
                    width: 36,
                    height: 36,
                  }}
                >
                  <Image
                    source={require("../../assets/images/icons/wbackbtn.png")}
                  />
                </View>

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
                        source={require("../../assets/images/icons/locationaddress.png")}
                      />
                      <Text
                        style={{
                          fontFamily: "Lato-SemiBold",
                          fontSize: 20,
                          color: "#FFFFFF",
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
                          color: "#FFFFFF",
                        }}
                      >
                        {city?.name} , Block {block?.name}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={toggleSheet}>
                    <View
                      style={{
                        width: 70,
                        height: 30,
                        borderColor: "#F0F0F0",
                        borderRadius: 8,
                        borderWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lato-Medium",
                          fontWeight: 600,
                          fontStyle: "normal",
                          fontSize: 12,
                          color: "#FFFFFF",
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
                  onChangeText={(value) => handleChange(value, "street")}
                  variant="dark"
                  placeholder="Street"
                />
                <Input
                  onChangeText={(value) => handleChange(value, "phone")}
                  variant="dark"
                  placeholder="Phone"
                />
                <Input
                  onChangeText={(value) => handleChange(value, "building")}
                  multiline={true}
                  numberOfLines={5}
                  variant="dark"
                  placeholder="Flat / House no / Building name *"
                />
                {/* <Input
                multiline={true}
                numberOfLines={5}
                variant="dark"
                placeholder="Directions to reach"
              /> */}
              </View>

              <View>
                <View>
                  <Text style={[Typography.titleMedium, { color: "white" }]}>
                    Save As
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={styles.buttonView}>
                    <TouchableOpacity style={{flexDirection : 'row',gap :5}} onPress={() => setAddressType("Home")}>
                       <Image source={require('../../assets/images/icons/House.png')}/>
                      <Text style={styles.buttonText}>Home</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonView}>
                    <TouchableOpacity style={{flexDirection : 'row',gap :5}} onPress={() => setAddressType("Work")}>
                      <Image source={require('../../assets/images/icons/ToteSimple.png')}/>
                      <Text style={{ color: "#FFFFFF" }}>Work</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonView}>
                    <TouchableOpacity onPress={() => setAddressType("Other")}>
                      <Text style={{ color: "#FFFFFF" }}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>

          <View style={{ marginVertical: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Button
                variant="decorate"
                text={"black"}
                color={"white"}
                title="Save Address"
                onPress={() => {
                  onSaveAddress();
                }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        <ScrollView contentContainerStyle={{ paddingBottom: 400 }}>
          <Animated.View
            style={{ flex: 1, paddingVertical: 60, paddingHorizontal: 20 }}
          >
            <Text style={[Typography.titleMedium]}>CHOOSE GOVERNORATE</Text>
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

            <Text style={[Typography.titleMedium]}>CHOOSE CITY</Text>

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

            <Text style={[Typography.titleMedium]}>CHOOSE BLOCK</Text>

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
          </Animated.View>
        </ScrollView>
        <Animated.View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Button
            variant="non"
            color={"#1E123D"}
            title="Continue"
            onPress={() => {
              isOpen.value = false;
            }}
          />
        </Animated.View>
      </LocationBottomSheet>
    </>
  );
};

export default UserDeliveryAddress;

const styles = StyleSheet.create({
  buttonView: {
    width: 78,
    height: 32,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FFFFFF",
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
    fontFamily: "Lato-Regular",
    fontSize: 16,
  },
  buttonText: {
    color: "#FFFFFF",
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
