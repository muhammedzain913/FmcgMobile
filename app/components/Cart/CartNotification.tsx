import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";

interface CartNotificationProps {
  totalQuantity: number;
  navigation: NavigationProp<RootStackParamList>;
}

const CartNotification: React.FC<CartNotificationProps> = ({
  totalQuantity,
  navigation,
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (totalQuantity <= 0) return;
    scale.value = withSequence(
      withTiming(1.5, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 180 }),
    );
    rotate.value = withSequence(
      withTiming(-20, { duration: 80 }),
      withTiming(20, { duration: 80 }),
      withTiming(-12, { duration: 80 }),
      withTiming(12, { duration: 80 }),
      withTiming(0, { duration: 80 }),
    );
  }, [totalQuantity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  if (totalQuantity <= 0) return null;

  return (
    <View style={styles.cartNotification}>
      <LinearGradient
        style={styles.cartGradient}
        colors={["rgba(134, 235, 193, 0.25)", "rgba(255,255,255,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.cartTextContainer}>
          <Text style={styles.cartText}>{totalQuantity} Items Added</Text>
          <Animated.View style={animatedStyle}>
            <MaterialCommunityIcons name="party-popper" size={26} color="rgba(5, 155, 93, 1)" />
          </Animated.View>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("MyCart")}
        >
          <Text style={{ color: "#fff", fontFamily: "Lato-Medium" }}>View Cart</Text>
          <Ionicons name="cart" size={16} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default CartNotification;

const styles = StyleSheet.create({
  cartNotification: {
    marginHorizontal: 30,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "rgb(115, 158, 123)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  cartGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartTextContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  cartText: {
    color: "rgba(5, 155, 93, 1)",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  cartButton: {
    backgroundColor: "rgba(5, 155, 93, 1)",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
