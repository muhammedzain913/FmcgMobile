import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import Input from "../../components/Input/Input";
import { FontAwesome } from "@expo/vector-icons";
import Button from "../../components/Button/Button";
import SocialBtn from "../../components/Socials/SocialBtn";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import Checkbox from "expo-checkbox";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/reducer/userReducer";
import { AppDispatch } from "../../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";

type RegisterScreenProps = StackScreenProps<RootStackParamList, "Register">;

const Register = ({ navigation }: RegisterScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { colors }: { colors: any } = theme;
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleInputChange = (name: string, value: any) => {
    console.log("field", name);
    console.log("value", value);
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const [isChecked, setChecked] = useState(false);

  async function onSubmit() {
    const { name, email, password } = registerData;
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const response = await dispatch(registerUser(registerData));
      const result = unwrapResult(response);
      console.log("Registration successful:", result);
      // navigation.navigate("UserLocation");
    } catch (error: any) {
      Alert.alert("Registration Error", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ backgroundColor: " #1E123D", flex: 1 }}>
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#1E123D" }}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={[GlobalStyleSheet.container, { padding: 0,backgroundColor:'#1E123D' }]}> */}
        <ImageBackground
          imageStyle={{ opacity: 0.1, transform: [{ scale: 2 }] }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            backgroundColor: "#1E123D",
            paddingBottom: 30,
          }}
          resizeMode="cover"
          source={require("../../assets/images/bg.png")}
        >
          <View
            style={{
              width: 65,
              height: 28,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              flex: 1,
              borderRadius: 61,
              backgroundColor: "rgba(43, 66, 72, 0.5)",
              alignSelf: "flex-end",
              position: "absolute",
              right: 20,
              top: 30,
            }}
          >
            <TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Lato-SemiBold",
                  fontSize: 15,
                  lineHeight: 15,
                  letterSpacing: -0.45,
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Image
              resizeMode="contain"
              style={{ width: "70%", height: undefined, aspectRatio: 1 }}
              source={require("../../assets/images/brand/sooper.png")}
            />
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Lato-Bold", // or "Lato" if weight mapping is used
                fontSize: 24,
                lineHeight: 32,
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Get Started
            </Text>
            <Text
              style={{
                fontFamily: "Lato-Regular", // or "Lato" + fontWeight
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: -0.3, // ✅ converted from -2%
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Log In using Phone, Google or Apple ID
            </Text>
          </View>
        </ImageBackground>

        <View
          style={{
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
            backgroundColor: "white",
            paddingTop: 28,
            paddingHorizontal: 16,
            rowGap: 8,
          }}
        >
          <Input
            placeholder="Name"
            onChangeText={(text: string) => {
              handleInputChange("name", text);
            }}
  
          />

          <View>
            <Input
              placeholder="Email Address"
              onChangeText={(text: string) => {
                handleInputChange("email", text);
              }}

            />
          </View>

          <View>
            <Input
              type={"password"}
              placeholder="Password"
              onChangeText={(value) => handleInputChange("password", value)}
              
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 10,
              }}
            >
              <Checkbox
                //style={{}}
                value={isChecked}
                onValueChange={setChecked}
                color={
                  isChecked
                    ? theme.dark
                      ? COLORS.primary
                      : colors.title
                    : undefined
                }
              />
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 15,
                  color: colors.title,
                  textAlign: "left",
                }}
              >
                {" "}
                I agree to all Term, Privacy and Fees
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Button
                variant="decorate"
                title="Sign Up"
                color={"#1E123D"}
                // text={theme.dark ? COLORS.primary : COLORS.white}
                onPress={onSubmit}
              />
            )}
          </View>
        
          <Text
            style={{
              fontFamily: "Lato-Medium",
              fontSize: 13,
              lineHeight: 13,
              letterSpacing: -0.39,
              color: "#545454",
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            OR
          </Text>

          <View style={{ gap: 15 }}>
            <View>
              <SocialBtn
                icon={
                  <Image
                    style={{ height: 20, width: 20, resizeMode: "contain" }}
                    source={IMAGES.google2}
                  />
                }
                color={colors.card}
                rounded
                text="Continue with Google"
                //gap
              />
            </View>
            <View>
              <SocialBtn
                icon={
                  <FontAwesome name="apple" size={20} color={colors.title} />
                }
                color={colors.card}
                rounded
                text="Continue with Apple"
                //gap
              />
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
              }}
            >
              Already have and account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  ...FONTS.fontMedium,
                  // borderBottomWidth: 1,
                  // borderBottomColor: colors.title,
                  color: colors.title,
                  textDecorationLine: "underline",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
