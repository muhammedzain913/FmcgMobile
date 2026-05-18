import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducer/userReducer";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

type ProfileScreenProps = StackScreenProps<RootStackParamList, "Profile">;

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  iconColor?: string;
};

const MENU: MenuItem[] = [
  { label: "My Orders", icon: "receipt-outline", route: "Myorder" },
  { label: "Saved Addresses", icon: "location-outline", route: "SavedAddresses" },
  { label: "My Cart", icon: "cart-outline", route: "MyCart" },
  { label: "FAQ", icon: "help-circle-outline", route: "Questions" },
  { label: "Support", icon: "headset-outline", route: "Support" },
  { label: "Log Out", icon: "log-out-outline", route: "LogOut", iconColor: "#E53935" },
];

const Profile = ({ navigation }: ProfileScreenProps) => {
  const user = useSelector((x: any) => x.user.userInfo);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
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

  const handleMenuPress = (item: MenuItem) => {
    if (item.route === "LogOut") {
      handleLogout();
      return;
    }
    navigation.navigate(item.route as any);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.card }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginTop: 10 }}>
          Logging out...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#FAFAFA", flex: 1 }}>
      <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
      <ScrollView contentContainerStyle={{ gap: 30 }} showsVerticalScrollIndicator={false}>

        {/* HEADER BANNER */}
        <View style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: "hidden" }}>
          <LinearGradient colors={["rgba(30, 18, 61, 1)", "rgba(12, 0, 40, 1)"]}>
            <ImageBackground
              style={{ flex: 1, padding: 20, paddingTop: 16 }}
              source={require("../../assets/images/maskgroup.png")}
            >
              {/* TOP ROW – back button + title */}
              <View style={styles.headerTopRow}>
                <TouchableOpacity
                  style={styles.backBtn}
                  activeOpacity={0.75}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="chevron-back" size={20} color="#fff" />
                  <Text style={styles.backBtnText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>My Account</Text>

                {/* Invisible spacer to keep title centered */}
                <View style={{ width: 72 }} />
              </View>

              {/* PROFILE ROW */}
              <View style={styles.profileRow}>
                <View style={styles.profileImage}>
                  <Ionicons name="person" size={32} color="rgba(255,255,255,0.9)" />
                </View>

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {user?.name || "Guest User"}
                  </Text>
                  <Text style={styles.profilePhone}>
                    {user?.phone ? `+${user.phone}` : user?.email || "No contact info"}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </LinearGradient>
        </View>

        {/* MENU LIST */}
        <View style={styles.menuContainer}>
          {MENU.map((item, index) => {
            const isLogout = item.route === "LogOut";
            return (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, isLogout && styles.menuItemLogout]}
                activeOpacity={0.7}
                onPress={() => handleMenuPress(item)}
              >
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, isLogout && styles.menuIconWrapLogout]}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={isLogout ? "#E53935" : "#1E123D"}
                    />
                  </View>
                  <Text style={[styles.menuText, isLogout && styles.menuTextLogout]}>
                    {item.label}
                  </Text>
                </View>
                {!isLogout && (
                  <Ionicons name="chevron-forward" size={18} color="#1E123D" />
                )}
              </TouchableOpacity>
            );
          })}

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.brand}>sooper</Text>
            <Text style={styles.version}>Version 1.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    gap: 4,
  },

  backBtnText: {
    fontFamily: "Lato",
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
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
    paddingBottom: 20,
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    flex: 1,
    gap: 4,
  },

  profileName: {
    fontFamily: "Lato",
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  profilePhone: {
    fontFamily: "Lato",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },

  menuContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  menuItemLogout: {
    backgroundColor: "#FFF5F5",
    marginTop: 8,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(30,18,61,0.07)",
    justifyContent: "center",
    alignItems: "center",
  },

  menuIconWrapLogout: {
    backgroundColor: "rgba(229,57,53,0.1)",
  },

  menuText: {
    fontSize: 15,
    fontFamily: "Lato-SemiBold",
    fontWeight: "500",
    color: "#1F1F1F",
  },

  menuTextLogout: {
    color: "#E53935",
  },

  footer: {
    marginTop: 32,
    marginBottom: 24,
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
