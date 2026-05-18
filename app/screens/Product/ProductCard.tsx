import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Product, Variant } from "../../types/product";
import { NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  selectCartItemById,
} from "../../redux/reducer/cartReducer";
import { AppDispatch } from "../../redux/store";
import { calculateDiscountPercentage } from "../../utils/calculateDiscountPercentage";

type ProductCardProps = {
  product: Product;
  addToCart: (product: any, selectedVariant: Variant) => void;

  navigation?: NavigationProp<RootStackParamList>; // Optional navigation prop
  containerStyle?: object; // Optional style for the outer container
  imageContainerHeight?: number; // Optional: override image container height
};

const ProductCard = React.memo(
  ({
    product,
    addToCart,
    navigation,
    containerStyle,
    imageContainerHeight,
  }: ProductCardProps) => {
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const bestVariantObj: any = (product as any)?.bestVariant || null;
    const bestVariantId = (product as any)?.bestVariantId || bestVariantObj?.id;
    // Build a synthetic variant from flat product fields when no variant array exists
    const flatVariant: any =
      (product as any).salePrice != null || (product as any).price != null
        ? {
            id: undefined,
            salePrice: (product as any).salePrice,
            price: (product as any).price ?? (product as any).salePrice,
            quantity: (product as any).quantity,
            unit: product.unit,
            productStock: (product as any).productStock ?? 0,
            productId: product.id,
          }
        : null;
    const selectedVariant: Variant | null =
      (bestVariantId
        ? product?.variants?.find((variant) => String(variant?.id) === String(bestVariantId))
        : null) ||
      product?.variants?.[0] ||
      bestVariantObj ||
      flatVariant ||
      null;
    const dispatch = useDispatch<AppDispatch>();
    const cartItem = useSelector(selectCartItemById(product.id));

    const handleProductPress = () => {
      console.log("product card pressed");
      if (navigation) {
        const productId = product?.slug || String(product?.id || "");
        if (!productId) {
          console.warn("Product navigation skipped: missing slug/id", product);
          return;
        }
        console.log("Product ID", productId);
        navigation.navigate("ProductsDetails", {
          productId,
        });
      } else {
        console.warn("Navigation not provided to ProductCard");
      }
    };

    const triggerTouchFeedback = () => {
      // Subtle vibration to give tactile feedback on cart actions.
      Vibration.vibrate(5);
    };


    useEffect(() => {
      console.log("product in product card", product);
    }, [product]);
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.95}
        delayPressIn={0}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        pressRetentionOffset={{ top: 24, bottom: 24, left: 24, right: 24 }}
        onPress={handleProductPress}
      >
        <View style={[{ width: "100%" }, containerStyle]}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#F1F1F1",
              backgroundColor: "#FFFFFF",
              padding: 10,
              width: "100%",
              height: imageContainerHeight ?? 150,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: product.imageUrl }}
              style={{ height: "100%", width: "100%" }}
              resizeMode= "contain"
            />
            {cartItem ? (
              <LinearGradient
                colors={["#059B5D", "#023520"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="box-none"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  position: "absolute",
                  bottom: 5,
                  left: 30,
                  right: 5,
                  borderRadius: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Pressable
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPressIn={() => {
                    triggerTouchFeedback();
                    dispatch(decrementQuantity({ id: product.id } as any));
                  }}
                >
                  <Ionicons name="remove" size={14} color="#fff" />
                </Pressable>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  {cartItem?.quantity}
                </Text>
                <View>
                  <Pressable
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPressIn={() => {
                      triggerTouchFeedback();
                      dispatch(incrementQuantity({ id: product.id } as any));
                    }}
                  >
                    <Ionicons name="add" size={14} color="#fff" />
                  </Pressable>
                </View>
              </LinearGradient>
            ) : (
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  padding: 5,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
                onPress={() => {
                  triggerTouchFeedback();
                  if (selectedVariant) {
                    addToCart(product, selectedVariant);
                    setIsAdded(true);
                  }
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#059B5D",
                    width: 32,
                    borderRadius: 8,
                    height: 32,
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="add" size={18} color="#059B5D" />
                </View>
              </Pressable>
            )}
          </View>

          <View style={{ marginTop: 8, gap: 4, alignItems: "flex-start" }}>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Ionicons name="star" size={13} color="orange" />
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 12,
                  color: "orange",
                }}
              >
                {product.averageRating}
              </Text>
            </View>
            <Text
              style={styles.itemDescription}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {product.title}
            </Text>
            {(selectedVariant?.quantity != null || product.unit) && (
              <Text style={styles.itemDescription}>
                {selectedVariant?.quantity != null ? `${selectedVariant.quantity} ` : ""}
                {selectedVariant?.unit || product.unit}
              </Text>
            )}
            {selectedVariant?.price != null &&
              selectedVariant?.salePrice != null &&
              selectedVariant.price > selectedVariant.salePrice && (
              <Text
                style={{
                  ...styles.itemDescription,
                  color: "#008A19",
                  fontFamily: "Lato-SemiBold",
                }}
              >
                {calculateDiscountPercentage(
                  selectedVariant.price,
                  selectedVariant.salePrice,
                )}
                % OFF
              </Text>
            )}
            {selectedVariant?.salePrice != null && (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    ...styles.itemDescription,
                    fontFamily: "Lato-Bold",
                    fontSize: 14,
                  }}
                >
                  KD {selectedVariant.salePrice}
                </Text>

                {selectedVariant.price != null &&
                  selectedVariant.salePrice < selectedVariant.price && (
                  <Text
                    style={{
                      ...styles.itemDescription,
                      fontFamily: "Lato-Medium",
                      fontSize: 14,
                      color: "#8C8C8C",
                      textDecorationLine: "line-through",
                    }}
                  >
                    KD {selectedVariant.price}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export default ProductCard;

const styles = StyleSheet.create({
  itemDescription: {
    fontFamily: "Lato-Medium",
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.36, // -3% of 12px
    color: "rgba(0, 0, 0, 1)",
  },
});
