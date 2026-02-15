import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Button from "../../components/Button/Button";

type OrderSuccessScreenProps = StackScreenProps<
  RootStackParamList,
  "OrderSuccess"
>;

const OrderSuccess = ({ navigation }: OrderSuccessScreenProps) => {
  const handleContinueShopping = () => {
    navigation.navigate("Home");
  };

  const handleRateOrder = () => {
    navigation.navigate("GiveRating");
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar style="light" />

      {/* Background Gradient - Dark purple gradient */}
      <LinearGradient
        colors={[
          "#8B5A3C", // Orange-brown (top left)
          "#6A3DD0", // Purple (center)
          "#1E123D", // Dark purple-blue (bottom right)
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Delivery Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../assets/images/icons/image 56.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Successfully Delivered</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Thank you for shopping from us.</Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                variant="decorate"
                color="#FFFFFF"
                text="#000000"
                title="Continue Shopping"
                onPress={handleContinueShopping}
                style={styles.continueButton}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                variant="non"
                color="#6A3DD0"
                text="#FFFFFF"
                title="Rate This Order"
                onPress={handleRateOrder}
                style={styles.rateButton}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    width: 271,
    height: 271,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Lato-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Lato-Regular",
    opacity: 0.9,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 0,
  },
  buttonWrapper: {
    flex: 1,
  },
  continueButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rateButton: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  continueShoppingButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  continueShoppingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "Lato-SemiBold",
  },
  shoppingIconContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rateOrderButton: {
    flex: 1,
    backgroundColor: "#6A3DD0",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  rateOrderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Lato-SemiBold",
  },
});
