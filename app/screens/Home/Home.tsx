import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // Using AntDesign for arrow
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS } from "../../constants/theme";
import Button from "../../components/Button/Button";
import Cardstyle1 from "../../components/Card/Cardstyle1";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import BottomSheet2 from "../Components/BottomSheet2";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer } from "../../redux/actions/drawerAction";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";

const apiPath = ApiClient();

const brandData = [
  {
    title: "Nike",
    image: IMAGES.brand1,
  },
  {
    title: "Adidas",
    image: IMAGES.brand2,
  },
  {
    title: "Reebok",
    image: IMAGES.brand3,
  },
  {
    title: "Puma",
    image: IMAGES.brand4,
  },
  {
    title: "Bata",
    image: IMAGES.brand5,
  },
  {
    title: "Nike",
    image: IMAGES.brand1,
  },
  {
    title: "Adidas",
    image: IMAGES.brand2,
  },
  {
    title: "Reebok",
    image: IMAGES.brand3,
  },
  {
    title: "Puma",
    image: IMAGES.brand4,
  },
  {
    title: "Bata",
    image: IMAGES.brand5,
  },
];

const ArrivalData = [
  {
    title: "All",
    active: true,
  },
  {
    title: "Child",
  },
  {
    title: "Man",
  },
  {
    title: "Woman",
  },
  {
    title: "Dress",
  },
  {
    title: "unisex",
  },
];

