import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Product } from "../../types/product";
import { NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  selectCartItemById,
} from "../../redux/reducer/cartReducer";
import { AppDispatch } from "../../redux/store";

type ProductCardProps = {
  product: Product;
  addToCart: (product: any) => void;
  navigation?: NavigationProp<RootStackParamList>; // Optional navigation prop
};

const ProductCard = React.memo(
  ({ product, addToCart, navigation }: ProductCardProps) => {
    const insets = useSafeAreaInsets();
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const cartItem = useSelector(selectCartItemById(product.id));

    const handleProductPress = () => {
      if (navigation) {
        console.log("Product ID", product.slug);
        navigation.navigate("ProductsDetails", {
          productId: product.slug,
        });
      } else {
        console.warn("Navigation not provided to ProductCard");
      }
    };

    return (
      <>
        <Pressable onPress={handleProductPress}>
          <Image
            source={require("../../assets/images/milmamilk.png")}
            style={{ height: 125, width: '100%' }}
          />
          {cartItem ? (
            <LinearGradient
              colors={["#34D399", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 2,
                position: "absolute",
                bottom: insets.bottom + 60,
                left: 15,
                right: 15,
                borderRadius: 8,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  dispatch(decrementQuantity({ id: product.id }));
                }}
              >
                <Text style={{ color: "#fff", fontSize: 22 }}>-</Text>
              </TouchableOpacity>
              <Text style={{ color: "#fff", fontSize: 22 }}>
                {cartItem.quantity}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(incrementQuantity({ id: product.id }));
                }}
              >
                <Text style={{ color: "#fff", fontSize: 22 }}>+</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                addToCart(product);
                setIsAdded(true);
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(5, 155, 93, 1)",
                  width: 32,
                  borderRadius: 8,
                  position: "absolute",
                  height: 32,
                  bottom: 0,
                  right: 0,
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/icons/plusicon.png")}
                />
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.itemDescription}>{product.title}</Text>
          <Text style={styles.itemDescription}>{product.unit} KG</Text>
          <Text
            style={{
              ...styles.itemDescription,
              fontSize: 15,
              fontWeight: "700",
              lineHeight: 24,
            }}
          >
            {product.salePrice}
          </Text>
        </Pressable>
      </>
    );
  },
);

export default ProductCard;

const styles = StyleSheet.create({
  itemDescription: {
    fontFamily: "Lato",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: -0.36, // -3% of 12px
    color: "rgba(0, 0, 0, 1)",
  },
});
