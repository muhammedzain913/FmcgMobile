import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Ionicons } from "@expo/vector-icons";

const LOGO_COLORS = ["#FFB800", "#F26522", "#6B3FA0", "#09A86B"];

const SEARCH_TERMS = [
  "Fresh Milk",
  "Mineral Water",
  "Olive Oil",
  "Rice",
  "Detergent",
  "Body Wash",
  "Juice",
  "Chocolate",
  "Biscuits",
  "Shampoo",
  "Eggs",
  "Bread",
];

interface HomeHeaderProps {
  governorate?: { name: string } | null;
  city?: { name: string } | null;
  block?: { name: string } | null;
  onLocationPress: () => void;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  governorate,
  city,
  block,
  onLocationPress,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [termIndex, setTermIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Swap term + color while invisible
        setTermIndex((prev) => (prev + 1) % SEARCH_TERMS.length);
        setColorIndex((prev) => (prev + 1) % LOGO_COLORS.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={styles.headerContainer}>
      <LinearGradient colors={["rgba(30, 18, 61, 1)", "rgba(12, 0, 40, 1)"]}>
        <ImageBackground
          style={[
            styles.imageBackground,
            { paddingTop: Math.max(insets.top + 20, 40) },
          ]}
          source={require("../../assets/images/maskgroup.png")}
        >
          {/* Location + Profile row */}
          <View style={styles.topRow}>
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={15} color="#FFFFFF" />
                <Text style={styles.locationText}>{governorate?.name}</Text>
                <TouchableOpacity onPress={onLocationPress}>
                  <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.locationSubText}>
                {city?.name} , Block {block?.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle" size={50} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ProductSearch")}
            style={styles.searchBox}
          >
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
            <View style={styles.searchDivider} />
            <Animated.View style={[styles.placeholderRow, { opacity: fadeAnim }]}>
              <Text style={styles.searchPrefix}>Search </Text>
              <Text style={[styles.searchTerm, { color: LOGO_COLORS[colorIndex] }]}>
                '{SEARCH_TERMS[termIndex]}'
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    padding: 20,
    gap: 18,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    gap: 6,
  },
  locationRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  locationText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  locationSubText: {
    fontFamily: "Lato-Regular",
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    gap: 10,
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  placeholderRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchPrefix: {
    fontFamily: "Lato-Regular",
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
  },
  searchTerm: {
    fontFamily: "Lato-SemiBold",
    fontSize: 15,
  },
});