const cardData = [
  {
    id: "0",
    image: IMAGES.item5,
    title: "Swift Glide Sprinter Soles",
    price: "$199",
    offer: "30% OFF",
    color: false,
    hascolor: false,
  },
  {
    id: "1",
    image: IMAGES.item6,
    title: "Echo Vibe Urban Runners",
    price: "$149",
    //offer:"30% OFF"
    color: false,
    hascolor: true,
  },
  {
    id: "2",
    image: IMAGES.item7,
    title: "Zen Dash Active Flex Shoes",
    price: "$299",
    //offer:"30% OFF"
    color: false,
    hascolor: true,
  },
  {
    id: "3",
    image: IMAGES.item8,
    title: "Nova Stride Street Stompers",
    price: "$99",
    offer: "70% OFF",
    color: true,
    hascolor: false,
  },
];

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeScreenProps) => {
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
  const [searchQuery,setSearchQuety] = useState<string>('');

  useEffect(() => {
    console.log("user info", address);
  });

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
          `${Url}/api/products?gov=${address.governorate}&city=${address.city}&block=${address.block}&search =${searchQuery}`
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
          (p: any) => p.categoryId === dealCategory.id
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

  const handleCategoryChange = (categoryId?: string) => {
    console.log("ID", categoryId);
    if (categoryId === undefined) {
      setDisplayedProducts(products);
      return;
    }
    const productsOfCategoryById = products?.filter(
      (p: any) => p.category.id === categoryId
    );

    console.log("filtered", productsOfCategoryById);
    setDisplayedProducts(productsOfCategoryById);
  };

  const dispatch = useDispatch();

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  //const navigation = useNavigation()

  const sheetRef = useRef<any>(null);

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 20, marginTop: 5, marginBottom: 10 },
          ]}
        >
          <View
            style={[
              GlobalStyleSheet.row,
              { alignItems: "center", justifyContent: "space-between" },
            ]}
          >
            <TouchableOpacity
              style={{ margin: 5 }}
              // onPress={() => dispatch(openDrawer())}
              onPress={() => navigation.openDrawer()}
            >
              <Image
                style={{ height: 16, width: 16, tintColor: colors.title }}
                source={IMAGES.grid3}
              />
            </TouchableOpacity>
            <View>
              <Image
                style={{
                  height: 25,
                  width: 50,
                  resizeMode: "contain",
                  tintColor: colors.title,
                }}
                source={IMAGES.shose}
              />
            </View>

            <View>
              {/* <Text>{address.governorate}</Text> */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Notification")}
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 8,
                  backgroundColor: theme.dark
                    ? "rgba(255,255,255,0.10)"
                    : COLORS.background,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ height: 20, width: 20, tintColor: colors.title }}
                  source={IMAGES.ball}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UserLocation");
            }}
          >
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>
                {address.governorate}, {address.city}, {address.block}
              </Text>
              <Image
                style={{ height: 13, width: 13 }}
                source={require("../../assets/images/icons/greater-than.png")}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              gap: 10,
              marginHorizontal: -5,
            }}
          >
            <View style={{ flex: 1 }}>
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
                    paddingHorizontal: 20,
                    color: colors.title,
                    fontSize: 16,
                  },
                ]}
                onChangeText={(e : string) => {console.log('term',e),setSearchQuety(e)}}
              />
            </View>
            <TouchableOpacity
              style={{
                height: 50,
                width: 50,
                backgroundColor: theme.dark
                  ? "rgba(255,255,255,0.10)"
                  : colors.title,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => sheetRef.current.openSheet("filter")}
            >
              <Image
                style={{ height: 24, width: 24, resizeMode: "contain" }}
                source={IMAGES.grid4}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: COLORS.secondary }}>
          <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30 }]}>
            <View
              style={{
                marginTop: -15,
                marginBottom: -15,
                marginLeft: -15,
                marginRight: -15,
                position: "relative",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    backgroundColor: theme.dark
                      ? COLORS.background
                      : colors.card,
                    borderTopLeftRadius: 200,
                    borderTopRightRadius: 200,
                    position: "absolute",
                    left: 35,
                    right: 35,
                    top: 15,
                    bottom: 0,
                  },
                  Platform.OS === "web" && { bottom: -10 },
                ]}
              />
              <Image
                style={[
                  {
                    height: undefined,
                    width: "100%",
                    aspectRatio: 1 / 1,
                  },
                  Platform.OS === "web" && { height: null },
                ]}
                source={{ uri: banner.imageUrl }}
              />
            </View>
            {/* </View> */}
          </View>
        </View>

        {/* <View style={{ backgroundColor: COLORS.secondary, marginTop: 50 }}>
          <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30 }]}>
            <View
              style={{
                marginTop: -15,
                marginBottom: -15,
                marginLeft: -15,
                marginRight: -15,
                position: "relative",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    backgroundColor: theme.dark
                      ? COLORS.background
                      : colors.card,
                    borderTopLeftRadius: 200,
                    borderTopRightRadius: 200,
                    position: "absolute",
                    left: 35,
                    right: 35,
                    top: 15,
                    bottom: 0,
                  },
                  Platform.OS === "web" && { bottom: -10 },
                ]}
              />
              <Image
                style={[
                  {
                    height: undefined,
                    width: "100%",
                    aspectRatio: 1 / 1,
                  },
                  Platform.OS === "web" && { height: null },
                ]}
                source={{ uri: dealCategory?.imageUrl }}
              />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Products", {
                    categoryId: dealCategory.id,
                    categoryName: dealCategory.title,
                  });
                }}
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  backgroundColor: COLORS.primary,
                  padding: 10,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="arrowright" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View> */}

        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingHorizontal: 20,
              paddingBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            },
          ]}
        >
          <View style={{}}>
            <Text
              style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}
            >
              Deal
            </Text>
          </View>
          <View style={{}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Products", {
                  categoryId: dealCategory.id,
                  categoryName: dealCategory.title,
                });
              }}
            >
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 18, color: colors.title },
                ]}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 70 }}
        >
          {dealCategoryProducts?.map((data: any, index: any) => {
            return (
              <>
                <View
                  key={index}
                  style={{ width: 160, height: 220, marginRight: 10 }}
                >
                  <Cardstyle1
                    id={data.id}
                    title={data.title}
                    image={data.imageUrl}
                    price={data.salePrice}
                    color={data.color}
                    offer={data.offer}
                    hascolor={data.hascolor}
                    onPress1={() => addItemToWishList(data)}
                    onPress={() => {
                      navigation.navigate("ProductsDetails", {
                        productId: data.slug,
                      });
                    }}
                  />
                </View>
              </>
            );
          })}
        </ScrollView>

        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 20, paddingBottom: 10 },
          ]}
        >
          <View style={{}}>
            <Text
              style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}
            >
              New Arrival
            </Text>
          </View>
        </View>
        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 20, paddingVertical: 0 },
          ]}
        >
          <View style={{ marginHorizontal: -15 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginRight: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory("All");
                    handleCategoryChange();
                  }}
                  style={{
                    backgroundColor:
                      selectedCategory === "All"
                        ? colors.title
                        : theme.dark
                        ? "rgba(255,255,255,0.10)"
                        : colors.background,
                    height: 38,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    // borderColor: theme.dark ? COLORS.white : colors.borderColor,
                    //marginTop: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      ...FONTS.fontMedium,
                      fontSize: 13,
                      color:
                        selectedCategory === "All"
                          ? theme.dark
                            ? COLORS.title
                            : colors.card
                          : colors.title,
                    }}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {categories?.map((data: any, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCategory(data.title);
                        handleCategoryChange(data.id);
                      }}
                      key={index}
                      style={{
                        backgroundColor:
                          selectedCategory === data.title
                            ? colors.title
                            : theme.dark
                            ? "rgba(255,255,255,0.10)"
                            : colors.background,
                        height: 38,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        // borderColor: theme.dark ? COLORS.white : colors.borderColor,
                        //marginTop: 10,
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          ...FONTS.fontMedium,
                          fontSize: 13,
                          color:
                            selectedCategory === data.title
                              ? theme.dark
                                ? COLORS.title
                                : colors.card
                              : colors.title,
                        }}
                      >
                        {data.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20 }]}>
          <View style={[GlobalStyleSheet.row]}>
            {displayedProducts?.map((data: any, index) => {
              return (
                <View
                  style={[GlobalStyleSheet.col50, { marginBottom: 20 }]}
                  key={index}
                >
                  <Cardstyle1
                    id={data.id}
                    title={data.title}
                    image={data.imageUrl}
                    price={data.salePrice}
                    offer={data.offer}
                    color={data.color}
                    hascolor={data.hascolor}
                    onPress1={() =>
                      navigation.navigate("ProductsDetails", {
                        productId: data.slug,
                      })
                    }
                    onPress2={() =>
                      navigation.navigate("ProductsDetails", {
                        productId: data.slug,
                      })
                    }
                    onPress={() =>
                      navigation.navigate("ProductsDetails", {
                        productId: data.slug,
                      })
                    }
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <BottomSheet2 ref={sheetRef} />
    </View>
  );
};

export default Home;
