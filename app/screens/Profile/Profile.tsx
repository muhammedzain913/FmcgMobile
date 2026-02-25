import {
  CommonActions,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SectionList,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducer/userReducer";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import iconSet from "@expo/vector-icons/build/Fontisto";

type ProfileScreenProps = StackScreenProps<RootStackParamList, "Profile">;

const Profile = ({ navigation }: ProfileScreenProps) => {
  const user = useSelector((x: any) => x.user.userInfo);
  const address = useSelector((x: any) => x.user.defaultAddress);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const MENU = [
    { label: "My Orders", icon: IMAGES.myordersprofile },
    { label: "Saved Addresses", icon: IMAGES.bookmark },
    { label: "My Cart", icon: IMAGES.mycart },
    { label: "FAQ", icon: IMAGES.Chat },
    { label: "Help", icon: IMAGES.information },
    { label: "Support", icon: IMAGES.support },
    { label: "Log Out", icon: IMAGES.logout },
  ];

  //const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              dispatch(logout());
              setLoading(false);
            }, 5000);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleMenuPress = (label: string) => {
    switch (label) {
      case "My Orders":
        navigation.navigate("Myorder");
        break;
      case "My Cart":
        navigation.navigate("MyCart");
        break;
      case "Saved Addresses":
        navigation.navigate("SavedAddresses");
        break;
      case "Log Out":
        handleLogout();
        break;
      // Add more cases for other menu items as needed
      default:
        // Handle other menu items or do nothing
        break;
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.card,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text
          style={{
            ...FONTS.fontMedium,
            fontSize: 16,
            color: colors.title,
            marginTop: 10,
          }}
        >
          Logging out...
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ backgroundColor: "#FAFAFA", flex: 1 }}>
      <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
      <ScrollView
        contentContainerStyle={{ gap: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            // Button Linear Gradient
            colors={["rgba(30, 18, 61, 1)", "rgba(12, 0, 40, 1)"]}
          >
            <ImageBackground
              style={{ flex: 1, padding: 20 }}
              source={require("../../assets/images/maskgroup.png")}
            >
              {/* HEADER – TOP ROW */}
              <View style={{ justifyContent: "space-between", gap: 50 }}>
                <View style={styles.headerTopRow}>
                  {/* Back Button */}
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                  </TouchableOpacity>

                  {/* Title */}
                  <Text style={styles.headerTitle}>My Account</Text>

                  {/* Options */}
                  <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* HEADER – PROFILE ROW */}
                <View style={styles.profileRow}>
                  {/* Profile Image */}
                  <Image
                    source={require("../../assets/images/profilepic.jpg")}
                    style={styles.profileImage}
                  />

                  {/* Name & Phone */}
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {user?.name || "John Mathew"}
                    </Text>
                    <Text style={styles.profilePhone}>
                      {user?.phone || "+91 0987654321"}
                    </Text>
                  </View>

                  {/* Edit Profile */}
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <LinearGradient
                // Button Linear Gradient
                colors={["rgba(255, 255, 255, 1)", "rgba(184, 184, 184, 1)"]}
              ></LinearGradient>

              <LinearGradient
                colors={["rgba(255,255,255,1)", "rgba(184,184,184,1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                // style={styles.gradientBorder}
              ></LinearGradient>
            </ImageBackground>
          </LinearGradient>
        </View>

        <View style={styles.menuContainer}>
          {MENU.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.label)}
            >
              <View style={styles.menuLeft}>
                <Image
                  style={{ width: 20, height: 20, tintColor: "#000" }}
                  source={item?.icon}
                />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              {index !== MENU.length - 1 && (
                <Ionicons name="chevron-forward" size={18} color="#1E123D" />
              )}
            </TouchableOpacity>
          ))}

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.brand}>sooper</Text>
            <Text style={styles.version}>Version 4.54</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 500,
    backgroundColor: "#1E123D",
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1E123D",
    opacity: 0.85, // tweak: 0.8–0.9 for best match
  },

  content: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(255,255,255,0.35)",
    marginHorizontal: 12,
  },
  containerW: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
  gradientBorder: {
    borderRadius: 8,
    padding: 1, // border thickness = 1px
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 6, // Android shadow
  },

  searchBoxCotainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 8,
    backgroundColor: "rgba(44, 33, 71, 1)",
  },

  icon: {
    width: 18,
    height: 18,
    tintColor: "#FFFFFF",
  },

  searchBoxDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  placeholder: {
    fontFamily: "Lato",
    fontSize: 15,
    color: "#FFFFFF",
  },

  highlight: {
    color: "#FFC107", // yellow "Snacks"
    fontWeight: "600",
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontFamily: "Lato",
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },

  profileInfo: {
    flex: 1,
    gap: 4,
  },

  profileName: {
    fontFamily: "Lato",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  profilePhone: {
    fontFamily: "Lato",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },

  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },

  editBtnText: {
    fontFamily: "Lato",
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
    gap: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  menuText: {
    fontSize: 15,
    fontFamily: "Lato-SemiBold",
    fontWeight: "500",
    color: "#1F1F1F",
  },

  footer: {
    marginTop: 40,
    alignItems: "center",
  },

  brand: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(0,0,0,0.2)",
  },

  version: {
    fontSize: 12,
    color: "rgba(0,0,0,0.35)",
    marginTop: 4,
  },
});
