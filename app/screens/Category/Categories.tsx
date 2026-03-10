import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { useSelector } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useAddToCart } from "../../hooks/useAddToCart";
import GlobalCartNotification from "../../components/Cart/GlobalCartNotification";
import { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import CategoriesHeader from "../../components/Category/CategoriesHeader";
import CategorySidebar from "../../components/Category/CategorySidebar";
import FilterBar from "../../components/Category/FilterBar";
import ProductGrid from "../../components/Category/ProductGrid";
import FilterBottomSheet from "../../components/Category/FilterBottomSheet";

type CategoriesScreenProps = StackScreenProps<RootStackParamList, "Categories">;

const Categories = ({ navigation, route }: CategoriesScreenProps) => {
  const apiPath = ApiClient();
  const addItemToCart = useAddToCart();
  const [products, setProducts] = useState<[]>();
  const address = useSelector((x: any) => x.user.defaultAddress);
  const [categories, setCategories] = useState<[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    route.params?.categoryTitle || "All",
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const isOpen = useSharedValue(false);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>();
  const [dealCategory, setDealCategory] = useState<any>();
  const [dealCategoryProducts, setDealCategoryProducts] = useState<any[]>();
  const [searchQuery, setSearchQuety] = useState<string>("");
  const categoryChangeAnim = useRef(new Animated.Value(0)).current;

  // Category item dimensions (measured from actual layout)
  const CATEGORY_IMAGE_HEIGHT = 60; // Image height
  const CATEGORY_TEXT_HEIGHT = 15; // Text height (fontSize: 10, lineHeight ~15px)
  const CATEGORY_MARGIN_BOTTOM = 20; // Margin between items
  const CATEGORY_ITEM_TOTAL_HEIGHT =
    CATEGORY_IMAGE_HEIGHT + CATEGORY_TEXT_HEIGHT + CATEGORY_MARGIN_BOTTOM; // 95px total
  const CATEGORY_CONTENT_HEIGHT = CATEGORY_IMAGE_HEIGHT + CATEGORY_TEXT_HEIGHT; // 75px (image + text, no margin)
  const INDICATOR_HEIGHT = 40; // Fixed indicator height

  const filterCriterias = [
    {
      title: "PRICE RANGE",
      values: [
        "₹500 - ₹1000",
        "₹1000 - ₹1500",
        "₹1500 - ₹2000",
        "₹2000 - ₹2500",
        "₹2500 - ₹3000",
        "₹3500 - ₹4000",
      ],
    },
    {
      title: "BRANDS",
      values: [
        "AVT",
        "Lays",
        "Minimalist",
        "Milma",
        "Elite Foods",
        "Britannia",
      ],
    },
  ];

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  // Fetch products by subcategory ID
  const fetchProductsBySubcategory = async (subcategoryId: string) => {
    if (!address) {
      console.log("No address available");
      return;
    }

    // Get location IDs
    const governorateId = address.governorate?.id || address.governorateId;
    const cityId = address.city?.id || address.cityId;
    const blockId = address.block?.id || address.blockId;

    if (!governorateId || !cityId || !blockId) {
      console.log("Missing location data in address");
      return;
    }

    try {
      setLoading(true);
      const response = await apiPath.get(
        `${Url}/api/products?subCatId=${subcategoryId}&gov=${governorateId}&city=${cityId}&block=${blockId}&search =${searchQuery}`,
      );
      console.log("Products by subcategory API", response.data.length);
      setProducts(response.data);
      setDisplayedProducts(response.data);
    } catch (error: any) {
      console.error("Error fetching products by subcategory:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    // Find the index of the selected category
    const selectedIndex = categories.findIndex(
      (cat: any) => cat.title === selectedCategory,
    );

    // If category not found, default to first item or 0
    const index = selectedIndex >= 0 ? selectedIndex : 0;

    const itemStartPosition = index * CATEGORY_ITEM_TOTAL_HEIGHT;
    const contentCenter = CATEGORY_CONTENT_HEIGHT / 2; // 40px (center of 80px: 60px image + 20px text)
    const indicatorOffset = INDICATOR_HEIGHT / 2.5; // 20px (half of 40px indicator)
    const toValue = itemStartPosition + contentCenter - indicatorOffset;

    Animated.timing(categoryChangeAnim, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedCategory, categories]);


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        // If categoryId is provided, fetch subcategories for that category
        if (route.params?.categoryId) {
          const response = await apiPath.get(
            `${Url}/api/categories/${route.params.categoryId}/subcategories`
          );
          console.log("subcategories api", response.data);
          setCategories(response.data);
        } else {
          // If no categoryId, fetch all categories (fallback)
          const response = await apiPath.get(`${Url}/api/categories`);
          console.log("category api", response.data);
          setCategories(response.data);
        }
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [route.params?.categoryId]);

  // Handle initial category selection from route params - set selectedCategory for indicator
  useEffect(() => {
    if (route.params?.categoryTitle && categories && categories.length > 0) {
      // Find the category by title and set it for the indicator
      const category = categories.find(
        (cat: any) => cat.title === route.params?.categoryTitle,
      );
      if (category) {
        setSelectedCategory(category.title);
      }
    }
  }, [route.params?.categoryTitle, categories]);

  // Auto-select first subcategory and fetch products when subcategories are loaded
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    if (!address) return;
    if (selectedSubcategoryId) return; // Don't auto-select if already selected

    // Auto-select the first subcategory
    const firstSubcategory = categories[0];
    if (firstSubcategory) {
      setSelectedCategory(firstSubcategory.title);
      setSelectedSubcategoryId(firstSubcategory.id);
      // Fetch products for the first subcategory
      fetchProductsBySubcategory(firstSubcategory.id);
    }
  }, [categories, address]);

  // Refetch products when search query changes (if subcategory is selected)
  useEffect(() => {
    if (selectedSubcategoryId && address) {
      fetchProductsBySubcategory(selectedSubcategoryId);
    }
  }, [searchQuery]);


  // useEffect(() => {
  //   if (!address) return;
  //   if (!address.governorate) return;
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await apiPath.get(
  //         `${Url}/api/products?gov=${address.governorate.id}&city=${address.city.id}&block=${address.block.id}&search =${searchQuery}`,
  //       );
  //       console.log("product api", response.data.length);
  //       setProducts(response.data);
  //       setDisplayedProducts(response.data);
  //     } catch (error: any) {
  //       setError(error.message || "Something went wrong");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, [searchQuery]);

  const handleCategorySelect = (subcategoryId: string, categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    setSelectedSubcategoryId(subcategoryId);
    // Fetch products from API with subcategory ID
    fetchProductsBySubcategory(subcategoryId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffff", paddingTop: 40 }}>
      <View style={{ flex: 1, gap: 0 }}>
        <CategoriesHeader />

        <View style={{ flexDirection: "row", flex: 1, minWidth: 0 }}>
          <CategorySidebar
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            categoryChangeAnim={categoryChangeAnim}
            indicatorHeight={INDICATOR_HEIGHT}
          />

          <View style={{ flex: 1 }}>
            <FilterBar onFilterPress={toggleSheet} />
            <ProductGrid
              products={displayedProducts || []}
              addToCart={addItemToCart}
              navigation={navigation}
            />
          </View>
        </View>
      </View>

      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        <FilterBottomSheet
          onClose={toggleSheet}
          filterCriterias={filterCriterias}
        />
      </LocationBottomSheet>

      <GlobalCartNotification />
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
});
