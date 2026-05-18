import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  LayoutAnimation,
  useWindowDimensions,
  ScrollView,
  Share,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartItemById,
} from "../../redux/reducer/cartReducer";
import { Url } from "../../redux/userConstant";
import { ApiClient } from "../../redux/api";
import { Product, Variant } from "../../types/product";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import SectionContainer from "../../components/Home/SectionContainer";
import SectionHeader from "../../components/Home/SectionHeader";
import { calculateDiscountPercentage } from "../../utils/calculateDiscountPercentage";
import { useAddToCart } from "../../hooks/useAddToCart";
import GroceryGifLoader from "../../components/loading/GroceryGifLoader";

const apiPath = ApiClient();

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
  const cartItem = useSelector(selectCartItemById(product?.id || ""));
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const productColors = ["#BAA488", "#5F75C5", "#C58F5E", "#919191"];

  const [activeColor, setActiveColor] = useState(productColors[0]);

  // const isStockExist = product?.productStock ?? 0 > 0;

  const [currentSlide, setCurrentSlide] = useState(0);
  const galleryPagerRef = useRef<PagerView>(null);
  const { width: windowWidth } = useWindowDimensions();

  const galleryUrls = useMemo(() => {
    if (!product) return [];
    const raw = (product as any).productImages;
    const urls: string[] = [];
    if (Array.isArray(raw)) {
      for (const item of raw) {
        const u =
          typeof item === "string"
            ? item
            : item?.url ?? item?.imageUrl ?? item?.src;
        if (u && typeof u === "string" && u.trim()) {
          urls.push(u.trim());
        }
      }
    }
    const seen = new Set<string>();
    const unique = urls.filter((u) => (seen.has(u) ? false : (seen.add(u), true)));
    if (unique.length > 0) {
      return unique;
    }
    if (product.imageUrl?.trim()) {
      return [product.imageUrl.trim()];
    }
    return [];
  }, [product]);

  useEffect(() => {
    setCurrentSlide(0);
    galleryPagerRef.current?.setPage(0);
  }, [product?.id]);

  const [show, setshow] = useState(false);

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("");
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({});
  const [tabLineCount, setTabLineCount] = useState<Record<string, number>>({});
  const [hasUserSelectedVariant, setHasUserSelectedVariant] = useState(false);



  useEffect(() => {
    if (!product?.id) return;
    // New product details screen instance: allow initialization from cart/default.
    setHasUserSelectedVariant(false);
  }, [product?.id]);

  useEffect(() => {
    // On open/reopen, highlight cart variant if present; otherwise first variant.
    // After user manually taps a variant, do not auto-override their selection.
    if (!product?.variants?.length || hasUserSelectedVariant) return;

    const variantFromCart = cartItem?.variantId
      ? product.variants.find(
          (variant) => String(variant.id) === String(cartItem.variantId),
        )
      : null;

    setSelectedVariant(variantFromCart || product.variants[0]);
  }, [product, cartItem?.variantId, hasUserSelectedVariant]);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiPath.get(
          `${Url}/api/products/product/${productId}`,
        );
        if (cancelled) return;
        const productData = response.data?.data || response.data;
        console.log("product data images", productData.productImages);
        setproduct(productData);
      } catch (error: any) {
        if (!cancelled) {
          setError(error.message || "Something went wrong");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [productId]);



  const productDetailsTabs = [
    {
      key: "Description",
      value: (product as any)?.description,
    },
    {
      key: "Ingredients",
      value:
        (product as any)?.ingredients ??
        (product as any)?.ingredient ??
        (product as any)?.ingredientsText,
    },
  ].filter((tab) => String(tab.value ?? "").trim().length > 0);

  const activeTabContent =
    productDetailsTabs.find((tab) => tab.key === activeTab)?.value ?? "";

  useEffect(() => {
    if (!productDetailsTabs.length) {
      setActiveTab("");
      return;
    }
    if (!activeTab || !productDetailsTabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(productDetailsTabs[0].key);
    }
  }, [product, activeTab, productDetailsTabs]);

  const isExpanded = expandedTabs[activeTab] ?? false;
  const textExceeds = (tabLineCount[activeTab] ?? 0) > 7;
  const addItemToCart = useAddToCart();

  return (
    <SafeAreaView
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        flex: 1,
      }}
    >
      <StatusBar translucent={true} backgroundColor="rgba(245, 245, 245, 1)" />
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSection}>
          <View style={styles.topIcons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.icon}
            >
              <Ionicons name="chevron-back" size={22} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icon}
              onPress={async () => {
                try {
                  await Share.share({
                    title: product?.title ?? "Check out this product",
                    message: product?.title
                      ? `Check out ${product.title} on Sooper!`
                      : "Check out this product on Sooper!",
                  });
                } catch (_) {}
              }}
            >
              <Ionicons name="share-social-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
          {galleryUrls.length > 0 ? (
            <>
              <PagerView
                ref={galleryPagerRef}
                key={product?.id ?? "gallery"}
                style={{ width: windowWidth, height: 320 }}
                initialPage={0}
                offscreenPageLimit={2}
                onPageSelected={(e) => {
                  setCurrentSlide(e.nativeEvent.position);
                }}
              >
                {galleryUrls.map((uri, index) => (
                  <View
                    key={`${uri}-${index}`}
                    collapsable={false}
                    style={{
                      width: windowWidth,
                      height: 320,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri }}
                      style={[styles.productImage, { width: windowWidth }]}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </PagerView>
              {galleryUrls.length > 1 ? (
                <View style={styles.dotsRow}>
                  {galleryUrls.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        i === currentSlide && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              ) : null}
            </>
          ) : (
            <View
              style={[styles.productImage, { width: windowWidth }]}
            />
          )}
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
                  {product?.subCategory.title}
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
                <Ionicons name="star" size={14} color="orange" />
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 12,
                    color: "orange",
                  }}
                >
                  {product?.averageRating}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Lato-Regular",
                    color: "#8C8C8C",
                  }}
                >
                  ({product?.ratingCount})
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.productTitleText}>{product?.title}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={styles.categoryText}>Quantity :</Text>
              <Text style={{ ...styles.categoryText, fontFamily: "Lato-SemiBold" }}>
                {product?.unit}
              </Text>
            </View>

            <View style={{ gap: 20 }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {product?.variants?.map((variant: Variant, index: number) => {
                  return (
                    <View
                      style={{
                        ...styles.offerContainer,
                        backgroundColor:
                          selectedVariant?.id === variant.id
                            ? "#059B5D08"
                            : "#fff",
                        borderColor:
                          selectedVariant?.id === variant.id
                            ? "#059B5D"
                            : "#E0E0E0",
                      }}
                      key={index}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setHasUserSelectedVariant(true);
                          if (
                            cartItem &&
                            String(cartItem?.variantId) !== String(variant?.id)
                          ) {
                            dispatch(removeFromCart({ id: product?.id } as any));
                          }
                          setSelectedVariant(variant);
                        }}
                      >
                        <View style={{ gap: 10 }}>
                          <Text
                            style={{
                              fontSize: 13,
                              color: "#000000",
                              fontFamily: "Lato-Regular",
                            }}
                          >
                            {variant?.quantity} {product?.unit}
                          </Text>
                          <View style={GlobalStyleSheet.priceContainer}>
                            <Text style={GlobalStyleSheet.salePrice}>
                              KD {variant?.salePrice}
                            </Text>
                            <Text style={GlobalStyleSheet.originalPrice}>
                              KD {variant?.price}
                            </Text>
                          </View>
                          {variant?.price > variant?.salePrice && (
                            <Text style={GlobalStyleSheet.discountBadge}>
                              {calculateDiscountPercentage(
                                variant?.price,
                                variant?.salePrice,
                              )}
                              % OFF
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    ...styles.itemDescription,
                    fontFamily: "Lato-Bold",
                    fontSize: 15,
                  }}
                >
                  KD {selectedVariant?.salePrice}
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
                  KD {selectedVariant?.price}
                </Text>

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
              </View>
            </View>
          </View>

          <View
            style={{
              ...styles.descriptionContainer,
              flexDirection: "row",
              justifyContent: "space-between",
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
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 30,
                paddingHorizontal: 20,
              }}
            >
              {productDetailsTabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily:
                        activeTab === tab.key ? "Lato-Bold" : "Lato-SemiBold",
                      color: activeTab === tab.key ? "#0E8A4A" : "#9A9A9A",
                      borderBottomWidth: activeTab === tab.key ? 2 : 0,
                      borderBottomColor: "#0E8A4A",
                      paddingBottom: 6,
                    }}
                  >
                    {tab.key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View>
              {/* Hidden full-text measurer — no numberOfLines so we get the real line count */}
              <View style={{ height: 0, overflow: "hidden" }} pointerEvents="none">
                <Text
                  key={`measure-${activeTab}`}
                  onTextLayout={(e) => {
                    const count = e?.nativeEvent?.lines?.length;
                    if (count != null) {
                      setTabLineCount((prev) => ({ ...prev, [activeTab]: count }));
                    }
                  }}
                >
                  {activeTabContent}
                </Text>
              </View>

              <Text
                key={`display-${activeTab}`}
                style={{ marginTop: 12, color: "#4A4A4A", lineHeight: 20 }}
                numberOfLines={isExpanded ? undefined : 7}
              >
                {activeTabContent}
              </Text>
            </View>

            {textExceeds && (
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setExpandedTabs((prev) => ({
                    ...prev,
                    [activeTab]: !isExpanded,
                  }));
                }}
                style={{
                  marginTop: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "500" }}>
                  {isExpanded ? "Show Less" : "Show More"}
                </Text>
                <Text style={{ marginLeft: 4, color: "#0E8A4A" }}>
                  {isExpanded ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
{/* 
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
          </ScrollView>
        </SectionContainer> */}
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
                  paddingHorizontal: 12,
                }}
              >
                <Pressable
                  hitSlop={8}
                  onPress={() => {
                    dispatch(decrementQuantity({ id: product?.id } as any) as any);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Ionicons name="remove" size={22} color="#fff" />
                </Pressable>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 22,
                    fontFamily: "Lato-Regular",
                  }}
                >
                  {cartItem.quantity}
                </Text>

                <Pressable
                  hitSlop={8}
                  onPress={() => {
                    dispatch(incrementQuantity({ id: product?.id } as any) as any);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Ionicons name="add" size={22} color="#fff" />
                </Pressable>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (product && selectedVariant) {
                    addItemToCart(product, selectedVariant);
                  }
                }}
                style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
              >
                <Ionicons name="cart-outline" size={20} color="#fff" />
                <Text style={styles.addToCartText}>Add To Cart</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>

          <Pressable
            style={({ pressed }) => ({
              width: 170,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(30, 18, 61, 1)",
              borderRadius: 8,
              flexBasis: "45%",
              flexDirection: "row",
              gap: 6,
              opacity: pressed ? 0.85 : 1,
            })}
            onPress={() => {
              if (!cartItem && product && selectedVariant) {
                addItemToCart(product, selectedVariant);
              }
              navigation.navigate("MyCart");
            }}
          >
            <Ionicons name="flash-outline" size={18} color="#fff" />
            <Text style={styles.addToCartText}>Buy Now</Text>
          </Pressable>
        </View>
      </View>
      <GroceryGifLoader visible={loading} />
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
    // width: "32%",
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
    height: 320,
  },
  dotsRow: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  dotActive: {
    backgroundColor: "#059B5D",
    width: 18,
    borderRadius: 4,
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
    justifyContent: "center",
    alignItems: "center",
  },
  itemDescription: {
    fontFamily: "Lato-Medium",
    fontSize: 15,
    lineHeight: 16,
    letterSpacing: -0.36, // -3% of 12px
    color: "rgba(0, 0, 0, 1)",
  },
});
