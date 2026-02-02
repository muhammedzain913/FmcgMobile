import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { FlashList } from "@shopify/flash-list";
import ProductCard from "../Product/ProductCard";

type CategoriesScreenProps = StackScreenProps<RootStackParamList, "Categories">;

const Categories = ({ navigation }: CategoriesScreenProps) => {
  const apiPath = ApiClient();
  const [products, setProducts] = useState<[]>();
  const address = useSelector((x: any) => x.user.defaultAddress);
  const [categories, setCategories] = useState<[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [displayedProducts, setDisplayedProducts] = useState<any[]>();
  const [dealCategory, setDealCategory] = useState<any>();
  const [dealCategoryProducts, setDealCategoryProducts] = useState<any[]>();
  const [searchQuery, setSearchQuety] = useState<string>("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/categories`);
        console.log("category api", response.data);
        setCategories(response.data);
        const dealCategory = response.data.find((x: any) => x.title === "Deal");
        // setDealCategory(dealCategory);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (!address) return;
    if (!address.governorate) return;
    const fetchProducts = async () => {
      try {
        const response = await apiPath.get(
          `${Url}/api/products?gov=${address.governorate.name}&city=${address.city.name}&block=${address.block.name}&search =${searchQuery}`,
        );
        console.log("product api", response.data.length);
        setProducts(response.data);
        setDisplayedProducts(response.data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const handleCategoryChange = (categoryId?: string) => {
    console.log("ID", categoryId);
    if (categoryId === undefined) {
      setDisplayedProducts(products);
      return;
    }
    const productsOfCategoryById = products?.filter(
      (p: any) => p.category.id === categoryId,
    );

    console.log("filtered", productsOfCategoryById);
    setDisplayedProducts(productsOfCategoryById);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1, gap: 30 }}>
        <View style={{ gap: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <View
              style={{
                flexDirection: "row", // Flow: Horizontal
                alignItems: "center", // Inner alignment
                height: 40, // Fixed height
                paddingHorizontal: 15, // Padding
                paddingVertical: 7.78,
                borderRadius: 8,
                borderWidth: 1,

                borderColor: "rgba(220, 220, 220, 1)",
                backgroundColor: "rgba(255, 255, 255, 0.6)", // Required for blur effect
              }}
            >
              <Image
                style={{ height: 20, width: 15, marginTop: 4 }}
                source={require("../../assets/images/icons/CaretLeft.png")}
              />
            </View>
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
              Categories
            </Text>
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

        <View style={{ flexDirection: "row" , flex :1}}>
          <View style={{flexBasis : '30%',paddingHorizontal : 10}}>
            <ScrollView>
              {categories?.map((item: any, index: number) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(item.title);
                      handleCategoryChange(item.id);
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        marginBottom: 20,
                        width: 60,
                        alignItems: "center",
                      }}
                      key={index}
                    >
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 40,
                          marginBottom: 10,
                        }}
                      />
                      <Text
                        style={{ fontSize: 13, color: "rgba(89, 89, 89, 1)" }}
                      >
                        {item.title}
                      </Text>
                      ;
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={{ gap: 10, flex : 1}}>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  gap: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <View style={styles.filterContainer}>
                  <Text style={styles.filterText}>Filter</Text>
                  <Image
                    source={require("../../assets/images/icons/CaretDown.png")}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                      marginTop: 3,
                    }}
                  />
                </View>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterText}>Sort</Text>
                  <Image
                    source={require("../../assets/images/icons/CaretDown.png")}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                      marginTop: 3,
                    }}
                  />
                </View>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterText}>Price</Text>
                  <Image
                    source={require("../../assets/images/icons/CaretDown.png")}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                      marginTop: 3,
                    }}
                  />
                </View>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterText}>Brand</Text>
                  <Image
                    source={require("../../assets/images/icons/CaretDown.png")}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                      marginTop: 3,
                    }}
                  />
                </View>
              </ScrollView>
            </View>
            {/* <View
              style={{
                flexDirection: "row",
              }}
            > */}
            <View style={{flex :1 }}>
              <FlashList
                data={displayedProducts}
                showsVerticalScrollIndicator = {false}
                numColumns={2}
                renderItem={({ item }) => <ProductCard product={item} />}
              />
            </View>
            {/* </View> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Categories;

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
