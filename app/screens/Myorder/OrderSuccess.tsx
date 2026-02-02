import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const OrderSuccess = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[
          "#FFF6E5", // soft yellow
          "#EAD9FF", // soft purple
          "#DFF4EA", // soft mint green
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Success Icon */}

          <Image
            source={require("../../assets/images/icons/image 68.png")}
            style={styles.icon}
          />

          {/* Title */}
          <View>
            <Text style={styles.title}>Order Successfully Placed!</Text>
            <Text style={styles.subtitle}>Thank you for shopping from us.</Text>
          </View>

          {/* Subtitle */}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 20,
  },

  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#6BCF63",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  icon: {
    width: 100,
    height: 100,
    // tintColor: "#FFFFFF",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E1E1E",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#5F5F5F",
    textAlign: "center",
  },
});
