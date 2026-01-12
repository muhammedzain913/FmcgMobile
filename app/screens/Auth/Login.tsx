import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { loginUser } from "../../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import SocialBtn from "../../components/Socials/SocialBtn";
import { IMAGES } from "../../constants/Images";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants/theme";

type LoginScreenProps = StackScreenProps<RootStackParamList, "Login">;

const Login = ({ navigation }: LoginScreenProps) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    console.log("handler");
    const { email, password } = loginData;
    if (!email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const resultAction = await dispatch(loginUser(loginData));
      const userData = unwrapResult(resultAction);
      // navigation.navigate("DrawerNavigation", { screen: "Home" });
    } catch (error: any) {
      Alert.alert("Login Failed", error || "Something went wrong");
      console.log("this is the login error", error.message);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    console.log("field", name);
    console.log("value", value);
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", backgroundColor: "#1E123D" }}
    >
      <ImageBackground
        imageStyle={{ opacity: 0.2 }}
        style={{
          paddingBottom : 30,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
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

        <View style={{ justifyContent: "center", alignItems: "center", }}>
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
          onChangeText={(value) => handleInputChange("email", value)}
          placeholder="Email"
        />
        <Input
          onChangeText={(value) => handleInputChange("password", value)}
          placeholder="Password"
        />

        
        <View style={{ marginVertical: 10 }}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <Button color={"#1E123D"} title="Login" onPress={handleLogin} />
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
              icon={<FontAwesome name="apple" size={20} color={colors.title} />}
              color={colors.card}
              rounded
              text="Continue with Apple"
              //gap
            />
          </View>
        </View>

        <TouchableOpacity style={{justifyContent : 'center'}} onPress={() => navigation.navigate("Register")}>
          <Text
            style={{
              ...FONTS.fontMedium,
              // borderBottomWidth: 1,
              // borderBottomColor: colors.title,
              color: colors.title,
              textDecorationLine: "underline",
              textAlign : 'center'
            }}
          >
            Create an account
          </Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By Continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Use & Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  termsText: {
    fontFamily: "Lato-Regular", // or "Lato" + fontWeight
    fontSize: 11,
    lineHeight: 24,
    letterSpacing: 0,
    color: "#000000",
    textAlign: "center",
  },

  termsLink: {
    fontFamily: "Lato-SemiBold", // or "Lato" + fontWeight
    fontSize: 11,
    lineHeight: 24,
    letterSpacing: 0,
    color: "#000000",
    textDecorationLine: "underline",
  },
});
