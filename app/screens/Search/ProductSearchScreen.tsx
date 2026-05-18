import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RECENT_KEY = "recent_searches_v2";
const MAX_RECENT = 10;
const apiPath = ApiClient();

type RecentItem = { term: string; imageUrl?: string };
type Props = StackScreenProps<RootStackParamList, "ProductSearch">;

const ProductSearchScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentItem[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);

  const address = useSelector((x: any) => x.user.defaultAddress);
  const govId = address?.governorate?.id;
  const cityId = address?.city?.id;
  const blockId = address?.block?.id;

  // Load persisted recent searches
  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then((val) => {
      if (val) setRecentSearches(JSON.parse(val));
    });
  }, []);

  // Load trending products from top-discounts
  useEffect(() => {
    if (!govId || !cityId || !blockId) return;
    apiPath
      .get(
        `${Url}/api/products/top-discounts?gov=${govId}&city=${cityId}&block=${blockId}&limit=12`,
      )
      .then((r) => setTrendingProducts(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, [govId, cityId, blockId]);

  // Autofocus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const saveRecent = async (term: string, imageUrl?: string) => {
    const t = term.trim();
    if (!t) return;
    const entry: RecentItem = { term: t, imageUrl };
    const updated = [
      entry,
      ...recentSearches.filter((x) => x.term !== t),
    ].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const removeRecent = async (term: string) => {
    const updated = recentSearches.filter((x) => x.term !== term);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const clearAllRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify([]));
  };

  // Debounced live search — fixed: no stray space before `=`
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (!govId || !cityId || !blockId) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiPath.get(
          `${Url}/api/products?gov=${govId}&city=${cityId}&block=${blockId}&search=${encodeURIComponent(q)}`,
        );
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, govId, cityId, blockId]);

  const handleSubmit = () => {
    const q = query.trim();
    if (!q) return;
    const firstImage = results[0]?.imageUrl ?? results[0]?.image ?? undefined;
    saveRecent(q, firstImage);
    Keyboard.dismiss();
    navigation.navigate("ShopBySearch", {
      title: `Search: ${q}`,
      products: results,
    });
  };

  const handleTermPress = (term: string) => {
    setQuery(term);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const showEmpty = query.trim().length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <StatusBar style="light" />

      {/* ── Purple brand header ── */}
      <LinearGradient
        colors={["#1E123D", "#0C0028"]}
        style={[styles.header, { paddingTop: Math.max(insets.top + 12, 28) }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.inputPill}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.55)" />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search products…"
            placeholderTextColor="rgba(255,255,255,0.38)"
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.45)" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* ── Body ── */}
      {showEmpty ? (
        <ScrollView
          style={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Recent Searches — circular bubbles */}
          {recentSearches.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearAllRecent}>
                  <Text style={styles.clearAll}>Clear all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentScroll}
              >
                {recentSearches.map((item) => (
                  <TouchableOpacity
                    key={item.term}
                    style={styles.recentItem}
                    onPress={() => handleTermPress(item.term)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.recentCircle}>
                      {item.imageUrl ? (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.recentImg}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="time" size={28} color="#bbb" />
                      )}
                      <TouchableOpacity
                        style={styles.recentRemoveBadge}
                        onPress={() => removeRecent(item.term)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Ionicons name="close" size={9} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.recentLabel} numberOfLines={2}>
                      {item.term}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Trending Searches — 2-column grid */}
          {trendingProducts.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Trending Searches</Text>
              </View>

              <View style={styles.trendingGrid}>
                {trendingProducts.slice(0, 12).map((item, index) => {
                  const title = item?.title ?? "";
                  const imageUrl =
                    item?.imageUrl ?? item?.image ?? item?.thumbnail ?? null;
                  const isRightCol = index % 2 === 1;
                  return (
                    <TouchableOpacity
                      key={item.id ?? item.slug ?? index}
                      style={[
                        styles.trendingCard,
                        isRightCol && styles.trendingCardRight,
                      ]}
                      activeOpacity={0.75}
                      onPress={() => {
                        const productId =
                          item?.slug || String(item?.id || "");
                        if (!productId) return;
                        navigation.navigate("ProductsDetails", { productId });
                      }}
                    >
                      <View style={styles.trendingThumb}>
                        {imageUrl ? (
                          <Image
                            source={{ uri: imageUrl }}
                            style={styles.trendingImg}
                            resizeMode="contain"
                          />
                        ) : (
                          <Ionicons
                            name="image-outline"
                            size={20}
                            color="#ccc"
                          />
                        )}
                      </View>
                      <Text style={styles.trendingTitle} numberOfLines={2}>
                        {title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Fallback when nothing is loaded yet */}
          {recentSearches.length === 0 && trendingProducts.length === 0 && (
            <View style={styles.centerState}>
              <Ionicons name="search-outline" size={60} color="#ddd" />
              <Text style={styles.emptyTitle}>Search for anything</Text>
              <Text style={styles.stateText}>
                Find products by name, brand, or category
              </Text>
            </View>
          )}
        </ScrollView>
      ) : loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#1E123D" />
          <Text style={styles.stateText}>Searching…</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="search-outline" size={60} color="#ddd" />
          <Text style={styles.emptyTitle}>No results for "{query}"</Text>
          <Text style={styles.stateText}>
            Try a different spelling or keyword
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item, i) => String(item?.id ?? item?.slug ?? i)}
          style={styles.body}
          contentContainerStyle={{ paddingVertical: 6 }}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {results.length} result{results.length !== 1 ? "s" : ""} for "
              {query}"
            </Text>
          }
          renderItem={({ item }) => {
            const title = item?.title ?? "";
            const category =
              item?.subCategory?.title ??
              item?.category?.title ??
              item?.subcategory?.title ??
              "";
            const imageUrl =
              item?.imageUrl ?? item?.image ?? item?.thumbnail ?? null;
            const bestVariant =
              item?.bestVariant ?? item?.variants?.[0] ?? null;
            const salePrice =
              bestVariant?.salePrice ?? item?.salePrice ?? null;
            const origPrice = bestVariant?.price ?? item?.price ?? null;
            const hasDiscount =
              salePrice != null && origPrice != null && origPrice > salePrice;

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  const productId = item?.slug || String(item?.id || "");
                  if (!productId) return;
                  saveRecent(query.trim(), imageUrl ?? undefined);
                  navigation.navigate("ProductsDetails", { productId });
                }}
                style={styles.resultRow}
              >
                <View style={styles.resultThumb}>
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.thumbImg}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name="image-outline"
                      size={26}
                      color="rgba(0,0,0,0.18)"
                    />
                  )}
                </View>

                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  {category ? (
                    <Text style={styles.resultCategory} numberOfLines={1}>
                      {category}
                    </Text>
                  ) : null}
                  <View style={styles.priceRow}>
                    {salePrice != null && (
                      <Text style={styles.salePrice}>KD {salePrice}</Text>
                    )}
                    {hasDiscount && (
                      <Text style={styles.origPrice}>KD {origPrice}</Text>
                    )}
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="rgba(0,0,0,0.25)"
                />
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#1E123D" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Lato-Regular",
    color: "#fff",
    padding: 0,
  },

  body: { flex: 1, backgroundColor: "#F4F4F6" },

  // Cards
  card: {
    backgroundColor: "#fff",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    color: "#111",
  },
  clearAll: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "#1E123D",
  },

  // Recent — circular bubbles
  recentScroll: { gap: 18, paddingRight: 4 },
  recentItem: { alignItems: "center", width: 72 },
  recentCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    overflow: "visible",
  },
  recentImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  recentRemoveBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  recentLabel: {
    fontFamily: "Lato-Regular",
    fontSize: 11,
    color: "#444",
    textAlign: "center",
    maxWidth: 70,
  },

  // Trending — 2-col grid
  trendingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  trendingCard: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  trendingCardRight: {
    paddingLeft: 4,
  },
  trendingThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  trendingImg: { width: "100%", height: "100%" },
  trendingTitle: {
    flex: 1,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "#222",
    lineHeight: 17,
  },

  // Center states
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
    backgroundColor: "#F4F4F6",
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: "Lato-SemiBold",
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
    textAlign: "center",
  },
  stateText: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "rgba(0,0,0,0.38)",
    textAlign: "center",
  },

  // Results list
  resultsCount: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.45)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F4F4F6",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    gap: 12,
  },
  resultThumb: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  resultInfo: { flex: 1, gap: 3 },
  resultTitle: {
    fontFamily: "Lato-SemiBold",
    fontSize: 14,
    color: "#111",
  },
  resultCategory: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "rgba(0,0,0,0.45)",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  salePrice: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    color: "#1E123D",
  },
  origPrice: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "rgba(0,0,0,0.35)",
    textDecorationLine: "line-through",
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginLeft: 86,
  },
});

export default ProductSearchScreen;
