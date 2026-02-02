import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
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

const apiPath = ApiClient();

type AllCategoriesScreenProps = StackScreenProps<
  RootStackParamList,
  "AllCategories"
>;

const AllCategories = () => {
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

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  //const navigation = useNavigation()

  const sheetRef = useRef<any>(null);

  const { governorate, city, block } = useLocationSelector();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
      <ScrollView contentContainerStyle={{gap : 30}} showsVerticalScrollIndicator={false}>
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
              style={{ flex: 1, padding: 20, paddingTop: 100 }}
              source={require("../../assets/images/maskgroup.png")}
            >
              <View style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                    source={require("../../assets/images/icons/locationaddress.png")}
                  />
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 20,
                      fontWeight: "700",
                      lineHeight: 28,
                      color: "#FFFFFF",
                    }}
                  >
                    {governorate?.name}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 13,
                      fontWeight: "400",
                      lineHeight: 28,
                      color: "rgba(217, 217, 217, 1)",
                    }}
                  >
                    {city?.name} , Block {block?.name}
                  </Text>
                </View>
              </View>

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
                  <Text style={styles.placeholder}>
                    Search <Text style={styles.highlight}>"Snacks"</Text>
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </LinearGradient>
        </View>

        <View style={{flexDirection : 'row',flexWrap : 'wrap',justifyContent : 'flex-start', gap : 10,paddingHorizontal : 15}}>
          {categories?.map((data: any, index: any) => {
            return (
              <View key={index} style={{ gap: 5, width: '23%' }}>
                <TouchableOpacity onPress={() => {navigation.navigate('Categories')}}>
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
        </View>
      </ScrollView>
      <BottomSheet2 ref={sheetRef} />
    </SafeAreaView>
  );
};

export default AllCategories;

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
});
