import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import ProductGrid from "../../components/Category/ProductGrid";
import { useAddToCart } from "../../hooks/useAddToCart";
import ProductSearch from "../../components/Search/ProductSearch";
import { useSharedValue } from "react-native-reanimated";
import FilterBar from "../../components/Category/FilterBar";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import FilterBottomSheet from "../../components/Category/FilterBottomSheet";

type Props = StackScreenProps<RootStackParamList, "ShopBySearch">;

const ShopBySearch = ({ navigation, route }: Props) => {
  const addItemToCart = useAddToCart();
  const isOpen = useSharedValue(false);
  const products = route.params?.products || [];
  const initialTitle = route.params?.title || "";
  const [query, setQuery] = useState(
    typeof initialTitle === "string"
      ? initialTitle.replace(/^Search:\s*/i, "")
      : "",
  );

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  const filterCriterias = [
    {
      title: "PRICE RANGE",
      values: [
        "KD 1 - KD 5",
        "KD 5 - KD 10",
        "KD 10 - KD 15",
        "KD 15 - KD 20",
        "KD 20 - KD 25",
        "KD 25 +"
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <ProductSearch
            onBackPress={() => navigation.goBack()}
            value={query}
            onChangeText={setQuery}
            placeholder="Search for products"
            onFilterPress={() => {}}
          />
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <FilterBar onFilterPress={toggleSheet} />
        </View>

        {products.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 16,
                color: "rgba(140, 140, 140, 1)",
              }}
            >
              No products found
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
            <ProductGrid
              productCardImageHeight={190}
              products={products}
              addToCart={addItemToCart}
              navigation={navigation}
            />
          </View>
        )}
      </ScrollView>

      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        <FilterBottomSheet
          onClose={toggleSheet}
          filterCriterias={filterCriterias}
        />
      </LocationBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ShopBySearch;
