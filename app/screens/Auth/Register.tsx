import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/theme";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/reducer/userReducer";
import { AppDispatch } from "../../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";

type RegisterScreenProps = StackScreenProps<RootStackParamList, "Register">;

const Register = ({ navigation }: RegisterScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
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
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", backgroundColor: "#1E123D" }}
    >
      <StatusBar backgroundColor="#1E123D" />
      <ImageBackground
        imageStyle={{ opacity: 0.1, transform: [{ scale: 2 }] }}
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          paddingBottom: 30,
        }}
        resizeMode="cover"
        source={require("../../assets/images/bg.png")}
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
              fontFamily: "Lato-Bold",
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
              fontWeight: "400",
              fontSize: 15,
              lineHeight: 22,
              letterSpacing: -0.3,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Create your account with email and password
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
          <View style={{ rowGap: 8 }}>
            <Input
              placeholder="Name"
              onChangeText={(text: string) => {
                handleInputChange("name", text);
              }}
            />
            <Input
              placeholder="Email Address"
              onChangeText={(text: string) => {
                handleInputChange("email", text);
              }}
            />
            <Input
              type={"password"}
              placeholder="Password"
              onChangeText={(value) => handleInputChange("password", value)}
            />
          </View>

          <View style={{ gap: 16 }}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Button
                variant="decorate"
                title="Sign Up"
                color={"#1E123D"}
                onPress={onSubmit}
              />
            )}

            <View>
              <Text style={styles.accountPrompt}>
                Already have an account?{" "}
                <Text
                  onPress={() => navigation.navigate("Login")}
                  style={styles.signInLink}
                >
                  Sign In
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

export default Register;

const styles = StyleSheet.create({
  accountPrompt: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#545454",
    textAlign: "center",
  },
  signInLink: {
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
