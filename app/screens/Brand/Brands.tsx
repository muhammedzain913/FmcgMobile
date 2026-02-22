import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";

type BrandsScreenProps = StackScreenProps<RootStackParamList, "Brands">;

const Brands = ({ navigation }: BrandsScreenProps) => {
  const apiPath = ApiClient();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBrands, setFilteredBrands] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await apiPath.get(`${Url}/api/brands`);
        console.log("brands api", response.data);
        setBrands(response.data || []);
        setFilteredBrands(response.data || []);
      } catch (error: any) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter((brand) =>
        brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchQuery, brands]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={require("../../assets/images/icons/CaretLeft.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Our Brands</Text>
          <View style={styles.placeholderView} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Image
              source={require("../../assets/images/icons/searchiconimg.png")}
              style={styles.searchIcon}
            />
            <View style={styles.searchDivider} />
            <TextInput
              placeholder="Search Brands..."
              placeholderTextColor="rgba(140, 140, 140, 1)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Brands Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E123D" />
          </View>
        ) : filteredBrands.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No brands found</Text>
          </View>
        ) : (
          <View style={styles.brandsContainer}>
            <ScrollView
              contentContainerStyle={styles.brandsGrid}
              showsVerticalScrollIndicator={false}
            >
              {filteredBrands.map((brand: any, index: number) => (
                <TouchableOpacity
                  key={brand.id || index}
                  style={styles.brandCard}
                  onPress={() => {
                    // Navigate to brand products with brandId and brand details
                    navigation.navigate("ShopByBrand", { brandId: brand.id, brand: brand });
                  }}
                >
                  <View style={styles.brandImageContainer}>
                    {brand.logoUrl || brand.imageUrl ? (
                      <Image
                        source={{ uri: brand.logoUrl || brand.imageUrl }}
                        style={styles.brandImage}
                        resizeMode="contain"
                      />
                    ) : brand.name ? (
                      <View style={styles.brandNameContainer}>
                        <Text style={styles.brandNameText} numberOfLines={2}>
                          {brand.name}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Brands;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(220, 220, 220, 1)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  backIcon: {
    width: 15,
    height: 20,
    tintColor: "#000000",
  },
  headerTitle: {
    fontFamily: "Lato-Bold",
    fontSize: 20,
    lineHeight: 32,
    letterSpacing: -0.48,
    color: "#000000",
    fontWeight: "700",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  placeholderView: {
    width: 40,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBox: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(220, 220, 220, 1)",
    borderWidth: 1,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#000000",
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#000000",
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    fontFamily: "Lato-Regular",
    color: "#000000",
    padding: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    color: "rgba(140, 140, 140, 1)",
  },
  brandsContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    // Subtle border only on top and bottom for shadow effect
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  brandsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: 10,
  },
  brandCard: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 5,
  },
  brandImageContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    // Reduced shadow for individual brand boxes
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  brandImage: {
    width: "100%",
    height: "100%",
  },
  brandNameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  brandNameText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
  },
});
