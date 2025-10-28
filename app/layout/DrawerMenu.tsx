import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { IMAGES } from "../constants/Images";
import { COLORS, FONTS } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import ThemeBtn from "../components/ThemeBtn";
import { useSelector } from "react-redux";
import { store } from "../redux/store";

const MenuItems = [
  {
    icon: IMAGES.home,
    name: "Home",
    navigate: "BottomNavigation",
  },
  {
    icon: IMAGES.producta,
    name: "Products",
    navigate: "Products",
  },
  {
    icon: IMAGES.components,
    name: "Components",
    navigate: "Components",
  },
  {
    icon: IMAGES.star,
    name: "Featured",
    navigate: "Writereview",
  },
  {
    icon: IMAGES.heart2,
    name: "Wishlist",
    navigate: "Wishlist",
  },
  {
    icon: IMAGES.order,
    name: "My Orders",
    navigate: "Myorder",
  },
  {
    icon: IMAGES.shopping,
    name: "My Cart",
    navigate: "MyCart",
  },
  {
    icon: IMAGES.chat,
    name: "Chat List",
    navigate: "Chat",
  },
  {
    icon: IMAGES.user3,
    name: "Profile",
    navigate: "Profile",
  },
  // {
  //     icon: IMAGES.logout,
  //     name: "Logout",
  //     navigate: 'Login',
  // },
];

const DrawerMenu = ({ navigation }: any) => {
  const theme = useTheme();
  // const dispatch = useDispatch();

  const { colors }: { colors: any } = theme;

  const user = useSelector((x: any) => x.user.userInfo);
  const state = store.getState().user.userInfo.accessToken
  useEffect(() => {
    console.log("user", user);
    console.log("state", state);

  });

  const handleLogout = () => {

  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.dark ? COLORS.title : colors.card,
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingBottom: 20,
            paddingTop: 10,
            marginHorizontal: -15,
            paddingHorizontal: 15,
          }}
        >
          <Image
            source={IMAGES.small1}
            style={{
              height: 60,
              width: 60,
              borderRadius: 60,
              marginRight: 10,
            }}
          />
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={[
                FONTS.fontSemiBold,
                { color: colors.title, fontSize: 18 },
              ]}
            >
              {user.name}
            </Text>
            <Text
              style={[FONTS.fontRegular, { color: colors.title, fontSize: 15 }]}
            >
              {user.email}
            </Text>
          </View>
          <View style={{ position: "absolute", right: 10, top: 0 }}>
            <ThemeBtn />
          </View>
        </View>
        <View style={{ flex: 1, paddingVertical: 10 }}>
          {MenuItems.map((data, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  data.navigate === "Wishlist" ||
                  data.navigate === "MyCart" ||
                  data.navigate === "Profile"
                    ? navigation.navigate("BottomNavigation", {
                        screen: data.navigate,
                      })
                    : data.navigate && navigation.navigate(data.navigate);
                  navigation.closeDrawer();
                }}
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={data.icon}
                    style={{
                      height: 18,
                      width: 18,
                      tintColor: colors.text,
                      marginRight: 14,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={[
                      FONTS.font,
                      FONTS.fontMedium,
                      { color: colors.title, fontSize: 15 },
                    ]}
                  >
                    {data.name}
                  </Text>
                </View>
                <Feather size={18} color={colors.title} name="chevron-right" />
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              marginBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={IMAGES.logout}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: colors.text,
                  marginRight: 14,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={[
                  FONTS.font,
                  FONTS.fontMedium,
                  { color: colors.title, fontSize: 15 },
                ]}
              >
                {'Logout'}
              </Text>
            </View>
            <Feather size={18} color={colors.title} name="chevron-right" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            marginHorizontal: -15,
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={[FONTS.fontSemiBold, { color: colors.title, fontSize: 13 }]}
          >
            FootFlare <Text style={[FONTS.fontRegular]}>Shoes Store</Text>
          </Text>
          <Text
            style={[FONTS.fontRegular, { color: colors.title, fontSize: 13 }]}
          >
            App Version 1.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DrawerMenu;
