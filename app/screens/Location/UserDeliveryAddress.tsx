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
import { Typography } from "../../constants/typography";
import { useSelector } from "react-redux";
import Animated, { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import DropdownMenu from "../../components/DropDown/DropDownMenu";
import MenuOption from "../../components/DropDown/MenuOption";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useUserAddress } from "../../hooks/useSaveUserAddress";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { AddressRequest } from "../../types/requests/addressRequest";
import { StatusBar } from "expo-status-bar";
import LocationDisplay from "../../components/Location/LocationDisplay";

type UserDeliveryAddressScreenProps = StackScreenProps<
  RootStackParamList,
  "UserDeliveryAddress"
>;

const UserDeliveryAddress = ({
  navigation,
}: UserDeliveryAddressScreenProps) => {
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const { saveAddress, loading } = useUserAddress();
  const isOpen = useSharedValue(false);

  const [savedAddress, setSavedAddress] = useState<AddressRequest>({
    type: "HOME",
    street: "",
    apartmentNumber: "",
    contactPhone: "",
  });

  const handleChange = (text: string, field: keyof AddressRequest) => {
    setSavedAddress((prev) => ({
      ...prev,
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
    console.log('settted ',governorate)
  })

  const onSaveAddress = () => {
    if (!savedAddress.type) {
      Alert.alert("Error", "Please select an address type");
      return;
    }

    saveAddress({
      payload: {
        ...savedAddress,
        userId,
      } as AddressRequest,
      onSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "DrawerNavigation" }],
        });
      },
      onError: (error) => {
        Alert.alert("Error", error || "Failed to save address");
      },
    });
  };

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

                   <TouchableOpacity onPress={() => {navigation.goBack()}}>
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
                </TouchableOpacity>

                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "grey",
                    paddingBottom: 20,
                  }}
                >
                  <LocationDisplay
                    governorate={governorate}
                    city={city}
                    block={block}
                    showChangeButton={true}
                    onChangePress={toggleSheet}
                    textColor="#FFFFFF"
                  />
                </View>
              </View>

              <View style={{ gap: 15 }}>
                <Input
                  onChangeText={(value) => handleChange(value, "street")}
                  variant="dark"
                  placeholder="Street"
                  value={savedAddress.street || ""}
                />
                <Input
                  onChangeText={(value) => handleChange(value, "apartmentNumber")}
                  variant="dark"
                  placeholder="Apartment / Flat number"
                  keyboardType="numeric"
                  value={savedAddress.apartmentNumber || ""}
                />
                <Input
                  onChangeText={(value) => handleChange(value, "contactPhone")}
                  variant="dark"
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  value={savedAddress.contactPhone || ""}
                />
              </View>

              <View>
                <View>
                  <Text style={[Typography.titleMedium, { color: "white" }]}>
                    Save As
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={[
                    styles.buttonView,
                    savedAddress.type === "HOME" && styles.buttonViewActive
                  ]}>
                    <TouchableOpacity 
                      style={{flexDirection : 'row',gap :5,alignItems : 'center'}} 
                      onPress={() => handleChange("HOME", "type")}
                    >
                       <Image style={{width : 13,height : 13}} source={require('../../assets/images/icons/homeltst.png')}/>
                      <Text style={styles.buttonText}>Home</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[
                    styles.buttonView,
                    savedAddress.type === "WORK" && styles.buttonViewActive
                  ]}>
                    <TouchableOpacity 
                      style={{flexDirection : 'row',gap :5}} 
                      onPress={() => handleChange("WORK", "type")}
                    >
                      <Image style={{width : 13,height : 13}} source={require('../../assets/images/icons/briefcase.png')}/>
                      <Text style={styles.buttonText}>Work</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[
                    styles.buttonView,
                    savedAddress.type === "OTHER" && styles.buttonViewActive
                  ]}>
                    <TouchableOpacity 
                      onPress={() => handleChange("OTHER", "type")}
                    >
                      <Text style={styles.buttonText}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>

          <View style={{ marginVertical: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <Button
                variant="decorate"
                text={"black"}
                color={"white"}
                title="Save Address"
                onPress={onSaveAddress}
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
  buttonViewActive: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 2,
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
    fontFamily : 'Lato-Regular',
    fontSize : 13
  },
});
