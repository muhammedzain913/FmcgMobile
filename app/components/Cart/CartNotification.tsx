import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";

interface CartNotificationProps {
  totalQuantity: number;
  navigation: NavigationProp<RootStackParamList>;
}

const CartNotification: React.FC<CartNotificationProps> = ({
  totalQuantity,
  navigation,
}) => {
  if (totalQuantity <= 0) {
    return null;
  }

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
          <Image style={{width : 30,height : 29}} source={require("../../assets/images/icons/popgif.gif")} />
        </View>
        <View style={styles.cartButton}>
          <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
            <Text style={{ color: "#fff",fontFamily : 'Lato-Medium' }}>View Cart</Text>
          </TouchableOpacity>
          <Image
            style={{width : 15, height : 15}}
            source={require("../../assets/images/icons/market.png")}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default CartNotification;

const styles = StyleSheet.create({
  cartNotification: {
    position: "absolute",
    left: 30,
    right: 30,
    bottom: 16,
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
    fontFamily: 'Lato-Bold'
  },
  cartButton: {
    backgroundColor: "rgba(5, 155, 93, 1)",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
