import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import BottomSheet2 from "../Components/BottomSheet2";
import { useSelector } from "react-redux";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ProductCard from "../Product/ProductCard";
import { selectCartTotalQuantity } from "../../redux/reducer/cartReducer";
import { useAddToCart } from "../../hooks/useAddToCart";
import Animated, { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import UserDeliveryAddressDropDown from "../Location/UserDeliveryAddressDropDown";
import Button from "../../components/Button/Button";
import SectionHeader from "../../components/Home/SectionHeader";
import SectionContainer from "../../components/Home/SectionContainer";
import LocationDropdown from "../../components/Home/LocationDropdown";
import GlobalCartNotification from "../../components/Cart/GlobalCartNotification";
import BottomSheetHeader from "../../components/BottomSheet/BottomSheetHeader";
import AddressList from "../../components/BottomSheet/AddressList";
import LocationSelectionView from "../../components/BottomSheet/LocationSelectionView";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import HomeHeader from "../../components/Home/HomeHeader";
import CategoryCard from "../../components/Home/CategoryCard";
import { useUserAddress } from "../../hooks/useSaveUserAddress";
import { useSaveUserLocation } from "../../hooks/useSaveUserLocation";
import { Alert } from "react-native";

const apiPath = ApiClient();

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeScreenProps) => {
  const addresses = useSelector((x: any) => x?.user?.addresses || []);
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const { deleteAddress, loading: deleteLoading } = useUserAddress();
  const { saveLocation, loading: locationLoading } = useSaveUserLocation();
  const isOpen = useSharedValue(false);
  const SHEET_DURATION = 500;
  const [isLocationSheetMounted, setIsLocationSheetMounted] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpenEdit = useSharedValue(false);
  const [banner, setBanner] = useState<{
    title?: string;
    subtitle?: string;
    buttonText?: string;
    link?: string;
    imageUrl?: string;
    isActive?: boolean;
  } | null>(null);
  const address = useSelector((x: any) => x.user.defaultAddress);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState<[]>();
  const [brands, setBrands] = useState<[]>();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [rotatingProductIndex, setRotatingProductIndex] = useState<number>(0);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>();
  const [dealCategory, setDealCategory] = useState<any>();
  const [dealCategoryProducts, setDealCategoryProducts] = useState<any[]>();
  const [searchQuery, setSearchQuety] = useState<string>("");
  const totalQuantity = useSelector(selectCartTotalQuantity);

  const [editingAddress, setEditingAddress] = useState<any>(null); // Store address being edited
  const openLocationSheet = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Set open state before mount to avoid first-frame blink.
    isOpen.value = true;
    setIsLocationSheetMounted(true);
  };

  const closeLocationSheet = () => {
    isOpen.value = false;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsLocationSheetMounted(false);
      closeTimeoutRef.current = null;
    }, SHEET_DURATION);
  };

  const toggleSheet = () => {
    if (isOpen.value) {
      closeLocationSheet();
    } else {
      openLocationSheet();
    }
  };

  const toggleSheetEdit = () => {
    isOpenEdit.value = !isOpenEdit.value;
  };

  const {
    governorates,
    cities,
    blocks,

    governorate,
    city,
    block,

    setGovernorate,
    setCity,
    setBlock,

    govVisible,
    cityVisible,
    blockVisible,

    setGovVisible,
    setCityVisible,
    setBlockVisible,
  } = useLocationSelector();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/banners`);
        console.log("banner api", response.data);
        // Find the first active banner, or use the first one if no active banner
        const activeBanner = Array.isArray(response.data)
          ? response.data.find((b: any) => b.isActive) || response.data[0]
          : response.data;
        setBanner(activeBanner || null);
      } catch (error: any) {
        console.error("Error fetching banner:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  useEffect(() => {
    if (!address) return;
    if (!address.governorate) return;
    const fetchProducts = async () => {
      try {
        const response = await apiPath.get(
          `${Url}/api/products?gov=${address.governorate.id}&city=${address.city.id}&block=${address.block.id}&search =${searchQuery}`,
        );
        console.log("product api", response.data);
        const list = Array.isArray(response.data) ? response.data : [];
        setProducts(list as any);
        const latestFive = [...list]
          .sort((a: any, b: any) => {
            const at = Date.parse(a?.createdAt ?? "") || 0;
            const bt = Date.parse(b?.createdAt ?? "") || 0;
            return bt - at;
          })
          .slice(0, 5);
        setDisplayedProducts(latestFive);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, governorate, city, block]);

  useEffect(() => {
    console.log("this are the ", governorate, city, block);
  }, []);

  useEffect(() => {
    const fetchTopDiscountProducts = async () => {
      try {
        const governorateId =
          address?.governorate?.id || address?.governorateId;
        const cityId = address?.city?.id || address?.cityId;
        const blockId = address?.block?.id || address?.blockId;

        if (!governorateId || !cityId || !blockId) {
          setDealCategoryProducts([]);
          return;
        }

        const response = await apiPath.get(
          `${Url}/api/products/top-discounts?gov=${governorateId}&city=${cityId}&block=${blockId}`,
        );
        setDealCategoryProducts(response.data || []);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      }
    };
    fetchTopDiscountProducts();
  }, [address]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/categories`);
        console.log("category api", response.data);
        setCategories(response.data);
        const dealCategory = response.data.find((x: any) => x.title === "Deal");
        setDealCategory(dealCategory);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  // Rotate product title in search placeholder every 3 seconds
  useEffect(() => {
    if (searchQuery) return; // placeholder is only visible when searchQuery is empty

    const list = displayedProducts?.length ? displayedProducts : products;
    if (!list || list.length === 0) return;

    const interval = setInterval(() => {
      setRotatingProductIndex((prevIndex) => {
        return (prevIndex + 1) % list.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [displayedProducts, products, searchQuery]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/brands`);
        console.log("brands api", response.data);
        setBrands(response.data || []);
      } catch (error: any) {
        console.error("Error fetching brands:", error);
        setError(error.message || "Failed to fetch brands");
      }
    };
    fetchBrands();
  }, []);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  //const navigation = useNavigation()

  const sheetRef = useRef<any>(null);
  const addItemToCart = useAddToCart();

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }} edges={[]}>
      <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: totalQuantity > 0 ? 180 : 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={["rgba(30, 18, 61, 1)", "rgba(12, 0, 40, 1)"]}
          >
            <HomeHeader
              governorate={governorate}
              city={city}
              block={block}
              onLocationPress={toggleSheet}
              searchQuery={searchQuery}
              onSearchChange={(e: string) => {
                console.log("term", e);
                setSearchQuety(e);
              }}
              searchPlaceholder={
                displayedProducts?.[rotatingProductIndex]?.title
                  ? `Search '${displayedProducts[rotatingProductIndex].title}'`
                  : "Search Product"
              }
            />
            <ImageBackground
              imageStyle={{ opacity: 0.2 }}
              style={{ padding: 20 }}
              source={require("../../assets/images/bg.png")}
            >
              {banner && (
                <View style={styles.bannerContainer}>
                  <View>
                    {banner.title && (
                      <Text style={styles.bannerTitle}>{banner.title}</Text>
                    )}
                    {banner.subtitle && (
                      <Text style={styles.bannerSubtitle}>
                        {banner.subtitle}
                      </Text>
                    )}
                    {banner.buttonText && (
                      <TouchableOpacity
                        style={styles.knowMoreButton}
                        onPress={() => {
                          if (banner.link) {
                            // Handle navigation based on link
                            console.log("Banner link:", banner.link);
                            // You can add navigation logic here if needed
                          }
                        }}
                      >
                        <Text style={styles.knowMoreText}>
                          {banner.buttonText}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {banner.imageUrl && (
                    <Image
                      style={styles.bannerImage}
                      source={require("../../assets/images/bannerimg.webp")}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}
            </ImageBackground>
          </LinearGradient>
        </View>

        {/* No Products Notification Banner */}
        {displayedProducts &&
          displayedProducts.length === 0 &&
          address &&
          address.governorate && (
            <View style={styles.noProductsBanner}>
              <Image
                style={styles.noProductsIcon}
                source={require("../../assets/images/icons/locationpinblack.png")}
              />
              <Text style={styles.noProductsText}>
                No products available in your selected location. Please try a
                different address.
              </Text>
            </View>
          )}

        <SectionContainer>
          <SectionHeader
            title="Categories"
            showViewAll={true}
            onViewAllPress={() => navigation.navigate("Categories")}
          />

          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              gap: 15,
              marginTop: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories?.map((data: any, index: any) => (
              <CategoryCard
                key={index}
                title={data.title}
                image={data.imageUrl}
                onPress={() => {
                  setSelectedCategory(data.title);
                  // Navigate to StackNavigator's Categories screen (not BottomNavigation's Categories tab)
                  navigation.getParent()?.navigate("Categories", {
                    categoryTitle: data.title,
                    categoryId: data.id,
                  });
                }}
                containerStyle={{ width: 95 }}
              />
            ))}
          </ScrollView>
        </SectionContainer>

        <SectionContainer>
          <SectionHeader
            title="NEW PRODUCTS"
            onViewAllPress={() => {
              navigation.navigate("ShopByBrand", {});
            }}
          />
          <ScrollView
            contentContainerStyle={{
              gap: 15,
              flexDirection: "row",
              marginTop: 20,
              paddingRight: 44,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            directionalLockEnabled={true}
            keyboardShouldPersistTaps="handled"
            overScrollMode="never"
          >
            {displayedProducts?.map((data: any) => {
              return (
                <ProductCard
                  key={data.id || data.slug}
                  addToCart={addItemToCart}
                  product={data}
                  navigation={navigation}
                  containerStyle={{
                    width: wp("30%"),
                    minWidth: 120,
                    maxWidth: 160,
                  }}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>

        <SectionContainer>
          <SectionHeader title="DEAL OF THE DAY" />
          <ScrollView
            contentContainerStyle={{
              gap: 15,
              flexDirection: "row",
              marginTop: 20,
              paddingRight: 44,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            directionalLockEnabled={true}
            keyboardShouldPersistTaps="handled"
            overScrollMode="never"
          >
            {dealCategoryProducts?.map((data: any) => {
              return (
                <ProductCard
                  key={data.id || data.slug}
                  addToCart={addItemToCart}
                  product={data}
                  navigation={navigation}
                  containerStyle={{
                    width: wp("30%"),
                    minWidth: 120,
                    maxWidth: 160,
                  }}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>

        <SectionContainer>
          <SectionHeader
            title="SHOP BY BRANDS"
            onViewAllPress={() => navigation.navigate("Brands")}
          />

          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              gap: 20,
              marginTop: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {brands?.map((brand: any) => (
              <View key={brand.id} style={styles.brandCard}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ShopByBrand", {
                      brandId: brand.id,
                      brand: brand,
                    })
                  }
                >
                  <Image
                    style={styles.brandImage}
                    source={{
                      uri: brand.image || brand.imageUrl || brand.logo,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SectionContainer>
      </ScrollView>
      <BottomSheet2 ref={sheetRef} />

      {isLocationSheetMounted && (
        <LocationBottomSheet
          isOpen={isOpen}
          toggleSheet={toggleSheet}
          duration={SHEET_DURATION}
        >
          <Animated.View
            style={{
              ...styles.bottomSheetContent,
              justifyContent: "space-between",
              gap: 15,
            }}
          >
            <BottomSheetHeader title="CHANGE ADDRESS" onClose={toggleSheet} />
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <LocationSelectionView
                governorates={governorates}
                cities={cities}
                blocks={blocks}
                governorate={governorate}
                city={city}
                block={block}
                govVisible={govVisible}
                cityVisible={cityVisible}
                blockVisible={blockVisible}
                onGovOpen={() => setGovVisible(true)}
                onGovClose={() => setGovVisible(false)}
                onCityOpen={() => setCityVisible(true)}
                onCityClose={() => setCityVisible(false)}
                onBlockOpen={() => setBlockVisible(true)}
                onBlockClose={() => setBlockVisible(false)}
                onGovernorateSelect={(item) => {
                  setGovernorate(item);
                  setCity(null);
                  setBlock(null);
                }}
                onCitySelect={(item) => {
                  setCity(item);
                  setCityVisible(false);
                  setBlock(null);
                }}
                onBlockSelect={(item) => {
                  setBlock(item);
                  setBlockVisible(false);
                }}
                onContinue={() => {
                  if (!governorate || !city || !block) {
                    Alert.alert(
                      "Error",
                      "Please select governorate, city, and block",
                    );
                    return;
                  }

                  saveLocation({
                    payload: {
                      userId,
                      governorate: governorate.id,
                      city: city.id,
                      block: block.id,
                      country: "Kuwait",
                    },
                    onSuccess: () => {
                      closeLocationSheet();
                    },
                    onError: (error) => {
                      Alert.alert("Error", error || "Failed to save location");
                    },
                  });
                }}
              />
            </View>
          </Animated.View>
        </LocationBottomSheet>
      )}
      <GlobalCartNotification />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  // Header styles
  headerContainer: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  bannerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: {
    fontFamily: "Lato-SemiBold",
    fontSize: 13,
    letterSpacing: -0.36,
    color: "#FFFFFF",
  },
  bannerSubtitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  knowMoreButton: {
    borderRadius: 20,
    overflow: "hidden",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    width: 90,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  knowMoreText: {
    fontFamily: "Lato-Bold",
    fontSize: 10,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  bannerImage: {
    height: 100,
    width: 100,
  } as const,
  // Brand styles
  brandCard: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "rgba(245, 245, 245, 1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  brandImage: {
    width: 150,
    height: 80,
  } as const,
  // Location bottom sheet styles
  bottomSheetContent: {
    flex: 1,
    backgroundColor: "white",
    // gap: 10,
    paddingBottom: 5,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  addressCardContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  addressActions: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "flex-end",
  },
  addressRow: {
    flexDirection: "row",
    gap: 10,
  },
  addressIconContainer: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "rgba(240, 240, 240, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  addressInfo: {
    gap: 5,
  },
  addressLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // Unused styles (keeping for reference)
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
    opacity: 0.85,
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(255,255,255,0.35)",
    marginHorizontal: 12,
  },
  addressTItle: {
    fontFamily: "Lato-SemiBold",
    fontSize: 14,
  },
  addressContent: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
  },
  editText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 13,
  },
  noProductsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.15)", // Light yellow/orange background
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "rgba(255, 152, 0, 1)", // Orange accent border
  },
  noProductsIcon: {
    width: 20,
    height: 20,
    tintColor: "rgba(255, 152, 0, 1)", // Orange icon color
  },
  noProductsText: {
    flex: 1,
    fontFamily: "Lato-Medium",
    fontSize: 13,
    color: "rgba(102, 60, 0, 1)", // Dark orange/brown text
    lineHeight: 18,
  },
});
