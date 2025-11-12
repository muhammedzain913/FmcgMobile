import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Cardstyle1 from "../../components/Card/Cardstyle1";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import BottomSheet2 from "../Components/BottomSheet2";
import { useDispatch } from "react-redux";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";

const apiPath = ApiClient();

const sliderData = [
  {
    title: "Crazy Deals",
  },
  {
    title: "Budget Buys",
  },
  {
    title: "Best Offer",
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

const cardgridData = [
  {
    id: "5",
    image: IMAGES.item5,
    title: "Swift Glide Sprinter Soles",
    price: "$199",
    offer: "30% OFF",
    color: false,
    hascolor: false,
  },
  {
    id: "6",
    image: IMAGES.item6,
    title: "Echo Vibe Urban Runners",
    price: "$149",
    //offer:"30% OFF"
    color: false,
    hascolor: true,
  },
  {
    id: "7",
    image: IMAGES.item7,
    title: "Zen Dash Active Flex Shoes",
    price: "$299",
    //offer:"30% OFF"
    color: false,
    hascolor: true,
  },
  {
    id: "8",
    image: IMAGES.item8,
    title: "Nova Stride Street Stompers",
    price: "$99",
    offer: "70% OFF",
    color: true,
    hascolor: false,
  },
  {
    id: "9",
    image: IMAGES.item18,
    title: "Evo Quip Evo Quick Strides",
    price: "$399",
    offer: "90% OFF",
    color: false,
    hascolor: false,
  },
  {
    id: "10",
    image: IMAGES.item19,
    title: "Echo Vibe Urban Runners",
    price: "$179",
    offer: "70% OFF",
    color: false,
    hascolor: false,
  },
];

const cardlistData = [
  {
    id: "11",
    image: IMAGES.item9,
    title: "Echo Vibe Urban Runners",
    price: "$179",
    delevery: "FREE Delivery",
    offer: "40% OFF",
  },
  {
    id: "12",
    image: IMAGES.item10,
    title: "Swift Glide Sprinter Soles",
    price: "$199",
    delevery: "FREE Delivery",
    offer: "40% OFF",
  },
  {
    id: "13",
    image: IMAGES.item11,
    title: "Sky Burst Skyline Burst Shoes",
    price: "$149",
    delevery: "FREE Delivery",
    offer: "40% OFF",
  },
  {
    id: "14",
    image: IMAGES.item12,
    title: "Zen Dash Active Flex Shoes",
    price: "$299",
    delevery: "FREE Delivery",
    offer: "40% OFF",
  },
  {
    id: "15",
    image: IMAGES.item13,
    title: "Nova Stride Street Stompers",
    price: "$99",
    delevery: "FREE Delivery",
    offer: "40% OFF",
  },
];

type ProductsScreenProps = StackScreenProps<RootStackParamList, "Products">;

const Products = ({ navigation, route }: ProductsScreenProps) => {
  const categoryId = route.params?.categoryId; // dynamic category
  const categoryName = route.params?.categoryName; // optional display name
  const [products, setProducts] = useState<[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/products`);
        let allProducts = response.data;
          if (categoryId) {
          // Filter products dynamically based on categoryId
          allProducts = allProducts.filter((p: any) => p.categoryId === categoryId);
        }
        console.log("product api", response.data);
        setProducts(allProducts);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [show, setshow] = useState(true);

  const sheetRef = useRef<any>(null);

  const dispatch = useDispatch();

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
        <View
          style={{
            height: 60,
            backgroundColor: colors.card,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.actionBtn,
              {
                backgroundColor: theme.dark
                  ? "rgba(255,255,255,0.10)"
                  : colors.background,
              },
            ]}
          >
            <Ionicons size={20} color={colors.title} name="chevron-back" />
          </TouchableOpacity>
          <View
            style={{
              height: 45,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: colors.border,
              flex: 1,
              marginLeft: 10,
            }}
          >
            <TextInput
              placeholder="Search Products"
              placeholderTextColor={
                theme.dark ? "rgba(255, 255, 255, .6)" : "rgba(0, 0, 0, 0.6)"
              }
              style={{
                ...FONTS.fontRegular,
                fontSize: 16,
                color: colors.title,
                paddingLeft: 40,
                flex: 1,
                paddingRight: 10,
              }}
            />
            <View style={{ position: "absolute", top: 12, left: 10 }}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  tintColor: colors.title,
                }}
                source={IMAGES.search}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{ padding: 10, marginLeft: 10 }}
            onPress={() => {
              setshow(!show);
            }}
          >
            <Image
              style={{
                height: 22,
                width: 22,
                resizeMode: "contain",
                tintColor: colors.title,
              }}
              source={show ? IMAGES.list : IMAGES.grid}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 10, marginRight: 10 }}
            onPress={() => navigation.navigate("MyCart")}
          >
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                tintColor: colors.title,
              }}
              source={IMAGES.mycart}
            />
            <View
              style={[
                GlobalStyleSheet.notification,
                { position: "absolute", right: 3, bottom: 22 },
              ]}
            >
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 10,
                  color: COLORS.white,
                }}
              >
                {show ? cardgridData.length : cardlistData.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          GlobalStyleSheet.container,
          { paddingTop: 10, paddingBottom: 0 },
        ]}
      >
        <View style={{ marginHorizontal: -15, marginBottom: 20 }}>
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
                justifyContent: "center",
              }}
            >
              {sliderData.map((data: any, index: any) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ProductsDetails")}
                    key={index}
                    style={{
                      backgroundColor: theme.dark
                        ? "rgba(255,255,255,0.10)"
                        : colors.background,
                      height: 34,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      //borderWidth: 1,
                      //borderColor: theme.dark ? COLORS.white : colors.borderColor,
                      marginTop: 5,
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        ...FONTS.fontMedium,
                        fontSize: 13,
                        color: colors.title,
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}>
        <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
          <View style={{ marginBottom: 20 }}>
            <Image
              style={{ height: 53, width: "100%", borderRadius: 8 }}
              source={IMAGES.ads1}
            />
          </View>
          <View>
            {show ? (
              <View style={[GlobalStyleSheet.row]}>
                {products?.map((data: any, index: any) => {
                  return (
                    <View
                      key={index}
                      style={[GlobalStyleSheet.col50, { marginBottom: 20 }]}
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
                        onPress={() => navigation.navigate("ProductsDetails")}
                      />
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={{ marginTop: -10, marginHorizontal: -15 }}>
                {cardlistData.map((data: any, index) => {
                  return (
                    <View key={index}>
                      <Cardstyle2
                        id={data.id}
                        title={data.title}
                        price={data.price}
                        delevery={data.delevery}
                        image={data.image}
                        offer={data.offer}
                        removelikebtn
                        onPress1={() => addItemToWishList(data)}
                        onPress={() => navigation.navigate("ProductsDetails")}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          {
            backgroundColor: theme.dark ? COLORS.primary : COLORS.white,
            height: 60,
            width: "100%",
            flexDirection: "row",
            position: "absolute",
            left: 0,
            bottom: 0,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            //zIndex:99
          },
          Platform.OS === "ios" && {
            height: 80,
          },
        ]}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
          ///onPress={() => GenderRef.current.openSheet()}
          onPress={() => sheetRef.current.openSheet("gender")}
        >
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              tintColor: colors.title,
            }}
            source={IMAGES.user3}
          />
          <Text
            style={{ ...FONTS.fontMedium, fontSize: 15, color: colors.title }}
          >
            GENDER
          </Text>
        </TouchableOpacity>
        <View
          style={{ width: 1, height: 32, backgroundColor: "#D9D9D9", top: 15 }}
        ></View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
          onPress={() => sheetRef.current.openSheet("short")}
        >
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              tintColor: colors.title,
            }}
            source={IMAGES.arrowup}
          />
          <Text
            style={{ ...FONTS.fontMedium, fontSize: 15, color: colors.title }}
          >
            SORT
          </Text>
        </TouchableOpacity>
        <View
          style={{ width: 1, height: 32, backgroundColor: "#D9D9D9", top: 15 }}
        ></View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
          onPress={() => sheetRef.current.openSheet("filter")}
        >
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              tintColor: colors.title,
            }}
            source={IMAGES.filter2}
          />
          <Text
            style={{ ...FONTS.fontMedium, fontSize: 15, color: colors.title }}
          >
            FILTER
          </Text>
        </TouchableOpacity>
      </View>

      <BottomSheet2 ref={sheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    ...FONTS.fontMedium,
  },
  actionBtn: {
    height: 45,
    width: 45,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    marginLeft: 15,
  },
});

export default Products;
