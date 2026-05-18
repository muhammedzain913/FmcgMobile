import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CartNotification from "./CartNotification";
import { selectCartTotalQuantity } from "../../redux/reducer/cartReducer";

const GlobalCartNotification: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const cartItemCount = useRef(new Animated.Value(100)).current; // Start off-screen
  
  // Get current route name using useNavigationState (works outside screen components)
  const routeName = useNavigationState((state) => {
    if (!state) return null;
    const route = state.routes[state.index];
    return route?.name || null;
  });

  // Animate cart notification based on totalQuantity
  useEffect(() => {
    if (totalQuantity > 0) {
      // Slide up smoothly when cart has items
      Animated.spring(cartItemCount, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down when cart is empty
      Animated.timing(cartItemCount, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [totalQuantity]);

  // Hide cart notification on MyCart screen itself
  if (routeName === "MyCart") {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        transform: [{ translateY: cartItemCount }],
      }}
    >
      <CartNotification totalQuantity={totalQuantity} navigation={navigation} />
    </Animated.View>
  );
};

export default GlobalCartNotification;
