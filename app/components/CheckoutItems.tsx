import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useDispatch } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../redux/reducer/cartReducer";

type Props = {
  quantity: number;
  productId : string
};

const CheckoutItems = ({ quantity,productId }: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const dispatch = useDispatch();

  const [itemQuantity, setItemQuantity] = useState(20);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => dispatch(decrementQuantity({id : productId}))}
        style={{
          height: 30,
          width: 30,
          backgroundColor: theme.dark ? "rgba(255,255,255,0.10)" : "#DCDCDC",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather size={16} color={colors.title} name="minus" />
      </TouchableOpacity>
      <Text
        style={{
          ...FONTS.fontMedium,
          fontSize: 14,
          color: colors.title,
          width: 40,
          textAlign: "center",
        }}
      >
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={() => dispatch(incrementQuantity({id : productId}))}
        style={{
          height: 30,
          width: 30,
          backgroundColor: theme.dark ? "rgba(255,255,255,0.10)" : "#DCDCDC",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather size={16} color={colors.title} name="plus" />
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutItems;
