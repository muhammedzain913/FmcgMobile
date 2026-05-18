import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { loginUser } from "../../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import SocialBtn from "../../components/Socials/SocialBtn";
import { IMAGES } from "../../constants/Images";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { StatusBar } from "expo-status-bar";

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
      <StatusBar backgroundColor="#1E123D" />
      <ImageBackground
        imageStyle={{ opacity: 0.1, transform: [{ scale: 2 }] }}
        style={{
          paddingBottom: 30,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
        resizeMode="cover"
        source={require("../../assets/images/imgbckgrnd.png")}
      >
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
              fontFamily: "Lato-Regular",
              fontWeight: "400", // Explicitly set to normal weight
              fontSize: 15,
              lineHeight: 22,
              letterSpacing: -0.3, // ✅ converted from -2%
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Log In using Email, Google or Apple ID
          </Text>
        </View>
      </ImageBackground>
      
      <KeyboardAvoidingView
        style={{
          borderTopRightRadius: 18,
          borderTopLeftRadius: 18,
          backgroundColor: "white",
          flexBasis: "60%",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 28,
            paddingHorizontal: 16,
            paddingBottom: 20,
            justifyContent: "space-between",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top: input fields */}
          <View style={{ rowGap: 8 }}>
            <Input
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="Email"
            />
            <Input
              onChangeText={(value) => handleInputChange("password", value)}
              placeholder="Password"
            />

            <TouchableOpacity
              style={{ alignSelf: "flex-end", marginTop: 4, marginBottom: 4 }}
              onPress={() => navigation.navigate("ForgotPassword")}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontFamily: "Lato-SemiBold",
                  fontSize: 14,
                  lineHeight: 20,
                  color: "#1E123D",
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer: login button + account prompt + terms */}
          <View style={{ gap: 16 }}>
            {/* Hidden: OR divider and social login — kept for future use */}
            <View style={{ display: "none" }}>
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

              <View style={{ gap: 30 }}>
                {/* Social login row */}
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 12,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <SocialBtn
                      icon={
                        <Image
                          style={{ height: 20, width: 20, resizeMode: "contain" }}
                          source={IMAGES.google2}
                        />
                      }
                      color={colors.card}
                      rounded
                      text="Google"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SocialBtn
                      icon={
                        <FontAwesome name="apple" size={20} color={colors.title} />
                      }
                      color={colors.card}
                      rounded
                      text="Apple ID"
                    />
                  </View>
                </View>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Button
                variant="decorate"
                color={"#1E123D"}
                title="Login"
                onPress={handleLogin}
              />
            )}

            <View>
              <Text style={styles.accountPrompt}>
                Don&apos;t have an account?{" "}
                <Text
                  onPress={() => navigation.navigate("Register")}
                  style={styles.createAccountLink}
                >
                  Create Account
                </Text>
              </Text>

              <Text style={styles.termsText}>
                By Continuing, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Use</Text>
                {" & "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  accountPrompt: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#545454",
    textAlign: "center",
  },

  createAccountLink: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    lineHeight: 22,
    color: "#1E123D",
  },

  termsText: {
    fontFamily: "Lato-Regular",
    fontWeight: "400",
    fontSize: 11,
    lineHeight: 18,
    letterSpacing: 0,
    color: "#545454",
    textAlign: "center",
    marginTop: 28,
  },

  termsLink: {
    fontFamily: "Lato-SemiBold",
    fontSize: 11,
    lineHeight: 18,
    letterSpacing: 0,
    color: "#1E123D",
    textDecorationLine: "underline",
  },
});
