import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  RefreshControl,
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
import { formatDateTime } from "../../utils/formatDateTime";
import { subTotal } from "../../utils/subTotal";
import { generateSlug } from "../../utils/generateSlug";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button/Button";
import DashedLine from "../../components/Common/DashedLine";
import GroceryGifLoader from "../../components/loading/GroceryGifLoader";

type MyorderScreenProps = StackScreenProps<RootStackParamList, "Myorder">;



const Myorder = ({ navigation }: MyorderScreenProps) => {
  const apiPath = ApiClient();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const userInfo = useSelector((x: any) => x.user.userInfo);
  const id = useSelector((x: any) => x?.user?.userInfo?.id);
  const [orders, setOrders] = useState<any>();

  const dispatch = useDispatch();

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await apiPath.get(`${Url}/api/orders`);
      setOrders(response.data);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiPath]);

  // Fetch on mount (first time only)
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  const getSubTotal = (orderItems: any[]) => {
    return orderItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };


  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return "orange";
      case "SHIPPED":
        return "#1E123D";
      case "DELIVERED":
        return "green";
      default:
        return "black";
    }
  };

  useEffect(() => {
    console.log("orders", orders);
  }, [orders]);

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(250, 250, 250, 1)" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView 
        contentContainerStyle={{ gap: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1E123D"]}
            tintColor="#1E123D"
          />
        }
      >
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

            <View style={{ }}>
              <Text
                style={{
                  fontFamily: "Lato-SemiBold", // preferred if font file exists
                  fontSize: 20,
                  lineHeight: 32,
                  letterSpacing: -0.48, // -3% of 16px = -0.48
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                My Orders
              </Text>
            </View>
  
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, gap: 30 }}>
          <Text style={{ fontSize: 15, fontFamily: "Lato-SemiBold"}}>ACTIVE ORDERS</Text>
          {loading && orders === undefined ? null : error ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <Text style={{ color: "red", fontFamily: "Lato-Regular", fontSize: 14 }}>
                {error}
              </Text>
            </View>
          ) : !orders || orders.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <Text style={{ fontFamily: "Lato-Regular", fontSize: 16, color: "#454545" }}>
                No orders found
              </Text>
            </View>
          ) : (
            orders.map((item: any, index: number) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: "#fff",
                    paddingHorizontal: 10,
                    paddingTop: 35,
                    paddingBottom: 20,
                    gap: 15,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: getOrderStatusColor(item.orderStatus),
                      position: "absolute",
                      top: 0,
                      right: 0,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderTopRightRadius: 8,
                      borderBottomLeftRadius: 8,
                      
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12,fontFamily : 'Lato-SemiBold' }}>
                      {item.orderStatus === "SHIPPED" ? "ON THE WAY" : item.orderStatus}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ gap: 10 }}>
                      <Text style={{fontSize : 15,fontFamily : 'Lato-Bold'}}>ORDER DETAILS</Text>
                    </View>
                    <View style={{}}>
                      <Text style={{ fontSize: 12, fontFamily: "Lato-Regular", color: "#454545" }}>
                        {formatDateTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <DashedLine />

                  <View style={{ gap: 20 }}>
                    {item.orderItems.map((item: any, index: number) => {
                      return (
                        <View key={index}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontFamily: "Lato-Regular", fontSize: 16 }}>{item.title}</Text>
                          <Text style={{ fontFamily: "Lato-Regular", fontSize: 16 }}>{item.price}</Text>
                        </View>
                        </View>
                      );
                    })}
                  </View>

                  <Button
                    variant=""
                    onPress={() => {
                      if (item.orderStatus === "DELIVERED") {
                        navigation.navigate("GiveRating", {
                          order: item,
                        });
                      } else {
                        navigation.navigate("Trackorder", {
                          orderId: item.id,
                        });
                      }
                    }}
                    title={item.orderStatus === "DELIVERED" ? "Give Rating" : "Track Order"}
                    color={item.orderStatus === "DELIVERED" ? "#059B5D" : "#1E123D"}
                  ></Button>
                </View>
              </>
            );
            })
          )}
        </View>
      </ScrollView>
      <GroceryGifLoader visible={loading && orders === undefined} />
    </View>
  );
};

export default Myorder;
