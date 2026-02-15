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
  containerStyle?: object; // Optional style for the outer container
};

const ProductCard = React.memo(
  ({ product, addToCart, navigation, containerStyle }: ProductCardProps) => {
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
      <View style={[{ width: "100%" }, containerStyle]}>
        <Pressable style={{ flex: 1 }} onPress={handleProductPress}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#F5F5F5",
              backgroundColor: "#FFFFFF",
              padding: 10,
              width: "100%",
              height: 150,
              overflow: "hidden",
            }}
          >
            <Image
              source={require("../../assets/images/milmamilk.png")}
              style={{ height: "100%", width: "100%" }}
              resizeMode="cover"
            />
            {cartItem ? (
              <LinearGradient
                colors={["#059B5D", "#023520"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
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
                <View style={{ marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      dispatch(decrementQuantity({ id: product.id }));
                    }}
                  >
                    <Image
                      style={{ width: 10, height: 10 }}
                      source={require("../../assets/images/icons/subtract.png")}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  {cartItem.quantity}
                </Text>
                <View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      dispatch(incrementQuantity({ id: product.id }));
                    }}
                  >
                    <Image
                      style={{ width: 10, height: 15 }}
                      source={require("../../assets/images/icons/add.png")}
                    />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                style={{
                  padding: 5,
                  position: "absolute",
                  // top: 0,
                  bottom: 0,
                  right: 0,
                }}
                onPress={(e) => {
                  addToCart(product);
                  setIsAdded(true);
                  e.stopPropagation();
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
                  <Image
                    style={{width : 15,height : 15}}
                    source={require("../../assets/images/icons/plusgreen.png")}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ marginTop: 8, gap: 4 , alignItems : 'flex-start'}}>
            <View style={{flexDirection : 'row', gap :5,alignItems : 'center'}}>
              <Image style={{width : 14,height : 14}} source={require('../../assets/images/icons/ratingstar.png')}/>
              <Text style={{fontFamily :'Lato-Regular', fontSize : 12,color : 'orange'}}>4.5</Text>
            </View>
            <Text
              style={styles.itemDescription}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {product.title}
            </Text>
            <Text style={styles.itemDescription}>{product.unit} KG</Text>
            <Text style={{...styles.itemDescription,color : '#008A19',fontFamily : 'Lato-SemiBold'}}> 50% OFF</Text>
            <View style={{ flexDirection: "row",gap : 10 }}>
              <Text
                style={{
                  ...styles.itemDescription,
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                }}
              >
                KD {product.salePrice}
              </Text>
              <Text
                style={{
                  ...styles.itemDescription,
                  fontFamily: "Lato-Medium",
                  fontSize: 14,
                  color : '#8C8C8C',
                  textDecorationLine : 'line-through'
                }}
              >
                KD {product.salePrice}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
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
