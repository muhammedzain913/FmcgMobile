import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import Header from "../../layout/Header";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch } from "react-redux";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import ProductCard from "../Product/ProductCard";
import OrderSuccess from "./OrderSuccess";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

const apiPath = ApiClient();

const TrackorderData = [
  {
    id: "31",
    image: IMAGES.item9,
    title: "Echo Vibe Urban Runners",
    price: "$179",
    delevery: "FREE Delivery",
    offer: "40% OFF",
    btntitle: "Track Order",
  },
];

type TrackorderScreenProps = StackScreenProps<RootStackParamList, "Trackorder">;

const Trackorder = ({ route, navigation }: TrackorderScreenProps) => {
  const { orderId } = route.params;
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [orderStatus, setOrderStatus] = useState<
    "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED"
  >();

  const [deliveryAgentStatus, setDeliveryAgentStatus] = useState<
    "ASSIGNED" | "ACCEPTED" | "REJECTED" | "PICKED_UP" | "DELIVERED"
  >();

  const dispatch = useDispatch();

  const [order, setOrder] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { governorate, city, block } = useLocationSelector();

  const DUMMY_PRODUCTS = [
    {
      id: "1",
      title: "Cheese",
      unit: "1 KG",
      price: 40,
    },
    {
      id: "2",
      title: "Butter",
      unit: "1 KG",
      price: 20,
    },
    {
      id: "3",
      title: "Milk",
      unit: "1 KG",
      price: 40,
    },
    {
      id: "4",
      title: "Cheese",
      unit: "1 KG",
      price: 40,
    },
    {
      id: "5",
      title: "Butter",
      unit: "1 KG",
      price: 20,
    },
  ];

  useEffect(() => {
    const fetvhOrderById = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/orders/${orderId}`);
        setOrder(response.data);
        setOrderStatus(response.data.orderStatus);
        setDeliveryAgentStatus(response.data.deliveryAgentStatus);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetvhOrderById();
  }, []);

  function isStepCompleted(step: string, order: any) {
    switch (step) {
      case "CONFIRMED":
        return ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
          order?.orderStatus,
        );

      case "ASSIGNED":
        return ["ASSIGNED", "ACCEPTED", "PICKED_UP", "DELIVERED"].includes(
          order?.deliveryAgentStatus,
        );

      case "ACCEPTED":
        return ["ACCEPTED", "PICKED_UP", "DELIVERED"].includes(
          order?.deliveryAgentStatus,
        );

      case "OUT_FOR_DELIVERY":
        return (
          order?.orderStatus === "SHIPPED" ||
          (order?.orderStatus === "DELIVERED" &&
            order?.deliveryAgentStatus === "PICKED_UP") ||
          order?.deliveryAgentStatus === "DELIVERED"
        );

      case "DELIVERED":
        return order?.orderStatus === "DELIVERED";

      default:
        return false;
    }
  }

  const renderNotCompleted = () => {
    return (
      <View
        style={{
          height: 24,
          width: 24,
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: 24,
        }}
      ></View>
    );
  };

  const renderOrderStatuses = (title: string, scenario: string) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          marginTop: 40,
        }}
      >
        {isStepCompleted(scenario, order) ? (
          <Image
            style={{ height: 24, width: 24, resizeMode: "contain" }}
            source={IMAGES.check}
          />
        ) : (
          renderNotCompleted()
        )}
        ``
        <View>
          <Text
            style={{
              ...FONTS.fontMedium,
              fontSize: 16,
              color: isStepCompleted(scenario, order) ? "green" : "black",
            }}
          >
            {title}
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.50)",
              }}
            >
              {" "}
              27 Dec 2023
            </Text>
          </Text>
          <Text
            style={{
              ...FONTS.fontRegular,
              fontSize: 14,
              color: colors.title,
            }}
          >
            We has been confirmed
          </Text>
        </View>
        <View
          style={{
            height: isStepCompleted(scenario, order) ? 60 : 60,
            width: 2,
            backgroundColor: isStepCompleted(scenario, order)
              ? "green"
              : "grey",
            position: "absolute",
            left: 11,
            top: 33,
          }}
        ></View>
      </View>
    );
  };

  // Calculate current step index based on order status and delivery agent status
  const getCurrentStepIndex = () => {
    if (!order) return 0;

    // Step 0: Order Placed (always completed if order exists)
    // Step 1: Order Confirmed (if orderStatus is PROCESSING, SHIPPED, or DELIVERED)
    // Step 2: Delivery Partner Assigned (if deliveryAgentStatus is ASSIGNED, ACCEPTED, PICKED_UP, or DELIVERED)
    // Step 3: Out For Delivery (if orderStatus is SHIPPED or deliveryAgentStatus is PICKED_UP or DELIVERED)

    let step = 0; // Order Placed is always completed

    // Check if Order Confirmed
    if (["PROCESSING", "SHIPPED", "DELIVERED"].includes(order?.orderStatus)) {
      step = 1;
    }

    // Check if Delivery Partner Assigned
    if (
      ["ASSIGNED", "ACCEPTED", "PICKED_UP", "DELIVERED"].includes(
        order?.deliveryAgentStatus,
      )
    ) {
      step = 2;
    }

    // Check if Out For Delivery
    if (
      order?.orderStatus === "SHIPPED" ||
      order?.deliveryAgentStatus === "PICKED_UP" ||
      order?.deliveryAgentStatus === "DELIVERED"
    ) {
      step = 3;
    }

    return step;
  };

  const currentStepIndex = getCurrentStepIndex();

  // If order is delivered, show OrderSuccess screen

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(250, 250, 250, 1)" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "rgba(250, 250, 250, 1)",
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              justifyContent: "space-between",
              backgroundColor: "rgba(250, 250, 250, 1)",
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
                source={require("../../assets/images/icons/left-chevron.png")}
              />
            </View>
            <View></View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 30 }}>
          <View
            style={{
              padding: 20,
              backgroundColor: "rgba(13, 8, 27, 1)",
              borderRadius: 12,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                backgroundColor: "rgba(13, 8, 27, 1)",
                padding: 20,
                alignItems: "center",
                marginBottom: 50,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  left: 0,
                  top: 10,
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <View style={{ alignItems: "center", gap: 5 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Lato-SemiBold",
                      fontSize: 18,
                      fontStyle: "italic",
                    }}
                  >
                    Delivery Status
                  </Text>
                  <Text style={{ color: "#fff", fontFamily: "Lato-Regular" }}>
                    Order is on the way
                  </Text>
                </View>
                <View
                  style={{
                    position: "relative",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Radial gradient background - extended glow */}
                  <View
                    style={{
                      position: "absolute",
                      width: 340,
                      height: 340,
                      borderRadius: 170,
                      overflow: "hidden",
                    }}
                  >
                    <Svg width="340" height="340">
                      <Defs>
                        <RadialGradient
                          id="deliveryGradient"
                          cx="50%"
                          cy="50%"
                          r="50%"
                          fx="50%"
                          fy="50%"
                        >
                          <Stop
                            offset="0%"
                            stopColor="rgba(76, 175, 80, 0.3)"
                            stopOpacity="0.3"
                          />
                          <Stop
                            offset="15%"
                            stopColor="rgba(76, 175, 80, 0.24)"
                            stopOpacity="0.24"
                          />
                          <Stop
                            offset="30%"
                            stopColor="rgba(76, 175, 80, 0.18)"
                            stopOpacity="0.18"
                          />
                          <Stop
                            offset="50%"
                            stopColor="rgba(76, 175, 80, 0.12)"
                            stopOpacity="0.12"
                          />
                          <Stop
                            offset="70%"
                            stopColor="rgba(76, 175, 80, 0.075)"
                            stopOpacity="0.075"
                          />
                          <Stop
                            offset="85%"
                            stopColor="rgba(76, 175, 80, 0.045)"
                            stopOpacity="0.045"
                          />
                          <Stop
                            offset="100%"
                            stopColor="rgba(76, 175, 80, 0)"
                            stopOpacity="0"
                          />
                        </RadialGradient>
                      </Defs>
                      <Circle
                        cx="170"
                        cy="170"
                        r="170"
                        fill="url(#deliveryGradient)"
                      />
                    </Svg>
                  </View>
                  <Image
                    style={{ width: 40, height: 40, zIndex: 1 }}
                    source={require("../../assets/images/icons/delivery-bike.png")}
                  />
                </View>
              </View>
              <View></View>
            </View>

            <View style={{ padding: 20, gap: 20, marginTop: 20 }}>
              <View
                style={{
                  height: 40,
                  backgroundColor: "#252031",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  borderRadius: 7,
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    borderRadius: 8,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      backgroundColor: "#059B5D",
                      borderRadius: 8,
                      height: "100%",
                      top: 0,
                      left: 0,
                      width: `100%`,
                    }}
                  ></View>
                  {/* Step 0: Order Placed - Always completed */}
                  <View style={styles.statusIndicator}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor:
                          currentStepIndex >= 1
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.3)",
                        borderRadius: 8,
                      }}
                    ></View>
                  </View>
                  {/* Step 1: Order Confirmed */}
                  <View style={styles.statusIndicator}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor:
                          currentStepIndex >= 1
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.3)",
                        borderRadius: 8,
                      }}
                    ></View>
                  </View>
                  {/* Step 2: Delivery Partner Assigned */}
                  <View style={styles.statusIndicator}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor:
                          currentStepIndex >= 2 ? "#fff" : "#fff",
                        borderRadius: 8,
                      }}
                    ></View>
                  </View>
                  {/* Step 3: Out For Delivery */}
                  <View style={styles.statusIndicator}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor:
                          currentStepIndex >= 3
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.3)",
                        borderRadius: 8,
                      }}
                    ></View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  justifyContent: "center",
                  borderRadius: 7,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    flexShrink: 1,
                    color: "#fff",
                    fontSize: 10,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  Order Placed
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    flexShrink: 1,
                    color: "#fff",
                    fontSize: 10,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  Order Confirmed
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    flexShrink: 1,
                    color: "#fff",
                    fontSize: 10,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  Delivery Partner Assigned
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    flexShrink: 1,
                    color: "#fff",
                    fontSize: 10,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  Out For Delivery
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 30,
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 30,
                paddingHorizontal: 15,
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Image
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                  source={require("../../assets/images/face.png")}
                />
                <Text style={{ color: "#fff" }}>
                  {order?.deliveryAgent?.name}
                </Text>
              </View>
              <Image
                source={require("../../assets/images/icons/phonedelivery.png")}
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 20,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              DELIVERING TO
            </Text>

            <View style={{ gap: 10, flexDirection: "row" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderWidth: 1,
                  borderColor: "rgba(240, 240, 240, 1)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                }}
              >
                <Image
                  source={require("../../assets/images/icons/House.png")}
                />
              </View>

              <View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../../assets/images/icons/locationblack.png")}
                  />
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 15,
                      fontWeight: "700",
                      lineHeight: 28,
                      color: "#141313",
                    }}
                  >
                    {order?.governorate}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 13,
                      fontWeight: "400",
                      lineHeight: 28,
                      color: "rgb(17, 17, 17)",
                    }}
                  >
                    {order?.city} , Block {order?.block} ,{" "}
                    {order?.streetAddress} , {order?.apartmentNumber}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 20,
            }}
          >
            <View style={styles.billContainer}>
              <Text style={{ fontWeight: 500 }}>ORDER DETAILS</Text>
              <Text style={{}}>{order?.createdAt}</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{ width: 400 }}
                source={require("../../assets/images/icons/linebill.png")}
              />
            </View>
            {order?.orderItems?.map((item: any, index: number) => {
              return (
                <View style={styles.billContainer}>
                  <Text style={{}}>{item.title}</Text>
                  <Text style={{}}>₹ {item.price}</Text>
                </View>
              );
            })}
          </View>
          {/* 
          <View
            style={[
              GlobalStyleSheet.container,
              {
                paddingHorizontal: 20,
                paddingBottom: 10,
                backgroundColor: "#fff",
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 15,
                  fontWeight: "700", // Bold
                  lineHeight: 20,
                  letterSpacing: -0.39, // -3% of 13px ≈ -0.39
                  color: "rgba(31, 31, 31, 1)",
                  textTransform: "uppercase", // Cap height look
                }}
              >
                SIMILAR PRODUCTS
              </Text>

              <View
                style={{
                  flexDirection: "row", // Flow: Horizontal
                  alignItems: "center", // Inner alignment
                  height: 30, // Fixed height
                  paddingVertical: 7.78,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,

                  borderColor: "rgba(240, 240, 240, 1)",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <Image
                  style={{ height: 10, width: 10, marginTop: 4 }}
                  source={require("../../assets/images/icons/top-right.png")}
                />
              </View>
            </View>

            <ScrollView
              contentContainerStyle={{}}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {DUMMY_PRODUCTS?.map((data: any, index: any) => {
                return (
                  <>
                    <ProductCard product={data} addToCart={() => {}} navigation={navigation} />
                  </>
                );
              })}
            </ScrollView>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Trackorder;

const styles = StyleSheet.create({
  statusIndicator: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 5,
    borderColor: "#FFFFFF1A",
    justifyContent: "center",
    alignItems: "center",
  },
  billContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
