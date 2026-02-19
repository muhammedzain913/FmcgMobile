import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

type OrderPlacedSuccessScreenProps = StackScreenProps<
  RootStackParamList,
  "OrderPlacedSuccess"
>;

const OrderPlacedSuccess = ({ navigation }: OrderPlacedSuccessScreenProps) => {
  // Auto-navigate to Home after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to DrawerNavigation which contains BottomNavigation with Home tab
      // Using nested navigation to reach Home tab inside BottomNavigation
      navigation.navigate("DrawerNavigation", {
        screen: "BottomNavigation",
        params: {
          screen: "Home",
        },
      });
    }, 4000); // 4 seconds

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar style="dark" />
      
      {/* Background gradient */}
      <LinearGradient
        colors={[
          "rgba(253, 195, 2, 0.15)", // Light creamy yellow/orange (top-left)
          "rgba(106, 61, 208, 0.15)", // Light purple/lavender (top-right)
          "rgba(134, 235, 193, 0.1)", // Light green/teal (middle)
          "#FFFFFF", // White (bottom)
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Main Content - Centered */}
      <View style={styles.content}>
        {/* Success Icon - 3D Green Rounded Square with Checkmark */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#4CAF50", "#45A049"]}
            style={styles.successIcon}
          >
            <Text style={styles.checkmark}>✓</Text>
          </LinearGradient>
        </View>

        {/* Success Message */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Order Successfully Placed!</Text>
          <Text style={styles.subtitle}>Thank you for shopping from us.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderPlacedSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  successIcon: {
    width: 99,
    height: 99,
    borderRadius: 24, // Rounded square (squircle) with soft corners
    justifyContent: "center",
    alignItems: "center",
    // 3D shadow effect
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  checkmark: {
    fontSize: 60,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Lato-Bold",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Lato-Bold",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666666",
    textAlign: "center",
    fontFamily: "Lato-Regular",
    lineHeight: 22,
  },
});
