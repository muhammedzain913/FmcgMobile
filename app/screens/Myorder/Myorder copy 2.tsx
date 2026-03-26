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
const apiPath = ApiClient();

const MyorderData = [
  {
    id: "21",
    image: IMAGES.item9,
    title: "Echo Vibe Urban Runners",
    price: "$179",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Track Order",
  },
  {
    id: "22",
    image: IMAGES.item10,
    title: "Swift Glide Sprinter Soles",
    price: "$199",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Track Order",
  },
  {
    id: "23",
    image: IMAGES.item11,
    title: "Sky Burst Skyline Burst Shoes",
    price: "$149",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Track Order",
  },
  {
    id: "24",
    image: IMAGES.item12,
    title: "Zen Dash Active Flex Shoes",
    price: "$299",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Track Order",
  },
  {
    id: "25",
    image: IMAGES.item13,
    title: "Nova Stride Street Stompers",
    price: "$99",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Track Order",
  },
];

const CompletedData = [
  {
    id: "26",
    image: IMAGES.item13,
    title: "Swift Glide Sprinter Soles",
    price: "$199",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Write Review",
  },
  {
    id: "27",
    image: IMAGES.item12,
    title: "Sky Burst Skyline Burst Shoes",
    price: "$299",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Write Review",
  },
  {
    id: "28",
    image: IMAGES.item11,
    title: "Zen Dash Active Flex Shoes",
    price: "$49",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Write Review",
  },
  {
    id: "29",
    image: IMAGES.item10,
    title: "Echo Vibe Urban Runners",
    price: "$399",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Write Review",
  },
  {
    id: "30",
    image: IMAGES.item9,
    title: "Nova Stride Street Stompers",
    price: "$199",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Write Review",
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
          `${Url}/api/orders/user/${userInfo.id}`
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
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="My Order" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={GlobalStyleSheet.container}>
          <View style={{ flexDirection: "row", gap: 10, marginRight: 10 }}>
            <TouchableOpacity
              onPress={() => onPressTouch(0)}
              style={[
                GlobalStyleSheet.TouchableOpacity2,
                {
                  backgroundColor:
                    currentIndex === 0 ? colors.title : colors.card,
                  borderColor: currentIndex === 0 ? colors.title : colors.title,
                },
              ]}
            >
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 19,
                  color:
                    currentIndex === 0
                      ? theme.dark
                        ? COLORS.title
                        : colors.card
                      : colors.title,
                }}
              >
                Ongoing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressTouch(1)}
              style={[
                GlobalStyleSheet.TouchableOpacity2,
                {
                  backgroundColor:
                    currentIndex === 1 ? colors.title : colors.card,
                  borderColor: currentIndex === 1 ? colors.title : colors.title,
                },
              ]}
            >
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 19,
                  color:
                    currentIndex === 1
                      ? theme.dark
                        ? COLORS.title
                        : colors.card
                      : colors.title,
                }}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(e: any) => {
            if (
              e.nativeEvent.contentOffset.x.toFixed(0) == SIZES.width.toFixed(0)
            ) {
              setCurrentIndex(1);
            } else if (e.nativeEvent.contentOffset.x.toFixed(0) == 0) {
              setCurrentIndex(0);
            } else {
              setCurrentIndex(0);
            }
          }}
        >
          <View style={{ width: SIZES.width }}>
            <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
              <View style={{ marginHorizontal: -15 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {orders?.map((order: any, index: number) => {
                    return (
                      <>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            padding: 16,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: "#eee",
                            shadowColor: "#000",
                            shadowOpacity: 0.05,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                        >
                          {/* Order Header */}
                          <View style={{ marginBottom: 10 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: "#111",
                                marginBottom: 4,
                              }}
                            >
                              Order #{order.orderNumber}
                            </Text>
                            <Text style={{ fontSize: 13, color: "#666" }}>
                              Date: {convertIsoDateToNormal(order.createdAt)}
                            </Text>
                          </View>

                          {/* Subtotal & Status */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 8,
                            }}
                          >
                            <View>
                              <Text style={{ fontSize: 13, color: "#999" }}>
                                Subtotal
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "600",
                                  color: "#111",
                                  marginTop: 2,
                                }}
                              >
                                ${getSubTotal(order.orderItems)}
                              </Text>
                            </View>

                            <View
                              style={{
                                backgroundColor:
                                  order.orderStatus === "Completed"
                                    ? "#DCFCE7"
                                    : order.orderStatus === "Pending"
                                    ? "#FEF9C3"
                                    : "#E0F2FE",
                                borderRadius: 20,
                                paddingVertical: 5,
                                paddingHorizontal: 15,
                                alignSelf: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: "600",
                                  color:
                                    order.orderStatus === "Completed"
                                      ? "#166534"
                                      : order.orderStatus === "Pending"
                                      ? "#854D0E"
                                      : "#1E40AF",
                                }}
                              >
                                {order.orderStatus}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <ScrollView
                          style={{
                            flex: 1,
                            paddingHorizontal: 16,
                            paddingVertical: 24,
                          }}
                          showsVerticalScrollIndicator={false}
                        >
                          {order.orderItems.map((item: any, i: number) => {
                            const slug = generateSlug(item.title);
                            return (
                              <View
                                key={i}
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 30,
                                  borderBottomWidth: 1,
                                  borderBottomColor: "#eee",
                                  paddingBottom: 10,
                                }}
                              >
                                {/* Product Image */}
                                <Image
                                  source={{ uri: item.imageUrl }}
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 10,
                                    resizeMode: "cover",
                                  }}
                                />

                                {/* Product Details */}
                                <View
                                  style={{
                                    flex: 1,
                                    marginLeft: 15,
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        fontWeight: "700",
                                        color: "#111",
                                      }}
                                    >
                                      {item.title}
                                    </Text>

                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginTop: 10,
                                      }}
                                    >
                                      <Text
                                        style={{ fontSize: 14, color: "#777" }}
                                      >
                                        Qty: {item.quantity}
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: 16,
                                          fontWeight: "700",
                                          color: "#111",
                                        }}
                                      >
                                        ${item.price}
                                      </Text>
                                    </View>
                                  </View>

                                  {/* Links */}
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      marginTop: 10,
                                    }}
                                  >
                                    <TouchableOpacity
                                      onPress={() =>
                                        navigation.navigate("ProductDetails", {
                                          slug,
                                        })
                                      }
                                    >
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          color: "#555",
                                          marginRight: 10,
                                        }}
                                      >
                                        View Product
                                      </Text>
                                    </TouchableOpacity>

                                    <Text style={{ color: "#ccc" }}>|</Text>

                                    <TouchableOpacity onPress={() => {}}>
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          color: "#555",
                                          marginLeft: 10,
                                        }}
                                      >
                                        Similar Product
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            );
                          })}

                          {/* Buttons */}
                          <View style={{ flexDirection: "row", marginTop: 20 }}>
                            <TouchableOpacity
                              style={{
                                flex: 1,
                                backgroundColor: "#fff",
                                borderColor: "#ccc",
                                borderWidth: 1,
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: "center",
                                marginRight: 10,
                              }}
                              onPress={() => {navigation.navigate('Trackorder',{
                                orderId : order.id
                              })}}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "700",
                                  color: "#111",
                                }}
                              >
                                Track Order
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={{
                                flex: 1,
                                backgroundColor: "#fff",
                                borderColor: "#ccc",
                                borderWidth: 1,
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: "center",
                              }}
                              onPress={() =>
                                navigation.navigate("Invoice", { id: order.id })
                              }
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "700",
                                  color: "#111",
                                }}
                              >
                                View Invoice
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </ScrollView>
                      </>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
          <View style={{ width: SIZES.width }}>
            <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
              <View style={{ marginHorizontal: -15 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {CompletedData.map((data: any, index) => {
                    return (
                      <Cardstyle2
                        id={data.id}
                        key={index}
                        title={data.title}
                        price={data.price}
                        delevery={data.delevery}
                        // image={data.image}
                        offer={data.offer}
                        removelikebtn
                        btntitle={data.btntitle}
                        onPress1={() => addItemToWishList(data)}
                        onPress={() => navigation.navigate("Writereview")}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Myorder;
