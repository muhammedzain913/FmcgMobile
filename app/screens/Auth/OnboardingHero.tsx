import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const OnboardingHero = ({ navigation }: any) => {
  return (
    <>
      {/* Light status bar for image background */}
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ImageBackground
          source={require("../../assets/images/onboardimage.png")} // 👈 your image path
          style={styles.image}
          resizeMode="cover"
        >
          {/* Dark gradient overlay */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.1)",
              "rgba(0,0,0,0.5)",
              "rgba(0,0,0,0.85)",
            ]}
            style={styles.overlay}
          />

          {/* Bottom content */}
          <View style={styles.content}>
            <Text style={styles.subTitle}>
              Grocery shopping at the easiest!
            </Text>

            <Text style={styles.title}>
              Get your groceries at{"\n"}
              the fastest in your{"\n"}
              doorsteps.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.button}
              onPress={() => navigation.navigate("Login")} // adjust
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default OnboardingHero;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },

  image: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  subTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    opacity: 0.9,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 36,
    fontWeight: "700",
    marginBottom: 20,
  },

  button: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "#1E123D",
    fontSize: 16,
    fontWeight: "600",
  },
});
