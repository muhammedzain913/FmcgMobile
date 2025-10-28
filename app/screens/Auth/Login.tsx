import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../components/Input/Input";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Button from "../../components/Button/Button";
import SocialBtn from "../../components/Socials/SocialBtn";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { loginUser } from "../../redux/reducer/userReducer";
import { useDispatch } from "react-redux";

type LoginScreenProps = StackScreenProps<RootStackParamList, "Login">;

const Login = ({ navigation }: LoginScreenProps) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    console.log("handler");
    const { email, password } = loginData;
    if (!email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      dispatch(loginUser(loginData));
        navigation.navigate("DrawerNavigation", { screen: "Home" })
    } catch (error: any) {
      console.log(error.message);
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
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
          <View
            style={{
              height: undefined,
              width: "100%",
              aspectRatio: 1 / 0.5,
              backgroundColor: COLORS.secondary,
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          >
            <View style={{ marginTop: -30, marginLeft: 5 }}>
              <Text
                style={[
                  FONTS.fontJostExtraLight,
                  { fontSize: 105, color: "rgba(255,255,255,0.50)" },
                ]}
              >
                SHOES
              </Text>
              <Text
                style={[
                  FONTS.fontBold,
                  {
                    fontSize: 100,
                    color: "rgba(255,255,255,0.50)",
                    marginTop: Platform.OS === "android" ? -40 : -60,
                  },
                ]}
              >
                SHOES
              </Text>
            </View>
            <View
              style={{ position: "absolute", top: 10, left: 10, zIndex: 15 }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[
                  GlobalStyleSheet.backbtn,
                  {
                    backgroundColor: theme.dark ? COLORS.primary : colors.card,
                  },
                ]}
              >
                <Ionicons size={24} color={colors.title} name="chevron-back" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                left: Platform.OS === "android" ? 60 : 30,
                top: Platform.OS === "android" ? -50 : 0,
              }}
            >
              <Image
                style={{
                  height: Platform.OS === "android" ? "180%" : "130%",
                  aspectRatio: 1 / 1,
                  resizeMode: "contain",
                }}
                source={IMAGES.item1}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={[GlobalStyleSheet.container, { paddingHorizontal: 20 }]}
            >
              <View style={{ marginTop: 60 }}>
                <Text
                  style={[
                    FONTS.fontMedium,
                    { fontSize: 24, color: colors.title },
                  ]}
                >
                  Sign In To Your Account
                </Text>
                <Text
                  style={[
                    FONTS.fontRegular,
                    { fontSize: 15, color: colors.title },
                  ]}
                >
                  Welcome Back You've Been Missed!
                </Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <View>
                  <Input
                    backround
                    inputLg
                    placeholder="Email Address"
                    onChangeText={(value) => handleInputChange("email", value)}
                    icon={
                      <Feather
                        style={{}}
                        name={"mail"}
                        size={20}
                        color={colors.title}
                      />
                    }
                  />
                </View>
                <View style={{ marginTop: 15 }}>
                  <Input
                    backround
                    inputLg
                    type={"password"}
                    placeholder="Password"
                    onChangeText={(value) =>
                      handleInputChange("password", value)
                    }
                    icon={
                      <Feather
                        style={{}}
                        name={"lock"}
                        size={20}
                        color={colors.title}
                      />
                    }
                  />
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPassword")}
                  >
                    <Text
                      style={[
                        FONTS.fontRegular,
                        {
                          fontSize: 15,
                          color: colors.title,
                          textDecorationLine: "underline",
                          textAlign: "right",
                          marginTop: 5,
                        },
                      ]}
                    >
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginTop: 20, marginBottom: 20 }}>
                <Button
                  title="Sign In"
                  color={theme.dark ? COLORS.white : COLORS.primary}
                  text={theme.dark ? COLORS.primary : COLORS.white}
                  onPress={handleLogin}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <View
                  style={{
                    height: 1,
                    flex: 1,
                    backgroundColor: colors.title,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.fontMedium,
                    color: colors.title,
                    marginHorizontal: 15,
                    fontSize: 13,
                  }}
                >
                  Or continue with
                </Text>
                <View
                  style={{
                    height: 1,
                    flex: 1,
                    backgroundColor: colors.title,
                  }}
                />
              </View>
              <View style={GlobalStyleSheet.row}>
                <View style={[GlobalStyleSheet.col50, { marginBottom: 20 }]}>
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
                    //gap
                  />
                </View>
                <View style={[GlobalStyleSheet.col50, { marginBottom: 20 }]}>
                  <SocialBtn
                    icon={
                      <FontAwesome
                        name="apple"
                        size={20}
                        color={colors.title}
                      />
                    }
                    color={colors.card}
                    rounded
                    text="Apple"
                    //gap
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            position: "absolute",
            width: "100%",
            left: 0,
            right: 0,
            bottom: 10,
          }}
        >
          <Text
            style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title }}
          >
            Not a member?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text
              style={{
                ...FONTS.fontMedium,
                // borderBottomWidth: 1,
                // borderBottomColor: colors.title,
                color: colors.title,
                textDecorationLine: "underline",
              }}
            >
              {" "}
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;
