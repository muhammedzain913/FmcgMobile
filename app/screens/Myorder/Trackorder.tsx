import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import Header from "../../layout/Header";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch } from "react-redux";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";

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

  const [order, setOrder] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          order?.orderStatus
        );

      case "ASSIGNED":
        return ["ASSIGNED", "ACCEPTED", "PICKED_UP", "DELIVERED"].includes(
          order?.deliveryAgentStatus
        );

      case "ACCEPTED":
        return [ "ACCEPTED", "PICKED_UP", "DELIVERED"].includes(
          order?.deliveryAgentStatus
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

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Track Order" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
          <View
            style={{
              marginHorizontal: -15,
            }}
          >
            {/* {TrackorderData.map((data:any, index) => {
                            return (
                                <View key={index}>
                                    <Cardstyle2
                                        key={index}
                                        title={data.title}
                                        price={data.price}
                                        delevery={data.delevery}
                                        image={data.image}
                                        offer={data.offer}
                                        removelikebtn
                                        onPress1={() => addItemToWishList(data)}
                                        onPress={() => navigation.navigate('ProductsDetails')}
                                    />
                                </View>
                            )
                        })} */}
          </View>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text
              style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title }}
            >
              Track Order
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Image
              style={{ height: 24, width: 24, resizeMode: "contain" }}
              source={IMAGES.check}
            />
            <View>
              <Text
                style={{ ...FONTS.fontMedium, fontSize: 16, color: "green" }}
              >
                Order Placed
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
                We have received your order
              </Text>
            </View>
            <View
              style={{
                height: isStepCompleted("CONFIRMED", order) ? 70 : 60,
                width: 2,
                backgroundColor: isStepCompleted("CONFIRMED", order)
                  ? "green"
                  : "grey",
                position: "absolute",
                left: 11,
                top: 33,
              }}
            ></View>
          </View>

          {renderOrderStatuses("Order Confirmed", "CONFIRMED")}
          {renderOrderStatuses("Finding A Delivery Partner", "ASSIGNED")}
          {renderOrderStatuses("Delivery Partner Assigned", "ACCEPTED")}
          {renderOrderStatuses("Out For Delivery", "OUT_FOR_DELIVERY")}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              marginTop: 40,
            }}
          >
            {isStepCompleted('DELIVERED', order) ? (
              <Image
                style={{ height: 24, width: 24, resizeMode: "contain" }}
                source={IMAGES.check}
              />
            ) : (
              renderNotCompleted()
            )}

            <View>
              <Text
                style={{
                  ...FONTS.fontMedium,
                  fontSize: 16,
                  color: isStepCompleted("DELIVERED", order)
                    ? "green"
                    : colors.title,
                }}
              >
                Delivered
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 14,
                    color: "rgba(0, 0, 0, 0.50)",
                  }}
                >
                  {" "}
                  31 Dec 2023
                </Text>
              </Text>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 14,
                  color: colors.title,
                }}
              >
                Your order is out for delivery
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Trackorder;
