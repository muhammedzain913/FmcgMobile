import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Header from "../../layout/Header";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS, FONTS } from "../../constants/theme";
import Input from "../../components/Input/Input";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import Button from "../../components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { SavedAddress } from "../../types/savedAddress";
import { useDispatch, useSelector } from "react-redux";
import {
  saveDefaultAddress,
  saveUserLocation,
} from "../../redux/reducer/userReducer";
import { LocationRequest } from "../../types/requests/locationRequest";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "../../redux/store";

type AddDeleveryAddressScreenProps = StackScreenProps<
  RootStackParamList,
  "AddDeleveryAddress"
>;

const AddDeleveryAddress = ({ navigation }: AddDeleveryAddressScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const productSizes = ["Home", "Shop", "Office"];

  const [activeSize, setActiveSize] = useState(productSizes[0]);
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((x: any) => x?.user);
  const [loading, setLoading] = useState(false);

  const userInfo = user.userInfo;

  const location = user.defaultAddress;

  const [savedAddress, setSavedAddress] = useState<LocationRequest>({
    userId: location.userId,
    governorate: location.governorate,
    street: "",
    block: location.block,
    city: location.city,
    phone: "",
    building: "",
    country: location.country,
  });

  const handleChange = (text: string, field: keyof LocationRequest) => {
    setSavedAddress((prev) => ({
      ...(prev as LocationRequest),
      [field]: text,
    }));
  };

  const navigateToNextScreen = async () => {
    setLoading(true);
    try {
      const response = await dispatch(saveUserLocation(savedAddress));
      const result = unwrapResult(response);
      console.log("Location saved successfully:", result);
      navigation.navigate("DeleveryAddress");
    } catch (error) {
      console.log("Error registering user:", error);
      Alert.alert(
        "Registration Error",
        "Failed to register user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Add Delivery Address" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={GlobalStyleSheet.container}>
          <Text
            style={{ ...FONTS.fontSemiBold, fontSize: 16, color: colors.title }}
          >
            Address
          </Text>
          <View style={{ marginBottom: 15, marginTop: 10 }}>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
                marginBottom: 5,
              }}
            >
              Phone
            </Text>
            <Input
              value={savedAddress?.phone}
              onChangeText={(value) => handleChange(value, "phone")}
              keyboardType={"number-pad"}
              backround
            />
          </View>
          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
                marginBottom: 5,
              }}
            >
              Street
            </Text>
            <Input
              value={savedAddress?.street}
              onChangeText={(value) => handleChange(value, "street")}
              backround
            />
          </View>
          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
                marginBottom: 5,
              }}
            >
              Flat / House no / Building name *
            </Text>
            <Input
              value={savedAddress?.building}
              onChangeText={(value) => handleChange(value, "building")}
              backround
            />
          </View>
        </View>
      </ScrollView>
      {/* <View
        style={[
          GlobalStyleSheet.container,
          { paddingHorizontal: 0, paddingBottom: 0 },
        ]}
      >
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <Button
              title="Save Delivery Address"
              color={theme.dark ? COLORS.white : COLORS.primary}
              text={theme.dark ? COLORS.primary : COLORS.white}
              onPress={navigateToNextScreen}
            />
          )}
        </View>
      </View> */}

      <View
        style={{
          height: 88,
          width: "100%",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          justifyContent: "center",
          paddingHorizontal: 15,
        }}
      >
        <Button
          title="Proceed"
          color={colors.title}
          text={theme.dark ? COLORS.primary : COLORS.white}
          onPress={navigateToNextScreen}
        />
      </View>
    </View>
  );
};

export default AddDeleveryAddress;
