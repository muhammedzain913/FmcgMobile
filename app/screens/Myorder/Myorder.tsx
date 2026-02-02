import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import Header from "../../layout/Header";
import { COLORS, SIZES, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { convertIsoDateToNormal } from "../../utils/convertIsoDateToNormal";
import { subTotal } from "../../utils/subTotal";
import { generateSlug } from "../../utils/generateSlug";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button/Button";
const apiPath = ApiClient();

const myOrders = [
  {
    id: "694e71b171b7e92cb6560fb3",
    userId: "692ea5d5da21c31031bdaf58",
    vendorId: "692ff1a6622aea5e762aa28e",
    email: "manmadan@gmail.com",
    phone: "9847235308",

    streetAddress: "Katt",
    city: "Andalus",
    country: "Kuwait",

    shippingCost: 0,
    orderNumber: "I8AQ2VDV",
    paymentMethod: "Cash On Delivery",

    orderStatus: "PROCESSING", // PROCESSING | ON_THE_WAY | DELIVERED
    deliveryAgentStatus: "ASSIGNED",

    createdAt: "2025-12-26T11:29:53.591Z",
    updatedAt: "2025-12-26T11:43:39.173Z",

    deliveryAgentId: "693927f1ab03e3710719fc84",

    orderItems: [
      {
        id: "69392c7a1f8d6c000d47e6a2",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa292",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Wheat Flour",
        quantity: 2,
        price: 45,

        createdAt: "2025-12-10T08:16:58.365Z",
        updatedAt: "2025-12-10T08:16:58.365Z",
      },

      {
        id: "69392c7a1f8d6c000d47e6a3",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa293",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Amul Butter 2L",
        imageUrl: "https://utfs.io/f/butter-image-example.jpeg",

        quantity: 1,
        price: 123,

        createdAt: "2025-12-10T08:17:58.365Z",
        updatedAt: "2025-12-10T08:17:58.365Z",
      },
    ],
  },
  {
    id: "694e71b171b7e92cb6560fb3",
    userId: "692ea5d5da21c31031bdaf58",
    vendorId: "692ff1a6622aea5e762aa28e",
    email: "manmadan@gmail.com",
    phone: "9847235308",

    streetAddress: "Katt",
    city: "Andalus",
    country: "Kuwait",

    shippingCost: 0,
    orderNumber: "I8AQ2VDV",
    paymentMethod: "Cash On Delivery",

    orderStatus: "PROCESSING", // PROCESSING | ON_THE_WAY | DELIVERED
    deliveryAgentStatus: "ASSIGNED",

    createdAt: "2025-12-26T11:29:53.591Z",
    updatedAt: "2025-12-26T11:43:39.173Z",

    deliveryAgentId: "693927f1ab03e3710719fc84",

    orderItems: [
      {
        id: "69392c7a1f8d6c000d47e6a2",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa292",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Wheat Flour",
        quantity: 2,
        price: 45,

        createdAt: "2025-12-10T08:16:58.365Z",
        updatedAt: "2025-12-10T08:16:58.365Z",
      },

      {
        id: "69392c7a1f8d6c000d47e6a3",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa293",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Amul Butter 2L",
        imageUrl: "https://utfs.io/f/butter-image-example.jpeg",

        quantity: 1,
        price: 123,

        createdAt: "2025-12-10T08:17:58.365Z",
        updatedAt: "2025-12-10T08:17:58.365Z",
      },
    ],
  },
  {
    id: "694e71b171b7e92cb6560fb3",
    userId: "692ea5d5da21c31031bdaf58",
    vendorId: "692ff1a6622aea5e762aa28e",
    email: "manmadan@gmail.com",
    phone: "9847235308",

    streetAddress: "Katt",
    city: "Andalus",
    country: "Kuwait",

    shippingCost: 0,
    orderNumber: "I8AQ2VDV",
    paymentMethod: "Cash On Delivery",

    orderStatus: "PROCESSING", // PROCESSING | ON_THE_WAY | DELIVERED
    deliveryAgentStatus: "ASSIGNED",

    createdAt: "2025-12-26T11:29:53.591Z",
    updatedAt: "2025-12-26T11:43:39.173Z",

    deliveryAgentId: "693927f1ab03e3710719fc84",

    orderItems: [
      {
        id: "69392c7a1f8d6c000d47e6a2",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa292",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Wheat Flour",
        quantity: 2,
        price: 45,

        createdAt: "2025-12-10T08:16:58.365Z",
        updatedAt: "2025-12-10T08:16:58.365Z",
      },

      {
        id: "69392c7a1f8d6c000d47e6a3",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa293",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Amul Butter 2L",
        imageUrl: "https://utfs.io/f/butter-image-example.jpeg",

        quantity: 1,
        price: 123,

        createdAt: "2025-12-10T08:17:58.365Z",
        updatedAt: "2025-12-10T08:17:58.365Z",
      },
    ],
  },
  {
    id: "694e71b171b7e92cb6560fb3",
    userId: "692ea5d5da21c31031bdaf58",
    vendorId: "692ff1a6622aea5e762aa28e",
    email: "manmadan@gmail.com",
    phone: "9847235308",

    streetAddress: "Katt",
    city: "Andalus",
    country: "Kuwait",

    shippingCost: 0,
    orderNumber: "I8AQ2VDV",
    paymentMethod: "Cash On Delivery",

    orderStatus: "PROCESSING", // PROCESSING | ON_THE_WAY | DELIVERED
    deliveryAgentStatus: "ASSIGNED",

    createdAt: "2025-12-26T11:29:53.591Z",
    updatedAt: "2025-12-26T11:43:39.173Z",

    deliveryAgentId: "693927f1ab03e3710719fc84",

    orderItems: [
      {
        id: "69392c7a1f8d6c000d47e6a2",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa292",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Wheat Flour",
        quantity: 2,
        price: 45,

        createdAt: "2025-12-10T08:16:58.365Z",
        updatedAt: "2025-12-10T08:16:58.365Z",
      },

      {
        id: "69392c7a1f8d6c000d47e6a3",
        orderId: "694e71b171b7e92cb6560fb3",
        productId: "692ff417622aea5e762aa293",
        vendorId: "692ff1a6622aea5e762aa28e",

        title: "Amul Butter 2L",
        imageUrl: "https://utfs.io/f/butter-image-example.jpeg",

        quantity: 1,
        price: 123,

        createdAt: "2025-12-10T08:17:58.365Z",
        updatedAt: "2025-12-10T08:17:58.365Z",
      },
    ],
  },
];

type MyorderScreenProps = StackScreenProps<RootStackParamList, "Myorder">;

const Myorder = ({ navigation }: MyorderScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const userInfo = useSelector((x: any) => x.user.userInfo);
  const id = useSelector((x: any) => x?.user?.userInfo?.id);
  const [orders, setOrders] = useState<any>();
  const scrollRef = useRef<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onPressTouch = (val: number) => {
    setCurrentIndex(val);
    scrollRef.current.scrollTo({
      x: SIZES.width * val,
      animated: true,
    });
  };

  const dispatch = useDispatch();

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiPath.get(
          `${Url}/api/orders/user/${userInfo.id}`,
        );
        setOrders(response.data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getSubTotal = (orderItems: any[]) => {
    return orderItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(250, 250, 250, 1)" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "white",
            paddingVertical: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              justifyContent: "space-between",
              backgroundColor: "#ffff",
            }}
          >
            <View
              style={{
                flexDirection: "row", // Flow: Horizontal
                alignItems: "center", // Inner alignment
                height: 40, // Fixed height // Padding
                paddingVertical: 7.78,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "grey",
                backgroundColor: "rgba(255, 255, 255, 0.6)", // Required for blur effect
                width: 40,
                justifyContent: "center",
              }}
            >
              <Image
                style={{ height: 20, width: 15, marginTop: 4 }}
                source={require("../../assets/images/icons/CaretLeft.png")}
              />
            </View>
            <View style={{ position: "absolute", left: 0, right: 0 }}>
              <Text
                style={{
                  fontFamily: "Lato", // preferred if font file exists
                  fontSize: 20,
                  lineHeight: 32,
                  letterSpacing: -0.48, // -3% of 16px = -0.48
                  color: "#000000",
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                My Cart
              </Text>
            </View>
            <View></View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, gap: 30 }}>
          <Text style={{ fontSize: 15, fontWeight: 600 }}>Active Orders</Text>
          {orders?.map((item: any, index: number) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: "#fff",
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    gap: 10,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "black",
                      position: "absolute",
                      top: 0,
                      right: 0,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      borderTopRightRadius: 8,
                      borderBottomLeftRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10 }}>
                      On The Way
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ gap: 10 }}>
                      <Text style={{}}>ORDER DETAILS</Text>
                    </View>
                    <View style={{}}>
                      <Text>{item.createdAt}</Text>
                    </View>
                  </View>
                  <Image
                    style={{ width: 350 }}
                    source={require("../../assets/images/line.png")}
                  />

                  <View style={{ gap: 10 }}>
                    {item.orderItems.map((item: any, index: number) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>{item.title}</Text>
                          <Text>{item.price}</Text>
                        </View>
                      );
                    })}
                  </View>

                  <Button
                    onPress={() => {
                      navigation.navigate("Trackorder", {
                        orderId: item.id,
                      });
                    }}
                    title="Track Order"
                    color={"rgba(30, 18, 61, 1)"}
                  ></Button>
                </View>
              </>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Myorder;
