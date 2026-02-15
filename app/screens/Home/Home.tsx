import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
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
import {
  SafeAreaView,
} from "react-native-safe-area-context";
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
import CartNotification from "../../components/Cart/CartNotification";
import BottomSheetHeader from "../../components/BottomSheet/BottomSheetHeader";
import AddressCard from "../../components/BottomSheet/AddressCard";
import LocationSelectionView from "../../components/BottomSheet/LocationSelectionView";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import HomeHeader from "../../components/Home/HomeHeader";
import CategoryCard from "../../components/Home/CategoryCard";

const apiPath = ApiClient();

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeScreenProps) => {
  const defaultAddress = useSelector((x: any) => x?.user?.defaultAddress);
  const isOpen = useSharedValue(false);
  const isOpenEdit = useSharedValue(false);
  const [banner, setBanner] = useState<any>({});
  const address = useSelector((x: any) => x.user.defaultAddress);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState<[]>();
  const [categories, setCategories] = useState<[]>();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [displayedProducts, setDisplayedProducts] = useState<any[]>();
  const [dealCategory, setDealCategory] = useState<any>();
  const [dealCategoryProducts, setDealCategoryProducts] = useState<any[]>();
  const [searchQuery, setSearchQuety] = useState<string>("");
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const [view, setView] = useState<"LIST" | "EDIT" | "LOCATION">("LIST");
  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
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
    const fetcchBanner = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/banners`);
        console.log("banner api", response.data);
        setBanner(response.data[1]);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetcchBanner();
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

  useEffect(() => {
    const setDealProducts = async () => {
      try {
        const dealProducts = products?.filter(
          (p: any) => p.categoryId === dealCategory.id,
        );
        setDealCategoryProducts(dealProducts);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    setDealProducts();
  }, [dealCategory, products]);

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

  const brandData = [
    {
      imagePath: IMAGES.elite,
    },
    {
      imagePath: IMAGES.muralya,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
  ];

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  //const navigation = useNavigation()

  const sheetRef = useRef<any>(null);
  const addItemToCart = useAddToCart();

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }} edges={[]}>
      <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: totalQuantity > 0 ? 100 : 20 }}
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
            />
            <ImageBackground
              imageStyle={{ opacity: 0.2 }}
              style={{ padding: 20 }}
              source={require("../../assets/images/bg.png")}
            >
              <View style={styles.bannerContainer}>
                <View>
                  <Text style={styles.bannerTitle}>Grocery Kit -</Text>
                  <Text style={styles.bannerSubtitle}>Flat 50% Off!</Text>
                  <View style={styles.knowMoreButton}>
                    <Text style={styles.knowMoreText}>KNOW MORE</Text>
                  </View>
                </View>
                <Image
                  style={styles.bannerImage}
                  source={require("../../assets/images/grocery.jpeg")}
                />
              </View>
            </ImageBackground>
          </LinearGradient>
        </View>

        <SectionContainer>
          <SectionHeader
            title="Categories"
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
                onPress={() => navigation.navigate("AllCategories")}
                containerStyle={{ width: 95 }}
              />
            ))}
          </ScrollView>
        </SectionContainer>

        <SectionContainer>
          <SectionHeader
            title="PRODUCTS"
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
            {brandData?.map((data: any, index: number) => (
              <View key={index} style={styles.brandCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ShopByBrand")}
                >
                  <Image style={styles.brandImage} source={data.imagePath} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SectionContainer>
      </ScrollView>
      <BottomSheet2 ref={sheetRef} />

      <CartNotification totalQuantity={totalQuantity} navigation={navigation} />

      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        {view === "LIST" && (
          <Animated.View style={styles.bottomSheetContent}>
            <View style={{ gap: 10 }}>
              <BottomSheetHeader title="CHANGE ADDRESS" onClose={toggleSheet} />
              <View>
                {[1, 2].map((item, index) => (
                  <AddressCard
                    key={index}
                    governorate={governorate}
                    city={city}
                    block={block}
                    defaultAddress={defaultAddress}
                    onEdit={() => {
                      toggleSheetEdit();
                      setView("EDIT");
                    }}
                    onRemove={() => {
                      // Handle remove action
                    }}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {view === "EDIT" && (
          <Animated.View style={{ ...styles.bottomSheetContent, gap: 40 }}>
            <BottomSheetHeader title="CHANGE ADDRESS" onClose={toggleSheet} />
            <UserDeliveryAddressDropDown
              onChangeLocation={() => {
                setView("LOCATION");
              }}
            />
          </Animated.View>
        )}

        {view === "LOCATION" && (
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
                  isOpen.value = false;
                }}
              />
            </View>
          </Animated.View>
        )}
      </LocationBottomSheet>
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
    width: 100,
    height: 50,
  } as const,
  // Location bottom sheet styles
  bottomSheetContent: {
    flex: 1,
    backgroundColor: "white",
    // gap: 10,
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
});
