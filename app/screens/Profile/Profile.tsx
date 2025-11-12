import {
  CommonActions,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SectionList,
  ActivityIndicator,
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

const btnData = [
  {
    title: "Your Order",
    navigate: "Myorder",
  },
  {
    title: "Wishlist",
    navigate: "Wishlist",
  },
  {
    title: "Coupons",
    navigate: "Coupons",
  },
  {
    title: "Track Order",
    navigate: "Trackorder",
  },
];

const ListwithiconData = [
  {
    title: "Account Settings",
    data: [
      {
        icon: IMAGES.user2,
        title: "Edit Profile",
        navigate: "EditProfile",
      },
      {
        icon: IMAGES.wallet,
        title: "Saved Cards & Wallet",
        navigate: "Payment",
      },
      {
        icon: IMAGES.Location,
        title: "Saved Addresses",
        navigate: "AddDeleveryAddress",
      },
      {
        icon: IMAGES.Filter,
        title: "Select Language",
        navigate: "Language",
      },
      {
        icon: IMAGES.Notification,
        title: "Notifications Settings",
        navigate: "Notification",
      },
    ],
  },
  {
    title: "My Activity",
    data: [
      {
        icon: IMAGES.Star,
        title: "Reviews",
        navigate: "Writereview",
      },
      {
        icon: IMAGES.Chat,
        title: "Questions & Answers",
        navigate: "Questions",
      },
    ],
  },
];

type ProfileScreenProps = StackScreenProps<RootStackParamList, "Profile">;

const Profile = ({ navigation }: ProfileScreenProps) => {
  const user = useSelector((x: any) => x.user.userInfo);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  //const navigation = useNavigation();

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dologout();
    }, 5000);

    const dologout = () => {
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "OnBoarding" }],
        })
      );
      setLoading(false);
    };
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
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header
        title="Profile"
        leftIcon="back"
        //rightIcon1={'search'}
        titleRight
      />
      <View style={[GlobalStyleSheet.container, { paddingTop: 5, flex: 1 }]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingBottom: 30,
          }}
        >
          <Image
            style={{ height: 40, width: 40, borderRadius: 50 }}
            source={IMAGES.small1}
          />
          <Text
            style={{ ...FONTS.fontRegular, fontSize: 24, color: colors.title }}
          >
            Hello,<Text style={{ ...FONTS.fontSemiBold }}> {user.name}</Text>
          </Text>
        </View>
        <View style={GlobalStyleSheet.row}>
          {btnData.map((data: any, index) => {
            return (
              <View
                key={index}
                style={[GlobalStyleSheet.col50, { marginBottom: 10 }]}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate(data.navigate)}
                  style={{
                    height: 48,
                    width: "100%",
                    backgroundColor: theme.dark
                      ? COLORS.white
                      : colors.background,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      FONTS.fontMedium,
                      { fontSize: 16, color: COLORS.title },
                    ]}
                  >
                    {data.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={{ marginHorizontal: -15, marginTop: 20, flex: 1 }}>
          <SectionList
            sections={ListwithiconData}
            keyExtractor={(item: any, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.navigate)}
                style={{
                  flexDirection: "row",
                  marginHorizontal: 15,
                  height: 48,
                  alignItems: "center",
                  paddingVertical: 10,
                  //borderRadius: SIZES.radius,
                }}
              >
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: colors.title,
                      resizeMode: "contain",
                    }}
                    source={item.icon}
                  />
                </View>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 16,
                    color: colors.title,
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
                <Ionicons
                  style={{ opacity: 0.8 }}
                  color={colors.title}
                  name="chevron-forward"
                  size={20}
                />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                style={{
                  ...FONTS.fontMedium,
                  fontSize: 20,
                  color: colors.title,
                  paddingLeft: 20,
                  paddingBottom: 20,
                  paddingTop: 10,
                  backgroundColor: theme.dark ? COLORS.primary : COLORS.white,
                }}
              >
                {title}
              </Text>
            )}
          />

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              marginHorizontal: 15,
              height: 48,
              alignItems: "center",
              paddingVertical: 10,
              //borderRadius: SIZES.radius,
            }}
          >
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  tintColor: colors.title,
                  resizeMode: "contain",
                }}
                // source={item.icon}
              />
            </View>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 16,
                color: colors.title,
                flex: 1,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
