import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import ProductCard from "../Product/ProductCard";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useSelector } from "react-redux";
import ProductGrid from "../../components/Category/ProductGrid";

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
        setLoading(true);

        // Fetch products using brands API endpoint
        const response = await apiPath.get(
          `${Url}/api/brands/${brandId}/products?gov=${address.governorate.id}&city=${address.city.id}&block=${address.block.id}`,
        );
        console.log("brand products api", response.data);

        // Handle response structure
        if (response.data?.products) {
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
    <View style={{ flex: 1, backgroundColor: "rgba(250, 250, 250, 1)" }}>
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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
                source={require("../../assets/images/icons/CaretLeft.png")}
              />
            </TouchableOpacity>
            <View style={{ position: "absolute", left: 0, right: 0 }}>
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

          <View>
            <View style={styles.searchBoxCotainer}>
              {/* Search Icon */}
              <Image
                source={require("../../assets/images/icons/searchiconimg.png")}
                style={styles.icon}
              />

              {/* Divider */}
              <View style={styles.searchBoxDivider} />

              {/* Text */}
              <Text style={styles.placeholder}>
                Search <Text style={styles.highlight}>"Snacks"</Text>
              </Text>
            </View>
          </View>
        </View>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 50,
            }}
          >
            <ActivityIndicator size="large" color="#1E123D" />
          </View>
        ) : products.length === 0 ? (
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
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <ProductGrid
              products={products}
              addToCart={addItemToCart}
              navigation={navigation}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ShopByBrand;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 500,
    backgroundColor: "#1E123D",
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1E123D",
    opacity: 0.85, // tweak: 0.8–0.9 for best match
  },

  content: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#000000",
    marginHorizontal: 12,
  },
  containerW: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
  gradientBorder: {
    borderRadius: 8,
    padding: 1, // border thickness = 1px
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 6, // Android shadow
  },

  searchBoxCotainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(220, 220, 220, 1)",
    borderWidth: 1,
  },

  icon: {
    width: 18,
    height: 18,
    tintColor: "black",
  },

  searchBoxDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#000000",
  },

  placeholder: {
    fontFamily: "Lato",
    fontSize: 15,
    color: "rgba(140, 140, 140, 1)",
  },

  highlight: {
    color: "#FFC107", // yellow "Snacks"
    fontWeight: "600",
  },

  filterText: {
    fontFamily: "Lato",
    fontSize: 15,
    color: "#000000",
  },
  filterContainer: {
    height: 38,
    flexDirection: "row",

    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: "rgba(240, 240, 240, 1)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDescription: {
    fontFamily: "Lato",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: -0.36, // -3% of 12px
    color: "rgba(0, 0, 0, 1)",
  },
});
