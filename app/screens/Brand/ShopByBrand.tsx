import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import ProductCard from "../Product/ProductCard";

type ShopByBrandScreenProps = StackScreenProps<
  RootStackParamList,
  "ShopByBrand"
>;

const ShopByBrand = ({ navigation }: ShopByBrandScreenProps) => {
  const apiPath = ApiClient();
  const [products, setProducts] = useState<[]>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/products`);
        console.log("product api", response.data.length);
        setProducts(response.data);
      } catch (error: any) {
        // setError(error.message || "Something went wrong");
      } finally {
        // setLoading(false);
      }
    };
    fetchProducts();
  }, []);
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
            <View
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
            </View>
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
                Milmna
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
                <FlatList
            data={products}
            keyExtractor={(item: any) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
            columnWrapperStyle={{
              // justifyContent: "space-between",
              gap: 20,
              marginBottom: 20,
            }}
            renderItem={({ item }) => (
              <View style={{width : '45%'}}>
              <ProductCard product={item} addToCart={() => {}} />
                </View>
            )}
          />
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
