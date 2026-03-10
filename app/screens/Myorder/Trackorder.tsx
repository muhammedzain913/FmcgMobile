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
import { TouchableOpacity } from "react-native-gesture-handler";
import DashedLine from "../../components/Common/DashedLine";
import { formatDateTime } from "../../utils/formatDateTime";

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
        console.log('this is the specified order',response.data)
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

  

  // Calculate current step index based on order status and delivery agent status
  const getCurrentStepIndex = () => {
    if (!order) return 0;

    // Step 0: Order Placed (always completed if order exists)
    // Step 1: Order Confirmed (when orderStatus === "PROCESSING")
    // Step 2: Delivery Partner Assigned (when deliveryAgentStatus === "ASSIGNED")
    // Step 3: Out For Delivery (when deliveryAgentStatus === "PICKED_UP" AND orderStatus === "SHIPPED")

    let step = 0; // Order Placed is always completed

    // Step 1: Order Confirmed - when vendor accepts the order
    if (order?.orderStatus === "PROCESSING") {
      step = 1;
    }

    // Step 2: Delivery Partner Assigned - when vendor assigns a delivery agent
    if (order?.deliveryAgentStatus === "ASSIGNED") {
      step = 2;
    }

    // Step 3: Out For Delivery - when delivery agent picks up AND order is shipped
    if (
      order?.deliveryAgentStatus === "PICKED_UP" &&
      order?.orderStatus === "SHIPPED"
    ) {
      step = 3;
    }

    // If order is delivered, show as completed (step 3)
    if (order?.orderStatus === "DELIVERED") {
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
                      // Progress bar should reach the center of the current step's marker
                      // With 4 markers evenly spaced using space-between:
                      // Marker 1 (Order Placed) at ~0%
                      // Marker 2 (Order Confirmed) at ~33.33%
                      // Marker 3 (Delivery Partner Assigned) at ~66.66%
                      // Marker 4 (Out For Delivery) at ~100%
                      // Adding small buffer to ensure it visually reaches the marker center
                      width: currentStepIndex === 0 
                        ? "6%" // Small progress to show Order Placed is done
                        : currentStepIndex === 1 
                        ? "38%" // Reaches and covers 2nd marker (Order Confirmed)
                        : currentStepIndex === 2 
                        ? "69%" // Reaches and covers 3rd marker (Delivery Partner Assigned)
                        : "100%", // Fully complete (Out For Delivery)
                    }}
                  ></View>
                  {/* Step 0: Order Placed - Always completed */}
                  <View style={styles.statusIndicator}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: "#fff", // Always completed
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
                          currentStepIndex >= 2
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.3)",
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
                  paddingHorizontal: 15,
                }}
              >
                <View style={{ alignItems: "flex-start", flexBasis: "22%" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 0 
                        ? "#059B5D" 
                        : currentStepIndex > 0 
                        ? "#fff" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Order
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 0 
                        ? "#059B5D" 
                        : currentStepIndex > 0 
                        ? "#fff" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Placed
                  </Text>
                </View>

                <View style={{ alignItems: "center", flexBasis: "28%" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 1 
                        ? "#059B5D" 
                        : currentStepIndex > 1 
                        ? "#fff" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Order
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 1 
                        ? "#059B5D" 
                        : currentStepIndex > 1 
                        ? "#fff" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Confirmed
                  </Text>
                </View>

                <View style={{ alignItems: "center", flexBasis: "28%" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 2 
                        ? "#059B5D" 
                        : currentStepIndex > 2 
                        ? "#fff" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Delivery Partner
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 2 
                        ? "#059B5D" 
                        : currentStepIndex > 2 
                        ? "#fff" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Assigned
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end", flexBasis: "22%" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 3 
                        ? "#059B5D" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Out For
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: currentStepIndex === 3 
                        ? "#059B5D" 
                        : "rgba(255, 255, 255, 0.5)",
                      fontSize: 10,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    Delivery
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 40 }}>
              <View
                style={{
                  marginTop: 30,
                  borderWidth: 1,
                  borderColor: "#fff",
                  borderRadius: 30,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    style={{ width: 30, height: 30, borderRadius: 20 }}
                    source={require("../../assets/images/face.png")}
                  />
                  <Text style={{ color: "#fff" }}>
                    {order?.deliveryAgent?.name}
                  </Text>
                </View>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/images/icons/phonedelivery.png")}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 20,
              borderRadius: 8,
              backgroundColor: "#ffff",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  color: "rgba(5, 155, 93, 1)",
                  fontSize: 16,
                  fontFamily: "Lato-Bold",
                }}
              >
                Delivering To
              </Text>
              <Image
                style={{ width: 15, height: 15 }}
                source={require("../../assets/images/icons/delivery-bike.png")}
              />
              <DashedLine />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ height: 15, width: 15, resizeMode: "contain" }}
                    source={require("../../assets/images/icons/locationpinblack.png")}
                  />
                  <Text
                    style={{
                      fontFamily: "Lato-Bold",
                      fontSize: 15,
                      lineHeight: 28,
                      color: "#141313",
                    }}
                  >
                    {order?.streetAddress || "Home"}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 13,
                      lineHeight: 28,
                      color: "rgb(17, 17, 17)",
                    }}
                  >
                    Street {order?.streetAddress} , Apartment{" "}
                    {order?.apartmentNumber}{" "}
                    {order?.phone ? `, ${order?.phone}` : ""}
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
              <Text
                style={{
                  color: "#000",
                  fontSize: 15,
                  fontFamily: "Lato-SemiBold",
                }}
              >
                ORDER DETAILS
              </Text>
              <Text style={{fontSize: 12, fontFamily: "Lato-Regular", color: "#454545" }}>{formatDateTime(order?.createdAt)}</Text>
            </View>

            <DashedLine />

            {order?.orderItems?.map((item: any, index: number) => {
              return (
                <View style={styles.billContainer}>
                  <Text
                    style={{
                      color: "#5D5D5D",
                      fontSize: 13,
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text style={{}}>{item.price}</Text>
                </View>
              );
            })}
          </View>
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
