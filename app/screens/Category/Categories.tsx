import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { useSelector } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useAddToCart } from "../../hooks/useAddToCart";

import { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import CategoriesHeader from "../../components/Category/CategoriesHeader";
import CategorySidebar from "../../components/Category/CategorySidebar";
import FilterBar from "../../components/Category/FilterBar";
import ProductGrid from "../../components/Category/ProductGrid";
import FilterBottomSheet from "../../components/Category/FilterBottomSheet";
import { useFocusEffect } from "@react-navigation/native";
import GroceryGifLoader from "../../components/loading/GroceryGifLoader";

type CategoriesScreenProps = StackScreenProps<RootStackParamList, "Categories">;

type PriceRange = { min?: number; max?: number };
type FilterObject = {
  priceRanges: PriceRange[];
  brands: string[];
  sort: "price_asc" | "price_desc" | "discount_desc" | "newest" | "";
};

const Categories = ({ navigation, route }: CategoriesScreenProps) => {
  const apiPath = ApiClient();
  const addItemToCart = useAddToCart();
  const [products, setProducts] = useState<any[]>([]);
  const address = useSelector((x: any) => x.user.defaultAddress);
  const [categories, setCategories] = useState<any[]>([]);
  const [brandNames, setBrandNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState<FilterObject>({
    priceRanges: [],
    brands: [],
    sort: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(
    route.params?.categoryTitle || "All",
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const isOpen = useSharedValue(false);
  const [filterInitial, setFilterInitial] = useState<string>("PRICE RANGE");
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
        "KD 1 - KD 5",
        "KD 5 - KD 10",
        "KD 10 - KD 15",
        "KD 15 - KD 20",
        "KD 20 - KD 25",
        "KD 25 +",
      ],
    },
    {
      title: "BRANDS",
      values: brandNames,
    },
  ];

  const openSheet = (initial: string = "PRICE RANGE") => {
    setFilterInitial(initial);
    isOpen.value = true;
  };

  const closeSheet = () => {
    isOpen.value = false;
  };

  // Ensure the bottom sheet never "sticks" open across navigations / focus changes.
  useFocusEffect(
    React.useCallback(() => {
      isOpen.value = false;
      return () => {
        isOpen.value = false;
      };
    }, []),
  );

  const parsePriceRangeLabel = (label: string): PriceRange | null => {
    const trimmed = label.trim();
    // Extract all numbers (works for: "KD 1 - KD 5", "KD 25 +", etc.)
    const nums = trimmed.match(/\d+(?:\.\d+)?/g)?.map((n) => parseFloat(n)) ?? [];
    if (nums.length === 0) return null;

    if (trimmed.includes("+")) {
      // "KD 25 +"
      return { min: nums[0] };
    }

    if (nums.length >= 2) {
      const [min, max] = nums;
      if (!Number.isNaN(min) && !Number.isNaN(max)) return { min, max };
    }

    // Fallback: single number without '+': treat as min
    if (!Number.isNaN(nums[0])) return { min: nums[0] };
    return null;
  };

  const mapSortOption = (label: string): FilterObject["sort"] => {
    switch (label) {
      case "Price (Low To High)":
        return "price_asc";
      case "Price (High To Low)":
        return "price_desc";
      case "Discount (High To Low)":
        return "discount_desc";
      default:
        return "";
    }
  };

  const getEffectiveSalePrice = (p: any): number | null => {
    const fromProduct = p?.salePrice;
    const fromFirstVariant = p?.variants?.[0]?.salePrice;
    const raw = fromProduct ?? fromFirstVariant;
    if (raw === null || raw === undefined) return null;
    const n = typeof raw === "number" ? raw : parseFloat(String(raw));
    return Number.isFinite(n) ? n : null;
  };

  const getEffectiveDiscountPct = (p: any): number => {
    const variant = p?.variants?.[0];
    const salePrice = variant?.salePrice ?? p?.salePrice;
    const originalPrice = variant?.price ?? p?.price;
    if (!originalPrice || !salePrice || originalPrice <= 0) return 0;
    return ((originalPrice - salePrice) / originalPrice) * 100;
  };

  const applyFiltersToProducts = (base: any[], nextFilters: FilterObject) => {
    let out = [...(base || [])];

    if (nextFilters.brands.length > 0) {
      const set = new Set(nextFilters.brands);
      out = out.filter((p: any) => (p?.brand?.name ? set.has(p.brand.name) : false));
    }

    if (nextFilters.priceRanges.length > 0) {
      out = out.filter((p: any) => {
        const price = getEffectiveSalePrice(p);
        if (price === null) return false;
        return nextFilters.priceRanges.some((r) => {
          const minOk = r.min === undefined ? true : price >= r.min;
          const maxOk = r.max === undefined ? true : price <= r.max;
          return minOk && maxOk;
        });
      });
    }

    if (nextFilters.sort === "price_asc") {
      out.sort((a: any, b: any) => (getEffectiveSalePrice(a) ?? 0) - (getEffectiveSalePrice(b) ?? 0));
    } else if (nextFilters.sort === "price_desc") {
      out.sort((a: any, b: any) => (getEffectiveSalePrice(b) ?? 0) - (getEffectiveSalePrice(a) ?? 0));
    } else if (nextFilters.sort === "discount_desc") {
      out.sort((a: any, b: any) => getEffectiveDiscountPct(b) - getEffectiveDiscountPct(a));
    }

    setDisplayedProducts(out);
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
        `${Url}/api/products?subCategoryId=${subcategoryId}&governorate=${governorateId}&city=${cityId}&block=${blockId}&search=${searchQuery}`,
      );
      console.log("Products by subcategory API", response.data.length);
      setProducts(response.data);
      // Re-apply any active filters to the fresh data
      applyFiltersToProducts(response.data, filters);
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
    const fetchBrands = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/brands`);
        const names =
          (response.data || [])
            .map((b: any) => b?.name)
            .filter(Boolean) || [];
        setBrandNames(names);
      } catch (e) {
        setBrandNames([]);
      }
    };
    fetchBrands();
  }, []);


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setSubcategoriesLoading(true);
        // If categoryId is provided, fetch subcategories for that category
        if (route.params?.categoryId) {
          const response = await apiPath.get(
            `${Url}/api/categories/${route.params.categoryId}/subcategories`
          );
          setCategories(response.data);
        } else {
          // If no categoryId, fetch all categories (fallback)
          const response = await apiPath.get(`${Url}/api/categories`);
          setCategories(response.data);
        }
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setSubcategoriesLoading(false);
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

  const handleApplyFilters = (payload: {
    priceRanges: string[];
    brands: string[];
    sort: string;
  }) => {
    const next: FilterObject = {
      priceRanges: payload.priceRanges
        .map(parsePriceRangeLabel)
        .filter(Boolean) as PriceRange[],
      brands: payload.brands,
      sort: mapSortOption(payload.sort),
    };
    setFilters(next);
    applyFiltersToProducts(products, next);
  };

  const handleClearFilters = () => {
    const cleared: FilterObject = { priceRanges: [], brands: [], sort: "" };
    setFilters(cleared);
    setDisplayedProducts(products);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffff",  }}>
      <View style={{ flex: 1, gap: 0 }}>
        <CategoriesHeader categoryName={route.params?.categoryTitle} />

        <View style={{ flexDirection: "row", flex: 1, minWidth: 0 }}>
          <CategorySidebar
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            categoryChangeAnim={categoryChangeAnim}
            indicatorHeight={INDICATOR_HEIGHT}
          />

          <View style={{ flex: 1 }}>
            <FilterBar
              onFilterPress={() => openSheet("PRICE RANGE")}
              onSortPress={() => openSheet("SORT")}
              onPricePress={() => openSheet("PRICE RANGE")}
              onBrandPress={() => openSheet("BRANDS")}
              backgroundColor="#F9F9F9"
              hasActiveSort={filters.sort !== ""}
              hasActivePrice={filters.priceRanges.length > 0}
              hasActiveBrand={filters.brands.length > 0}
            />
            <ProductGrid
              products={displayedProducts || []}
              addToCart={addItemToCart}
              navigation={navigation}
            />
          </View>
        </View>
      </View>

      <LocationBottomSheet isOpen={isOpen} toggleSheet={closeSheet}>
        <FilterBottomSheet
          onClose={closeSheet}
          filterCriterias={filterCriterias}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          initialFilter={filterInitial}
        />
      </LocationBottomSheet>


      <GroceryGifLoader visible={subcategoriesLoading} />
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
