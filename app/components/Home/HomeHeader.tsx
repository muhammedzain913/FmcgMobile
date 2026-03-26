import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { FONTS } from "../../constants/theme";

interface HomeHeaderProps {
  governorate?: { name: string } | null;
  city?: { name: string } | null;
  block?: { name: string } | null;
  onLocationPress: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder?: string; // Optional dynamic placeholder (e.g., "Search 'Vegetables'")
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  governorate,
  city,
  block,
  onLocationPress,
  searchQuery,
  onSearchChange,

  searchPlaceholder,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Function to get color for different categories
  const getCategoryColor = (categoryName: string): string => {
    const categoryColors: { [key: string]: string } = {
      Vegetables: "#FF6B35", // Orange/Red
      Fruits: "#4CAF50", // Green
      "Vegetables & Fruits": "#FF6B35", // Orange/Red
      Electronics: "#2196F3", // Blue
      "Dairy Products": "#FFC107", // Amber/Yellow
      "Diary Products": "#FFC107", // Amber/Yellow
      Snacks: "#E91E63", // Pink
      "Ice Cream": "#00BCD4", // Cyan
      Beverages: "#9C27B0", // Purple
      Meat: "#F44336", // Red
      Bakery: "#FF9800", // Deep Orange
      Frozen: "#00E5FF", // Light Cyan
    };

    // Check for exact match first
    if (categoryColors[categoryName]) {
      return categoryColors[categoryName];
    }

    // Check for partial match (case insensitive)
    const lowerCategory = categoryName.toLowerCase();
    for (const [key, color] of Object.entries(categoryColors)) {
      if (
        lowerCategory.includes(key.toLowerCase()) ||
        key.toLowerCase().includes(lowerCategory)
      ) {
        return color;
      }
    }

    // Default color if no match found
    return "#FF6B35"; // Default orange/red
  };

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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <Image
                  style={styles.locationIcon}
                  source={require("../../assets/images/icons/locationpin.png")}
                />
                <Text style={styles.locationText}>{governorate?.name}</Text>
                <TouchableOpacity onPress={onLocationPress}>
                  <Image
                    style={styles.chevronIcon}
                    source={require("../../assets/images/icons/down-chevron.png")}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.locationSubText}>
                  {city?.name} , Block {block?.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              activeOpacity={0.7}
            >
              <View style={{ borderRadius: 50, overflow: "hidden" }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  resizeMode="cover"
                  source={require("../../assets/images/profilepic.jpg")}
                />
              </View>
            </TouchableOpacity>
          </View>

          <LinearGradient
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

              {/* Text Input Container */}
              <View style={styles.textInputContainer}>
                {/* Text Input */}
                <TextInput
                  placeholder=""
                  value={searchQuery}
                  style={styles.textInput}
                  onChangeText={onSearchChange}
                  onFocus={() => {
                    // Open dedicated search screen instead of typing on Home.
                    navigation.navigate("ProductSearch");
                  }}
                />

                {/* Custom Placeholder with Colored Category */}
                {!searchQuery && searchPlaceholder && (
                  <View
                    style={styles.placeholderContainer}
                    pointerEvents="none"
                  >
                    {(() => {
                      // Parse placeholder: "Search 'CategoryName'" or "Search Product"
                      const match =
                        searchPlaceholder.match(/Search\s+'?([^']+)'?/);
                      if (match && match[1]) {
                        // Has category name - get color for this category
                        const categoryName = match[1];
                        const categoryColor = getCategoryColor(categoryName);
                        return (
                          <Text style={styles.placeholderText}>
                            Search '
                            <Text
                              style={[
                                styles.categoryText,
                                { color: categoryColor },
                              ]}
                            >
                              {categoryName}
                            </Text>
                            '
                          </Text>
                        );
                      } else {
                        // No category, just show as is
                        return (
                          <Text style={styles.placeholderText}>
                            {searchPlaceholder}
                          </Text>
                        );
                      }
                    })()}
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
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
    gap: 20,
  },
  locationContainer: {
    gap: 10,
  },
  locationRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  locationIcon: {
    width: 15,
    height: 15,
  } as const,
  locationText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  locationSubText: {
    fontFamily: "Lato-Regular",
    fontSize: 15,
    color: "#FFFFFF",
  },
  chevronIcon: {
    width: 16,
    height: 16,
    tintColor: "#FFFFFF",
  } as const,
  gradientBorder: {
    borderRadius: 8,
    padding: 1,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 6,
  },
  searchBoxCotainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 8,
    backgroundColor: "rgba(44, 33, 71, 1)",
    shadowColor: "rgb(115, 158, 123)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: "#FFFFFF",
  },
  searchBoxDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#fff",
  },
  textInputContainer: {
    flex: 1,
    position: "relative",
    height: 50,
    justifyContent: "center",
  },
  textInput: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Regular",
    padding: 0,
  },
  placeholderContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 50,
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: "#FFFFFF",
  },
  categoryText: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    // Color will be set dynamically based on category
  },
});
