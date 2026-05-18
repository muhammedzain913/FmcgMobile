import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Ionicons } from "@expo/vector-icons";

type Nav = StackNavigationProp<RootStackParamList>;

interface CategoriesHeaderProps {
  categoryName?: string;
}

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({ categoryName }) => {
  const navigation = useNavigation<Nav>();
  return (
    <LinearGradient
      colors={["transparent", "transparent"]}
      style={{ padding: 20 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 38,
            width: 38,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "rgba(220, 220, 220, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#000000" />
        </TouchableOpacity>

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
          {categoryName || "Categories"}
        </Text>

        <View style={{ width: 38 }} />
      </View>
    </LinearGradient>
  );
};

export default CategoriesHeader;
