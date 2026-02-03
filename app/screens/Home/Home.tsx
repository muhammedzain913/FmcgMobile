import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import BottomSheet2 from "../Components/BottomSheet2";
import { useDispatch, useSelector } from "react-redux";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ProductCard from "../Product/ProductCard";
import { FONTS } from "../../constants/theme";
import {
  addToCart,
  selectCartTotalQuantity,
} from "../../redux/reducer/cartReducer";
import { AppDispatch } from "../../redux/store";
import Animated, { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import UserDeliveryAddress from "../Location/UserDeliveryAddress";
import UserDeliveryAddressDropDown from "../Location/UserDeliveryAddressDropDown";
import DropdownMenu from "../../components/DropDown/DropDownMenu";
import MenuOption from "../../components/DropDown/MenuOption";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Button from "../../components/Button/Button";
import LocationDisplay from "../../components/Location/LocationDisplay";

const apiPath = ApiClient();

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeScreenProps) => {
  const insets = useSafeAreaInsets();
  const defaultAddress = useSelector((x: any) => x?.user?.defaultAddress);
  const isOpen = useSharedValue(false);
  const isOpenEdit = useSharedValue(false);
  const dispatch = useDispatch<AppDispatch>();
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

  const addItemToCart = (product: any) => {
    // const selectedImage = swiperimageData[currentSlide].image;
    console.log("adding items..");
    dispatch(
      addToCart({
        id: product?.id,
        image: product?.imageUrl,
        title: product?.title,
        price: product?.salePrice,
        slug: product?.slug,
        color: false,
        hascolor: false,
        vendorId: product?.userId,
      } as any),
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }} edges={[]}>
      <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: totalQuantity > 0 ? 100 : 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            // Button Linear Gradient
            colors={["rgba(30, 18, 61, 1)", "rgba(12, 0, 40, 1)"]}
          >
            <ImageBackground
              style={{
                flex: 1,
                padding: 20,
                paddingTop: Math.max(insets.top + 20, 40),
                gap : 20
              }}
              source={require("../../assets/images/maskgroup.png")}
            >
              <LocationDisplay
                governorate={governorate}
                city={city}
                block={block}
                textColor="#FFFFFF"
              />

              <LinearGradient
                // Button Linear Gradient
                colors={["rgba(255, 255, 255, 1)", "rgba(184, 184, 184, 1)"]}
              ></LinearGradient>

              <LinearGradient
                colors={["rgba(255,255,255,1)", "rgba(184,184,184,1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
              >
                <View style={styles.searchBoxCotainer}>
                  {/* Search Icon */}
                  <Image
                    source={require("../../assets/images/icons/searchiconimg.png")}
                    style={styles.icon}
                  />

                  {/* Divider */}
                  <View style={styles.searchBoxDivider} />

                  {/* Text */}

                  <TextInput
                    placeholder="Search Product"
                    placeholderTextColor={"#666666"}
                    style={[
                      FONTS.fontRegular,
                      {
                        height: 50,
                        width: "100%",
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 8,
                        color: colors.title,
                        fontSize: 16,
                      },
                    ]}
                    onChangeText={(e: string) => {
                      (console.log("term", e), setSearchQuety(e));
                    }}
                  />
                </View>
              </LinearGradient>
            </ImageBackground>

            <ImageBackground
              imageStyle={{ opacity: 0.2 }}
              style={{ padding: 20 }}
              source={require("../../assets/images/bg.png")}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Lato-SemiBold", // or "Lato" with fontWeight if mapped
                      fontSize: 13,
                      // lineHeight: 12, // 100% of fontSize
                      letterSpacing: -0.36, // -3% of 12px → 12 * -0.03
                      color: "#FFFFFF",
                    }}
                  >
                    Grocery Kit -
                  </Text>

                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 20,
                      fontWeight: "700",
                    }}
                  >
                    Flat 50% Off!
                  </Text>

                  <View
                    style={{
                      borderRadius: 20,
                      overflow: "hidden",
                      borderColor: "#FFFFFF",
                      borderWidth: 1,
                      width: 90,
                      height: 26,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Bold", // preferred if font file exists
                        fontSize: 10,
                        // lineHeight: 10,
                        // letterSpacing: 0,
                        color: "#FFFFFF",
                        textTransform: "uppercase",
                      }}
                    >
                      KNOW MORE
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </LinearGradient>
        </View>

        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 20, paddingBottom: 10 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 15,
                fontWeight: "700", // Bold
                lineHeight: 20,
                letterSpacing: -0.39, // -3% of 13px ≈ -0.39
                color: "rgba(31, 31, 31, 1)",
                textTransform: "uppercase", // Cap height look
              }}
            >
              Categories
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("AllCategories")}
            >
              <View
                style={{
                  flexDirection: "row", // Flow: Horizontal
                  alignItems: "center", // Inner alignment
                  height: 30, // Fixed height
                  paddingVertical: 7.78,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "rgba(240, 240, 240, 1)",
                  backgroundColor: "rgba(255, 255, 255, 0.6)", // Required for blur effect
                }}
              >
                <Image
                  style={{ height: 10, width: 10, marginTop: 4 }}
                  source={require("../../assets/images/icons/top-right.png")}
                />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              gap: 15,
              marginTop: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories?.map((data: any, index: any) => {
              return (
                <View key={index} style={{ gap: 5, width: 95 }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Categories");
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(245, 245, 245, 1)",
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 5,
                      }}
                    >
                      <Image
                        style={{ width: 85, height: 85 }}
                        source={require("../../assets/images/item/fruitcatimage.png")}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 15,
                          fontWeight: "600", // SemiBold
                          color: "rgba(0, 0, 0, 1)",
                          textAlign: "center",
                        }}
                      >
                        {data.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 20, paddingBottom: 10 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 15,
                fontWeight: "700", // Bold
                lineHeight: 20,
                letterSpacing: -0.39, // -3% of 13px ≈ -0.39
                color: "rgba(31, 31, 31, 1)",
                textTransform: "uppercase", // Cap height look
              }}
            >
              PRODUCTS
            </Text>

            <View
              style={{
                flexDirection: "row", // Flow: Horizontal
                alignItems: "center", // Inner alignment
                height: 30, // Fixed height
                paddingVertical: 7.78,
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,

                borderColor: "rgba(240, 240, 240, 1)",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
              }}
            >
              <Image
                style={{ height: 10, width: 10, marginTop: 4 }}
                source={require("../../assets/images/icons/top-right.png")}
              />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{ gap: 15 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {displayedProducts?.map((data: any) => {
              return (
                <View style={{ width: "20%" }}>
                  <ProductCard
                    addToCart={addItemToCart}
                    product={data}
                    navigation={navigation}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 20, paddingBottom: 10 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 15,
                fontWeight: "700", // Bold
                lineHeight: 20,
                letterSpacing: -0.39, // -3% of 13px ≈ -0.39
                color: "rgba(31, 31, 31, 1)",
                textTransform: "uppercase", // Cap height look
              }}
            >
              SHOP BY BRANDS
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Brands");
              }}
            >
              <View
                style={{
                  flexDirection: "row", // Flow: Horizontal
                  alignItems: "center", // Inner alignment
                  height: 30, // Fixed height
                  paddingVertical: 7.78,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,

                  borderColor: "rgba(240, 240, 240, 1)",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <Image
                  style={{ height: 10, width: 10, marginTop: 4 }}
                  source={require("../../assets/images/icons/top-right.png")}
                />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              gap: 20,
              marginTop: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {brandData?.map((data: any) => {
              return (
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: "rgba(245, 245, 245, 1)",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ShopByBrand");
                    }}
                  >
                    <Image
                      style={{ width: 100, height: 50 }}
                      source={data.imagePath}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
      <BottomSheet2 ref={sheetRef} />

      {totalQuantity > 0 && (
        <View
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            bottom: 16,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            shadowColor: "rgb(115, 158, 123)",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <LinearGradient
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            colors={["rgba(134, 235, 193, 0.25)", "rgba(255,255,255,0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Text
                style={{
                  color: "rgba(5, 155, 93, 1)",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {totalQuantity} Items Added
              </Text>
              <Image source={require("../../assets/images/smstar.png")} />
            </View>
            <View
              style={{
                backgroundColor: "rgba(5, 155, 93, 1)",
                flexDirection: "row",
                gap: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MyCart");
                }}
              >
                <Text style={{ color: "#fff" }}>View Cart</Text>
              </TouchableOpacity>
              <Image
                source={require("../../assets/images/icons/ShoppingBag.png")}
              />
            </View>
          </LinearGradient>
        </View>
      )}

      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        {view === "LIST" && (
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 1)",
              gap: 10,
              paddingHorizontal: 20,
              paddingVertical: 50,
            }}
          >
            <View style={{ position: "absolute", top: 20, right: 30 }}>
              <TouchableOpacity onPress={toggleSheet}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
            <Text>CHANGE ADDRESS</Text>

            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#705656",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignSelf: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      (toggleSheetEdit(), setView("EDIT"));
                    }}
                  >
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <Text style={{ color: "red" }}>Remove</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderWidth: 1,
                      borderColor: "rgba(240, 240, 240, 1)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/icons/House.png")}
                    />
                  </View>

                  <View style={{ gap: 5 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Image
                        style={{ resizeMode: "contain" }}
                        source={require("../../assets/images/icons/locationblackl.png")}
                      />
                      <Text>HOME</Text>
                    </View>
                    <View style={{ gap: 5 }}>
                      <Text>
                        {governorate?.name}, {city?.name}, {block?.name}
                      </Text>
                      <Text>
                        {defaultAddress?.street}, {defaultAddress?.building},{" "}
                        {defaultAddress?.phone}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {view === "EDIT" && (
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <UserDeliveryAddressDropDown
              onChangeLocation={() => {
                setView("LOCATION");
              }}
            />
          </View>
        )}

        {view === "LOCATION" && (
          <Animated.View
            style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20 }}
          >
            <Text>Choose governorate</Text>
            <DropdownMenu
              visible={govVisible}
              handleOpen={() => setGovVisible(true)}
              handleClose={() => setGovVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {governorate ? governorate?.name : "Select Governerate"}
                  </Text>
                  <Image
                    source={require("../../assets/images/icons/dropicon.png")}
                  />
                </View>
              }
            >
              {governorates.map((block: any, index) => {
                return (
                  <MenuOption
                    key={index}
                    onSelect={() => {
                      setGovernorate(block);
                      setCity(null);
                      setBlock(null);
                    }}
                  >
                    <Text>{block?.name}</Text>
                  </MenuOption>
                );
              })}
            </DropdownMenu>

            <Text>Choose city</Text>

            <DropdownMenu
              visible={cityVisible}
              handleOpen={() => setCityVisible(true)}
              handleClose={() => setCityVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {city ? city?.name : "Select City"}
                  </Text>
                  <Image
                    source={require("../../assets/images/icons/dropicon.png")}
                  />
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {cities.map((city, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setCity(city);
                        setCityVisible(false);
                        setBlock(null);
                      }}
                    >
                      <Text>{city?.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>

            <Text>Choose city</Text>

            <DropdownMenu
              visible={blockVisible}
              handleOpen={() => setBlockVisible(true)}
              handleClose={() => setBlockVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {block ? block.name : "Select Block"}
                  </Text>
                  <Image
                    source={require("../../assets/images/icons/dropicon.png")}
                  />
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {blocks.map((block, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setBlock(block);
                        setBlockVisible(false);
                      }}
                    >
                      <Text>{block?.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>

            <Button
              variant="non"
              color={"#1E123D"}
              title="Continue"
              onPress={() => {
                isOpen.value = false;
              }}
            />
          </Animated.View>
        )}
      </LocationBottomSheet>

      {/* <LocationBottomSheet isOpen={isOpenEdit} toggleSheet={toggleSheetEdit}> */}
      {/* <View style={{alignSelf :'flex-end',bottom : 10}}>
            <TouchableOpacity onPress={toggleSheetEdit}><Text>Close</Text></TouchableOpacity>
          </View> */}
      {/* </LocationBottomSheet> */}
    </SafeAreaView>
  );
};

export default Home;

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
    backgroundColor: "rgba(255,255,255,0.35)",
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
    backgroundColor: "rgba(44, 33, 71, 1)",
  },

  icon: {
    width: 18,
    height: 18,
    tintColor: "#FFFFFF",
  },

  searchBoxDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  placeholder: {
    fontFamily: "Lato",
    fontSize: 15,
    color: "#FFFFFF",
  },

  highlight: {
    color: "#FFC107", // yellow "Snacks"
    fontWeight: "600",
  },
  triggerStyle: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
  },
  triggerText: {
    fontSize: 16,
  },
});
