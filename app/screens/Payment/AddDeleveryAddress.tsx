import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import { saveDefaultAddress } from "../../redux/reducer/userReducer";

type AddDeleveryAddressScreenProps = StackScreenProps<
  RootStackParamList,
  "AddDeleveryAddress"
>;

const AddDeleveryAddress = ({ navigation }: AddDeleveryAddressScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const productSizes = ["Home", "Shop", "Office"];

  const [activeSize, setActiveSize] = useState(productSizes[0]);
  const dispatch = useDispatch();

  const userInfo = useSelector((x) => x?.user?.userInfo);

  useEffect(() => {
    console.log("address enail", userInfo);
  });

  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>({
    userId: userInfo.id,
    firstName: "",
    lastName: "",
    email: userInfo.email,
    phone: "",
    pinCode: "",
    streetAddress: "",
    city: "",
    state: "",
    district: "",
    country: "Kuwait",
    label: "Home",
  } as SavedAddress);

  const [inputValue, setInputValue] = useState("");

  const handleChange = (text: string, field: keyof SavedAddress) => {
    setSavedAddress((prev) => ({
      ...(prev as SavedAddress),
      [field]: text,
    }));
  };

  const [inputValue1, setInputValue1] = useState("");

  const handleChange1 = (text: any) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setInputValue1(numericValue);
  };
  const address = useSelector((x) => x?.user?.defaultAddress);

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Add Delivery Address" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={GlobalStyleSheet.container}>
          <Text
            style={{ ...FONTS.fontSemiBold, fontSize: 16, color: colors.title }}
          >
            Contact Details
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
              First Name
            </Text>
            <Input
              value={savedAddress?.firstName}
              onChangeText={(value) => handleChange(value, "firstName")}
              backround
            />
          </View>
          <View style={{ marginBottom: 15, marginTop: 10 }}>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
                marginBottom: 5,
              }}
            >
              Last Name
            </Text>
            <Input
              value={savedAddress?.lastName}
              onChangeText={(value) => handleChange(value, "lastName")}
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
              Mobile No.
            </Text>
            <Input
              value={savedAddress?.phone}
              onChangeText={(value) => handleChange(value, "phone")}
              keyboardType={"number-pad"}
              backround
            />
          </View>
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
              Pin Code
            </Text>
            <Input
              value={savedAddress?.pinCode}
              onChangeText={(value) => handleChange(value, "pinCode")}
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
              Address
            </Text>
            <Input
              value={savedAddress?.streetAddress}
              onChangeText={(value) => handleChange(value, "streetAddress")}
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
              City
            </Text>
            <Input
              onChangeText={(value) => handleChange(value, "city")}
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
              District
            </Text>
            <Input
              onChangeText={(value) => handleChange(value, 'district')}
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
              State
            </Text>
            <Input
              onChangeText={(value) => handleChange(value, "state")}
              backround
            />
          </View>
          <Text
            style={{ ...FONTS.fontSemiBold, fontSize: 16, color: colors.title }}
          >
            Save Address As
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            {productSizes.map((data, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setActiveSize(data);
                    setSavedAddress((prev) => ({
                      ...(prev as SavedAddress),
                      label: data as SavedAddress["label"],
                    }));
                  }}
                  key={index}
                  style={[
                    {
                      height: 40,
                      width: 75,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      // borderWidth: 1,
                      // borderColor: theme.dark ? COLORS.white : colors.borderColor,
                      marginHorizontal: 4,
                      backgroundColor: theme.dark
                        ? "rgba(255,255,255,0.10)"
                        : colors.background,
                    },
                    activeSize === data && {
                      backgroundColor: colors.title,
                      borderColor: COLORS.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        ...FONTS.fontMedium,
                        fontSize: 13,
                        color: colors.title,
                      },
                      activeSize === data && {
                        color: theme.dark ? COLORS.title : colors.card,
                      },
                    ]}
                  >
                    {data}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          GlobalStyleSheet.container,
          { paddingHorizontal: 0, paddingBottom: 0 },
        ]}
      >
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
            title="Save Address"
            color={theme.dark ? COLORS.white : COLORS.primary}
            text={theme.dark ? COLORS.primary : COLORS.white}
            onPress={() => {
              dispatch(saveDefaultAddress(savedAddress));
              navigation.navigate("DeleveryAddress");
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AddDeleveryAddress;
