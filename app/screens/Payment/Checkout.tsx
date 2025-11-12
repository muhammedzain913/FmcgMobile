import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Header from "../../layout/Header";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants/theme";
import Button from "../../components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { ApiClient } from "../../redux/api";
import { useSelector } from "react-redux";
import { Url } from "../../redux/userConstant";
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from "../../redux/reducer/cartReducer";
const apiPath = ApiClient();

type CheckoutScreenProps = StackScreenProps<RootStackParamList, "Checkout">;

const Checkout = ({ navigation }: CheckoutScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [loading, setLoading] = useState<boolean>(false);
  const address = useSelector((x) => x?.user?.defaultAddress);
  const cartItems = useSelector((x) => x?.cart?.cart);

  const orderItems = cartItems.map((x: any) => {
    return {
      id: x.id,
      vendorId: x.vendorId,
      qty: x.quantity,
      salePrice: x.price,
      imageUrl: x.image,
      title: x.title,
    };
  });

  const handleSubmitOrder = () => {
    setLoading(true);
    console.log("cartItems", orderItems);
    try {
      const checkoutFormData = {
        ...address,
        paymentMethod: "Cash On Delivery",
        shippingCost: 0,
      };

      apiPath.post(`${Url}/api/orders`, { checkoutFormData, orderItems }, "");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const cart = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const totalPrice = useSelector(selectCartTotalPrice);

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Checkout" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[GlobalStyleSheet.container, { paddingTop: 10 }]}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              paddingBottom: 10,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                flex: 1,
              }}
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 10,
                  backgroundColor: colors.title,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: theme.dark ? COLORS.primary : colors.card,
                    resizeMode: "contain",
                  }}
                  source={IMAGES.home}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...FONTS.fontMedium,
                    fontSize: 16,
                    color: colors.title,
                  }}
                >
                  {address.city} , {address.pinCode}
                </Text>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 14,
                    color: colors.title,
                  }}
                >
                  {address.locality} , {address.streetAddress}
                </Text>
              </View>
            </View>
            <Ionicons color={colors.title} name="chevron-forward" size={20} />
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
              }}
            >
              Additional Notes:
            </Text>
            <TextInput
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
                paddingVertical: 12,
                paddingHorizontal: 15,
                height: 120,
                width: "100%",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                backgroundColor: colors.card,
                marginTop: 10,
              }}
              placeholder="Write Here"
              multiline
              placeholderTextColor={colors.text}
            />
          </View>

          {cartItems.map((x: any, index: number) => {
            return (
              <View style={{ marginTop: 150 }} key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      ...FONTS.fontRegular,
                      fontSize: 14,
                      color: colors.title,
                    }}
                  >
                    {x.title}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.fontRegular,
                      fontSize: 14,
                      color: colors.title,
                    }}
                  >
                    {x.quantity} x ${x.price}
                  </Text>
                </View>
              </View>
            );
          })}
          <View style={{}}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 14,
                  color: colors.title,
                }}
              >
                Shipping
              </Text>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 14,
                  color: COLORS.success,
                }}
              >
                FREE Delivery
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.dark ? COLORS.white : colors.borderColor,
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  ...FONTS.fontSemiBold,
                  fontSize: 18,
                  color: colors.title,
                }}
              >
                My Order
              </Text>
              <Text
                style={{
                  ...FONTS.fontSemiBold,
                  fontSize: 18,
                  color: COLORS.success,
                }}
              >
                ${totalPrice}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          GlobalStyleSheet.container,
          { paddingHorizontal: 0, paddingBottom: 0 },
        ]}
      >
        <View
          style={{
            height: 88,
            width: "100%",
            borderTopWidth: 1,
            borderTopColor: colors.border,
            justifyContent: "center",
            paddingHorizontal: 15,
          }}
        >
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <Button
              title="Submit Order"
              color={theme.dark ? COLORS.white : COLORS.primary}
              text={theme.dark ? COLORS.primary : COLORS.white}
              onPress={() => {
                handleSubmitOrder();
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Checkout;
