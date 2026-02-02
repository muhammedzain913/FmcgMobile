import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { IMAGES } from "../../constants/Images";
import { ScrollView } from "react-native-gesture-handler";

const Brands = () => {
  const brandData = [
    {
      imagePath: IMAGES.elite,
    },
    {
      imagePath: IMAGES.muralya,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.elite,
    },
    {
      imagePath: IMAGES.muralya,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.elite,
    },
    {
      imagePath: IMAGES.muralya,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.elite,
    },
    {
      imagePath: IMAGES.muralya,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.elite,
    },
    {
      imagePath: IMAGES.muralya,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.elite,
    },
    {
      imagePath: IMAGES.muralya,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
    {
      imagePath: IMAGES.milma,
    },
  ];
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1, gap: 30 }}>
        <View style={{ gap: 20 }}>
          <ScrollView contentContainerStyle={{ gap: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row", // Flow: Horizontal
                  alignItems: "center", // Inner alignment
                  height: 40, // Fixed height
                  paddingHorizontal: 15, // Padding
                  paddingVertical: 7.78,
                  borderRadius: 8,
                  borderWidth: 1,

                  borderColor: "rgba(220, 220, 220, 1)",
                  backgroundColor: "rgba(255, 255, 255, 0.6)", // Required for blur effect
                }}
              >
                <Image
                  style={{ height: 20, width: 15, marginTop: 4 }}
                  source={require("../../assets/images/icons/CaretLeft.png")}
                />
              </View>
              <View style={{ position: "absolute", left: 0, right: 0 }}>
                <Text
                  style={{
                    fontFamily: "Lato", // preferred if font file exists
                    fontSize: 20,
                    lineHeight: 32,
                    letterSpacing: -0.48, // -3% of 16px = -0.48
                    color: "#000000",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  Our Brands
                </Text>
              </View>
              <View></View>
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
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
                paddingHorizontal: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,

                // Android shadow
                elevation: 3,
              }}
            >
              {brandData.map((item: any, index: number) => {
                return (
                  <View
                    style={{
                      flexBasis: "30%",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 8,
                      }}
                    >
                      <Image
                        style={{ width: "100%", height: 100 }}
                        source={item.imagePath}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default Brands;

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
    fontFamily: "Lato",
    fontSize: 15,
    color: "rgba(140, 140, 140, 1)",
  },

  highlight: {
    color: "#FFC107", // yellow "Snacks"
    fontWeight: "600",
  },

  filterText: {
    fontFamily: "Lato",
    fontSize: 15,
    color: "#000000",
  },
  filterContainer: {
    height: 38,
    flexDirection: "row",

    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: "rgba(240, 240, 240, 1)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDescription: {
    fontFamily: "Lato",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: -0.36, // -3% of 12px
    color: "rgba(0, 0, 0, 1)",
  },
});
