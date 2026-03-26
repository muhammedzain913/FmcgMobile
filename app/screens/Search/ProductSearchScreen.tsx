import React, { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import ProductSearch from "../../components/Search/ProductSearch";
import { useSelector } from "react-redux";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";

type Props = StackScreenProps<RootStackParamList, "ProductSearch">;

const apiPath = ApiClient();

const ProductSearchScreen = ({ navigation }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const address = useSelector((x: any) => x.user.defaultAddress);

  const recentSearches = useMemo(
    () => [
      { id: "perfume", label: "perfume" },
      { id: "bread-cake", label: "bread cake" },
    ],
    [],
  );

  const discoverMore = useMemo(
    () => [
      { id: "atta", label: "Atta" },
      { id: "ghee", label: "Ghee" },
      { id: "detergent", label: "Detergent" },
      { id: "oil", label: "Oil" },
      { id: "cold-drink", label: "Cold drink" },
      { id: "biscuit", label: "Biscuit" },
      { id: "dal", label: "Dal" },
      { id: "fruit-juice", label: "Fruit juice" },
      { id: "energy-drinks", label: "Energy drinks" },
      { id: "dry-fruits", label: "Dry fruits" },
      { id: "rice", label: "Rice" },
      { id: "toothpaste", label: "Toothpaste" },
    ],
    [],
  );

  useEffect(() => {
    const q = query.trim();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Need location ids like Home.tsx
    const govId = address?.governorate?.id;
    const cityId = address?.city?.id;
    const blockId = address?.block?.id;

    if (!govId || !cityId || !blockId) {
      setResults([]);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await apiPath.get(
          `${Url}/api/products?gov=${govId}&city=${cityId}&block=${blockId}&search =${encodeURIComponent(q)}`,
        );
        const data = Array.isArray(response.data) ? response.data : [];
        setResults(data);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [query, address?.governorate?.id, address?.city?.id, address?.block?.id]);

  const showSuggestions = query.trim().length === 0;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <ProductSearch
          onBackPress={() => navigation.goBack()}
          value={query}
          onChangeText={setQuery}
          placeholder="Search for products"
          onFilterPress={() => {}}
          onSubmit={() => {
            const q = query.trim();
            if (!q) return;
            Keyboard.dismiss();
            navigation.navigate("ShopBySearch", {
              title: `Search: ${q}`,
              products: results,
            });
          }}
          recentSearches={recentSearches.map((x) => ({
            ...x,
            onPress: () => setQuery(x.label),
          }))}
          discoverMore={discoverMore.map((x) => ({
            ...x,
            onPress: () => setQuery(x.label),
          }))}
        />

        {!showSuggestions ? (
          <View style={styles.resultsWrap}>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#1E123D" />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item, index) =>
                  String(item?.id ?? item?.slug ?? index)
                }
                renderItem={({ item }) => {
                  const title = item?.title ?? "";
                  const category =
                    item?.subCategory?.title ??
                    item?.category?.title ??
                    item?.subcategory?.title ??
                    "";
                  const imageUrl =
                    item?.imageUrl ??
                    item?.image ??
                    item?.thumbnail ??
                    item?.productImage ??
                    null;

                  return (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => {
                        const productId =
                          item?.slug || String(item?.id || "");
                        if (!productId) return;
                        navigation.navigate("ProductsDetails", { productId });
                      }}
                      style={styles.resultRow}
                    >
                      <View style={styles.thumb}>
                        {imageUrl ? (
                          <Image
                            source={{ uri: imageUrl }}
                            style={styles.thumbImg}
                            resizeMode="cover"
                          />
                        ) : null}
                      </View>

                      <View style={styles.resultTextCol}>
                        <Text style={styles.resultTitle} numberOfLines={1}>
                          {title}
                        </Text>
                        {category ? (
                          <Text style={styles.resultSub} numberOfLines={1}>
                            in {category}
                          </Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.sep} />}
              />
            )}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  resultsWrap: {
    flex: 1,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingTop: 6,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  loadingText: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "rgba(0,0,0,0.65)",
  },
  emptyRow: { paddingVertical: 16 },
  emptyText: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "rgba(0,0,0,0.55)",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  thumb: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  resultTextCol: { flex: 1, gap: 2 },
  resultTitle: {
    fontFamily: "Lato-SemiBold",
    fontSize: 15,
    color: "rgba(0,0,0,0.9)",
  },
  resultSub: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "rgba(0,0,0,0.55)",
  },
  resultArrow: {
    width: 14,
    height: 14,
    tintColor: "rgba(0,0,0,0.45)",
  },
  sep: { height: 1, backgroundColor: "rgba(0,0,0,0.06)" },
});

export default ProductSearchScreen;

