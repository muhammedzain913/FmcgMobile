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
import { useTheme } from "@react-navigation/native";
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
import HomeHeader from "../../components/Home/HomeHeader";
import CategoryCard from "../../components/Home/CategoryCard";

const apiPath = ApiClient();

type AllCategoriesScreenProps = StackScreenProps<
  RootStackParamList,
  "AllCategories"
>;

const AllCategories = ({ navigation }: AllCategoriesScreenProps) => {
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

  const {
    governorate,
    city,
    block,
    setGovVisible,
  } = useLocationSelector();
  
  const toggleSheet = () => {
    // Handle location sheet toggle if needed
    // For now, just a placeholder
    setGovVisible(true);
  };

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
            colors={["rgba(30, 18, 61, 1)", "rgba(12, 0, 40, 1)"]}
          >
            <HomeHeader
              governorate={governorate}
              city={city}
              block={block}
              
              onLocationPress={toggleSheet}
              searchQuery={searchQuery}
              onSearchChange={(e: string) => {
                setSearchQuety(e);
              }}
            />
          </LinearGradient>
        </View>

                <View
                  style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: 10,
            paddingHorizontal: 15,
                  }}
                >
          {categories?.map((data: any, index: any) => (
            <CategoryCard
              key={index}
              title={data.title}
              onPress={() => {
                navigation.getParent()?.navigate("Categories", {
                  categoryTitle: data.title,
                  categoryId: data.id,
                });
              }}
              containerStyle={{ width: "23%" }}
            />
          ))}
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
});
