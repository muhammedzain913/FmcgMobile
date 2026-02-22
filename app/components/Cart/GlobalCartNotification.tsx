import React from "react";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CartNotification from "./CartNotification";
import { selectCartTotalQuantity } from "../../redux/reducer/cartReducer";

const GlobalCartNotification: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const totalQuantity = useSelector(selectCartTotalQuantity);
  
  // Get current route name using useNavigationState (works outside screen components)
  const routeName = useNavigationState((state) => {
    if (!state) return null;
    const route = state.routes[state.index];
    return route?.name || null;
  });

  // Hide cart notification on MyCart screen itself
  if (routeName === "MyCart") {
    return null;
  }

  return <CartNotification totalQuantity={totalQuantity} navigation={navigation} />;
};

export default GlobalCartNotification;
