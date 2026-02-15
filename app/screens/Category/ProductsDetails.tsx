import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, LayoutAnimation } from "react-native";
import { IMAGES } from "../../constants/Images";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  selectCartItemById,
} from "../../redux/reducer/cartReducer";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { Url } from "../../redux/userConstant";
import { ApiClient } from "../../redux/api";
import { Product } from "../../types/product";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ProductCard from "../Product/ProductCard";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import SectionContainer from "../../components/Home/SectionContainer";
import SectionHeader from "../../components/Home/SectionHeader";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const apiPath = ApiClient();

const swiperimageData = [
  {
    image: IMAGES.product1,
    smallImage: IMAGES.product1,
  },
  {
    image: IMAGES.product2,
    smallImage: IMAGES.product2,
  },
  {
    image: IMAGES.product3,
    smallImage: IMAGES.product3,
  },
  {
    image: IMAGES.product4,
    smallImage: IMAGES.product4,
  },
];

type ProductsDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "ProductsDetails"
>;

const ProductsDetails = ({ navigation, route }: ProductsDetailsScreenProps) => {
  // const navagation = useNavigation();
  const productId = route.params?.productId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const productSizes = ["6.5", "7", "7.5", "8", "8.5", "9", "9.5"];

  const [activeSize, setActiveSize] = useState(productSizes[0]);

  const [product, setproduct] = useState<Product | null>(null);

  const productColors = ["#BAA488", "#5F75C5", "#C58F5E", "#919191"];

  const [activeColor, setActiveColor] = useState(productColors[0]);

  const isStockExist = product?.productStock ?? 0 > 0;

  const [currentSlide, setCurrentSlide] = useState(0);

  const [show, setshow] = useState(false);

  const dispatch = useDispatch();

  const TABS = ["Description", "Ingredients", "How To Consume"];
  const [activeTab, setActiveTab] = useState("Description");
  const [expanded, setExpanded] = useState(false);

  const cartItem = useSelector(selectCartItemById(product?.id || ""));

  useEffect(() => {
    console.log("is there in the cart", cartItem, productId);
    const fetchProduct = async () => {
      try {
        const response = await apiPath.get(
          `${Url}/api/products/product/${productId}`,
        );
        console.log("banner api", response.data);
        setproduct(response.data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const addItemToWishList = () => {
    const selectedImage = swiperimageData[currentSlide].image;

    dispatch(
      addTowishList({
        image: product?.imageUrl,
        title: product?.title,
        price: product?.salePrice,
        color: false,
        hascolor: true,
      } as any),
    );
  };

  const DUMMY_PRODUCTS = [
    {
      id: "1",
      title: "Cheese",
      unit: "1 KG",
      price: 40,
    },
    {
      id: "2",
      title: "Butter",
      unit: "1 KG",
      price: 20,
    },
    {
      id: "3",
      title: "Milk",
      unit: "1 KG",
      price: 40,
    },
    {
      id: "4",
      title: "Cheese",
      unit: "1 KG",
      price: 40,
    },
    {
      id: "5",
      title: "Butter",
      unit: "1 KG",
      price: 20,
    },
  ];

  const productDetails = {
    Description:
      "Lorem ipsum dolor sit amet consectetur. Quam diam elementum lacus vulputate tortor rhoncus at. Nulla sit a dictum tellus sit ac amet diam. Vestibulum fringilla arcu nullam at sagittis. At vitae dolor quisque vivamus et maecenas ut. Lectus vel fermentum tempor laoreet phasellus. Neque imperdiet pharetra vestibulum ut sit eu cras ultricies. In sit eget habitant pharetra sagittis sed senectus egestas. Quam vel ut eget ultricies non in phasellus mauris.Ut risus egestas enim cursus odio adipiscing. Nisl suscipit l",
    Ingredients: "Milk solids, sugar, stabilizers, natural flavors...",
    "How To Consume": "Consume directly or refrigerate before use...",
  };

  const descriptionText =
    "Lorem ipsum dolor sit amet consectetur. Quam diam elementum lacus vulputate tortor rhoncus at. Nulla sit a dictum tellus sit ac amet diam. Vestibulum fringilla arcu nullam at sagittis. At vitae dolor quisque vivamus et maecenas ut. Lectus vel fermentum tempor laoreet phasellus. Neque imperdiet pharetra vestibulum ut sit eu cras ultricies. In sit eget habitant pharetra sagittis sed senectus egestas. Quam vel ut eget ultricies non in phasellus mauris.Ut risus egestas enim cursus odio adipiscing. Nisl suscipit l Lorem ipsum dolor sit amet consectetur. Quam diam elementum lacus vulputate tortor rhoncus at. Nulla sit a dictum tellus sit ac amet diam. Vestibulum fringilla arcu nullam at sagittis. At vitae dolor quisque vivamus et maecenas ut. Lectus vel fermentum tempor laoreet phasellus. Neque imperdiet pharetra vestibulum ut sit eu cras ultricies. In sit eget habitant pharetra sagittis sed senectus egestas. Quam vel ut eget ultricies non in phasellus mauris.Ut risus egestas enim cursus odio adipiscing. Nisl suscipit l";

  const [textExceeds, setTextExceeds] = useState(false);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        flex: 1,
      }}
    >
      <StatusBar translucent={true} backgroundColor="rgba(245, 245, 245, 1)" />
      <ScrollView>
        <View style={styles.imageSection}>
          {/* Header icons */}
          <View style={styles.topIcons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.icon}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../assets/images/icons/left-chevron.png")}
              />
            </TouchableOpacity>

            <View style={styles.icon}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../assets/images/icons/share.png")}
              />
            </View>
          </View>

          {/* PRODUCT IMAGE */}
          <Image
            source={{ uri: product?.imageUrl }}
            // resizeMode="contain"
            style={styles.productImage}
          />
        </View>

        <View style={{ paddingHorizontal: 20, gap: 20 }}>
          <View
            style={{
              gap: 10,
              marginTop: 20,
              paddingHorizontal: 15,
              paddingVertical: 20,
              backgroundColor: "#fff",
              shadowColor: "rgba(3, 0, 0, 0.25)",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 25,
              elevation: 8,
              borderRadius: 8,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={styles.categoryText}>
                  {product?.category.title}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Image
                  style={{ width: 14, height: 14 }}
                  source={require("../../assets/images/icons/ratingstar.png")}
                />
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 12,
                    color: "orange",
                  }}
                >
                  4.5
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Lato-Regular",
                    color: "#8C8C8C",
                  }}
                >
                  (11.5k)
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.productTitleText}>{product?.title}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.categoryText}>Quantity : </Text>{" "}
              <Text
                style={{ ...styles.categoryText, fontFamily: "Lato-SemiBold" }}
              >
                {product?.unit}
              </Text>
            </View>

            <View style={{ gap: 20 }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={styles.offerContainer}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#000000",
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    {product?.unit} Kg
                  </Text>
                  <View style={GlobalStyleSheet.priceContainer}>
                    <Text style={GlobalStyleSheet.salePrice}>
                      KD {product?.salePrice}
                    </Text>
                    <Text style={GlobalStyleSheet.originalPrice}>
                      KD {product?.salePrice}
                    </Text>
                  </View>
                  <Text style={GlobalStyleSheet.discountBadge}> 50% OFF</Text>
                </View>

                <View
                  style={{
                    ...styles.offerContainer,
                    borderColor: "#F0F0F0",
                    backgroundColor: "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#000000",
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    {product?.unit} Kg
                  </Text>
                  <View style={GlobalStyleSheet.priceContainer}>
                    <Text style={GlobalStyleSheet.salePrice}>
                      KD {product?.salePrice}
                    </Text>
                    <Text style={GlobalStyleSheet.originalPrice}>
                      KD {product?.salePrice}
                    </Text>
                  </View>
                  <Text style={GlobalStyleSheet.discountBadge}> 50% OFF</Text>
                </View>

                <View
                  style={{
                    ...styles.offerContainer,
                    borderColor: "#F0F0F0",
                    backgroundColor: "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#000000",
                      fontFamily: "Lato-Regular",
                    }}
                  >
                    {product?.unit} Kg
                  </Text>
                  <View style={GlobalStyleSheet.priceContainer}>
                    <Text style={GlobalStyleSheet.salePrice}>
                      KD {product?.salePrice}
                    </Text>
                    <Text style={GlobalStyleSheet.originalPrice}>
                      KD {product?.salePrice}
                    </Text>
                  </View>
                  <Text style={GlobalStyleSheet.discountBadge}> 50% OFF</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    ...styles.itemDescription,
                    fontFamily: "Lato-Bold",
                    fontSize: 15,
                  }}
                >
                  KD {product?.salePrice}
                </Text>
                <Text
                  style={{
                    ...styles.itemDescription,
                    fontFamily: "Lato-Medium",
                    fontSize: 15,
                    color: "#8C8C8C",
                    textDecorationLine: "line-through",
                  }}
                >
                  KD {product?.salePrice}
                </Text>

                <Text
                  style={{
                    ...styles.itemDescription,
                    color: "#008A19",
                    fontFamily: "Lato-SemiBold",
                  }}
                >
                  50% OFF
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              ...styles.descriptionContainer,
              flexDirection: "row",
              justifyContent: "space-between",
              // gap: 20,
            }}
          >
            <View style={styles.productQualityContainer}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../../assets/images/customer-review.png")}
              />

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.productQualityText}>10 Thousand + </Text>
                <Text style={styles.productQualityText}>Happy Customers</Text>
              </View>
            </View>
            <View style={styles.productQualityContainer}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../../assets/images/protect.png")}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.productQualityText}>Fast </Text>
                <Text style={styles.productQualityText}>Delivery</Text>
              </View>
            </View>
            <View style={styles.productQualityContainer}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../../assets/images/badge.png")}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.productQualityText}>Quality </Text>
                <Text style={styles.productQualityText}>Checked</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              shadowColor: "rgba(3, 0, 0, 0.25)",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 25,
              elevation: 8,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
            >
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => {
                    setActiveTab(tab);
                    setExpanded(false); // reset when switching tabs
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily:
                        activeTab === tab ? "Lato-Bold" : "Lato-SemiBold",
                      color: activeTab === tab ? "#0E8A4A" : "#9A9A9A",
                      borderBottomWidth: activeTab === tab ? 2 : 0,
                      borderBottomColor: "#0E8A4A",
                      paddingBottom: 6,
                    }}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text
              style={{
                marginTop: 12,
                color: "#4A4A4A",
                lineHeight: 20,
              }}
              numberOfLines={expanded ? undefined : 7}
              onTextLayout={(e) => {
                if (e.nativeEvent.lines.length > 7) {
                  setTextExceeds(true);
                }
              }}
            >
              {descriptionText}
            </Text>

            {textExceeds && (
              <TouchableOpacity
                onPress={() => {
                  (setExpanded((prev) => !prev),
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    ));
                }}
                style={{
                  marginTop: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "500" }}>
                  {expanded ? "Show Less" : "Show More"}
                </Text>

                <Text style={{ marginLeft: 4, color: "#0E8A4A" }}>
                  {expanded ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <SectionContainer>
          <SectionHeader
            title="SIMILAR PRODUCTS"
            showViewAll={true}
            onViewAllPress={() => {
              navigation.navigate("ShopByBrand");
            }}
          />
          <ScrollView
            contentContainerStyle={{
              gap: 15,
              flexDirection: "row",
              marginTop: 20,
              paddingRight: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {DUMMY_PRODUCTS?.map((data: any) => {
              return (
                <ProductCard
                  key={data.id || data.slug}
                  addToCart={() => {}}
                  product={data}
                  navigation={navigation}
                  containerStyle={{
                    width: wp("38%"),
                    minWidth: 140,
                    maxWidth: 180,
                  }}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>
      </ScrollView>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 1)",
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
          <LinearGradient
            style={{
              width: 170,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              flexBasis: "45%",
            }}
            colors={["rgba(5, 155, 93, 1)", "rgba(2, 53, 32, 1)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            {cartItem ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity style={{marginTop : 10}} onPress={() => {incrementQuantity()}}>
                  <Image
                    style={{ width: 10, height: 10 }}
                    source={require("../../assets/images/icons/subtract.png")}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 22,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  {cartItem.quantity}
                </Text>
                <TouchableOpacity>
                  <Image
                    style={{ width: 10, height: 15 }}
                    source={require("../../assets/images/icons/add.png")}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (product) {
                    dispatch(
                      addToCart({
                        id: product.id,
                        image: product.imageUrl,
                        title: product.title,
                        price: product?.salePrice,
                        slug: product.slug,
                        color: false,
                        hascolor: false,
                        vendorId: product.userId,
                      } as any),
                    );
                  }
                }}
                style={{ width: "100%", alignItems: "center" }}
              >
                <Text style={styles.addToCartText}>Add To Cart +</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>

          <View
            style={{
              width: 170,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(30, 18, 61, 1)",
              borderRadius: 8,
              flexBasis: "45%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MyCart");
              }}
            >
              <Text style={styles.addToCartText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductsDetails;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 1)",
    height: 40,
    width: 40,
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: "grey",
  },
  categoryText: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    lineHeight: 25,
    letterSpacing: -0.39, // -3% of 13px
    color: "#595959",
  },
  productTitleText: {
    fontFamily: "Lato-Bold",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.54, // -3% of 18px
    color: "#000000",
  },
  offerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#059B5D",
    gap: 10,
    padding: 10,
    width: "32%",
    backgroundColor: "rgba(5, 155, 93, 0.03)",
  },

  addToCartText: {
    color: "#ffff",
    fontSize: 17,
    fontFamily: "Lato-SemiBold",
  },
  descriptionContainer: {
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: "rgba(3, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 8,
    borderRadius: 8,
  },

  productQualityContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "33%",
    gap: 10,
  },
  productQualityText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
  },
  imageSection: {
    height: 370, // 👈 controls how “big” the image area feels
    backgroundColor: "rgba(245, 245, 245, 1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: 320, // 👈 image size (smaller than container)
  },

  topIcons: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(217,217,217,1)",
    padding: 8,
    justifyContent : 'center',
    alignItems : 'center'
  },
  itemDescription: {
    fontFamily: "Lato-Medium",
    fontSize: 15,
    lineHeight: 16,
    letterSpacing: -0.36, // -3% of 12px
    color: "rgba(0, 0, 0, 1)",
  },
});
