import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS } from "../../constants/theme";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import Button from "../../components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from "../../redux/reducer/cartReducer";
import { addTowishList } from "../../redux/reducer/wishListReducer";

type MyCartScreenProps = StackScreenProps<RootStackParamList, "MyCart">;

const MyCart = ({ navigation }: MyCartScreenProps) => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const cart = useSelector((state: any) => state.cart.cart);

  const removeItemFromCart = (data: any) => {
    dispatch(removeFromCart(data));
  };

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const totalQuantity = useSelector(selectCartTotalQuantity);
  const totalPrice = useSelector(selectCartTotalPrice);


  useEffect(() => {
    console.log('first item',cart[0])
  })

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="My Cart" leftIcon="back" rightIcon1={"search"} />
      {cart.length > 0 ? (
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBlockColor: colors.border,
            },
          ]}
        >
          <Text
            style={{ ...FONTS.fontRegular, fontSize: 18, color: colors.title }}
          >
            Subtotal
            <Text style={{ ...FONTS.fontBold, fontSize: 18 }}>
              {" "}
              {totalPrice}
            </Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 5,
            }}
          >
            <Image
              style={{ height: 23, width: 23, resizeMode: "contain" }}
              source={IMAGES.check}
            />
            <Text
              style={{ ...FONTS.fontMedium, fontSize: 15, color: "#CC0D39" }}
            >
              Your order is eligible for free Delivery
            </Text>
          </View>
        </View>
      ) : null}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
          {cart.map((data: any, index: any) => {
            return (
              <View key={index}>
                <Cardstyle2
                  id={data.id}
                  title={data.title}
                  price={data.price}
                  delevery={data.delevery}
                  image={data.image}
                  quantity={data.quantity}
                  onPress1={() => addItemToWishList(data)}
                  onPress2={() => removeItemFromCart(data)}
                  onPress={() => {
                    navigation.navigate("ProductsDetails", {
                      productId: data.slug,
                    });
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* <View style={GlobalStyleSheet.container}>
        <Button
          title={`Proceed to Buy (${totalQuantity} items)`}
          color={theme.dark ? COLORS.white : COLORS.primary}
          text={theme.dark ? COLORS.primary : COLORS.white}
          onPress={() => navigation.navigate("DeliveryLocation")}
        />
      </View> */}
      {cart.length > 0 ? (
        <View style={GlobalStyleSheet.container}>
          <Button
            title={`Proceed to Buy (${totalQuantity} items)`}
            color={theme.dark ? COLORS.white : COLORS.primary}
            text={theme.dark ? COLORS.primary : COLORS.white}
            onPress={() => navigation.navigate("DeleveryAddress")}
          />
        </View>
      ) : (
        <View style={[GlobalStyleSheet.container, { flexGrow: 1 }]}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.primaryLight,
                marginBottom: 20,
              }}
            >
              <Feather color={COLORS.primary} size={24} name="shopping-cart" />
            </View>
            <Text style={{ ...FONTS.h5, color: colors.title, marginBottom: 8 }}>
              Your shopping-cart is Empty!
            </Text>
            <Text
              style={{
                ...FONTS.fontSm,
                color: colors.text,
                textAlign: "center",
                paddingHorizontal: 40,
                //marginBottom:30,
              }}
            >
              Add Product to you favourite and shop now.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MyCart;
