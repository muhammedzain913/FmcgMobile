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
import { FONTS } from "../../constants/theme";

interface HomeHeaderProps {
  governorate?: { name: string } | null;
  city?: { name: string } | null;
  block?: { name: string } | null;
  onLocationPress: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  governorate,
  city,
  block,
  onLocationPress,
  searchQuery,
  onSearchChange,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={["rgba(30, 18, 61, 1)", "rgba(12, 0, 40, 1)"]}
      >
        <ImageBackground
          style={[
            styles.imageBackground,
            { paddingTop: Math.max(insets.top + 20, 40) },
          ]}
          source={require("../../assets/images/maskgroup.png")}
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

              {/* Text Input */}
              <TextInput
                placeholder="Search Product"
                placeholderTextColor={"#fff"}
                value={searchQuery}
                style={
                  {
                    height: 50,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    color: "white",
                    fontSize: 16,
                    fontFamily : 'Lato-Regular'
                  }
                }
                onChangeText={onSearchChange}
              />
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
});
