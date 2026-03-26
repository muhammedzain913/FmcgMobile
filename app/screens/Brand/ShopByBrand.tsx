import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useSelector } from "react-redux";
import ProductGrid from "../../components/Category/ProductGrid";
import GroceryGifLoader from "../../components/loading/GroceryGifLoader";

type ShopByBrandScreenProps = StackScreenProps<
  RootStackParamList,
  "ShopByBrand"
>;

const ShopByBrand = ({ navigation, route }: ShopByBrandScreenProps) => {
  const apiPath = ApiClient();
  const addItemToCart = useAddToCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const brandId = route.params?.brandId;
  const brandFromParams = route.params?.brand;
  const [brandName, setBrandName] = useState<string>(
    brandFromParams?.name || "Brand",
  );

  // Get location from Redux
  const address = useSelector((x: any) => x.user.defaultAddress);

  useEffect(() => {
    console.log("Products for brand", products);
  }, [products]);

  useEffect(() => {
    // Set brand name from params if available
    if (brandFromParams?.name) {
      setBrandName(brandFromParams.name);
    }
  }, [brandFromParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (
        !brandId ||
        !address?.governorate?.id ||
        !address?.city?.id ||
        !address?.block?.id
      ) {
        setLoading(false);
        return;
      }

      try {
        console.log("fetching products for brand", brandId);
        setLoading(true);

        // Fetch products using brands API endpoint
        const response = await apiPath.get(
          `${Url}/api/brands/${brandId}/products?gov=${address.governorate.id}&city=${address.city.id}&block=${address.block.id}`,
        );
        console.log("brand products api", response.data);

        // Handle response structure
        if (response.data?.products) {
          console.log("products for brand", response.data.products);
          setProducts(response.data.products);
          // Update brand name from API response if available
          if (response.data?.brand?.name) {
            setBrandName(response.data.brand.name);
          }
        } else {
          setProducts(response.data || []);
        }
      } catch (error: any) {
        console.error("Error fetching brand products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [brandId, address]);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "white",
            paddingVertical: 30,
            gap: 20,
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View
                style={{
                  flexDirection: "row", // Flow: Horizontal
                  alignItems: "center", // Inner alignment
                  height: 36, // Fixed height // Padding
                  paddingVertical: 7.78,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#E5E5E5",
                  backgroundColor: "transparent",
                  width: 36,
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ height: 20, width: 15, marginTop: 4 }}
                  source={require("../../assets/images/icons/left-chevron.png")}
                />
              </View>
            </TouchableOpacity>
            <View
              pointerEvents="none"
              style={{ position: "absolute", left: 0, right: 0 }}
            >
              <Text
                style={{
                  fontFamily: "Lato", // preferred if font file exists
                  fontSize: 20,
                  lineHeight: 32,
                  letterSpacing: -0.48, // -3% of 16px = -0.48
                  color: "#000000",
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                {brandName}
              </Text>
            </View>
            <View></View>
          </View>
        </View>
        {loading ? null : products.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 16,
                color: "rgba(140, 140, 140, 1)",
              }}
            >
              No products found for this brand
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
            <ProductGrid
              productCardImageHeight={190}
              products={products}
              addToCart={addItemToCart}
              navigation={navigation}
            />
          </View>
        )}
      </ScrollView>
      <GroceryGifLoader visible={loading} />
    </View>
  );
};

export default ShopByBrand;
