import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CategoriesHeader = () => {
  return (
    <LinearGradient
      colors={["transparent", "transparent"]}
      style={{ gap: 20, padding: 20 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 38,
            borderRadius: 8,
            borderWidth: 1,
            width: 38,
            borderColor: "rgba(220, 220, 220, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ height: 20, width: 15, marginTop: 4 }}
            source={require("../../assets/images/icons/left-chevron.png")}
          />
        </View>
        <Text
          style={{
            fontFamily: "Lato-Bold",
            fontSize: 20,
            lineHeight: 32,
            letterSpacing: -0.48,
            color: "#000000",
            textAlign: "center",
          }}
        >
          Categories
        </Text>
      </View>

      <View>
        <View style={styles.searchBoxCotainer}>
          <Image
            source={require("../../assets/images/icons/searchiconimg.png")}
            style={styles.icon}
          />
          <View style={styles.searchBoxDivider} />
          <Text style={styles.placeholder}>
            Search <Text style={styles.highlight}>"Snacks"</Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CategoriesHeader;

const styles = StyleSheet.create({
  searchBoxCotainer: {
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
  icon: {
    width: 18,
    height: 18,
    tintColor: "black",
  },
  searchBoxDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#000000",
  },
  placeholder: {
    fontFamily: "Lato-Regular",
    fontSize: 15,
    color: "rgba(140, 140, 140, 1)",
  },
  highlight: {
    color: "#FFC107",
    fontWeight: "600",
  },
});
