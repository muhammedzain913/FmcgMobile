import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface CategoryCardProps {
  title: string;
  image?: any;
  onPress: () => void;
  containerStyle?: object;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  onPress,
  containerStyle,
}) => {
  return (
    <View style={[styles.categoryCard, containerStyle]}>
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <View style={styles.categoryImageContainer}>
          <Image
            style={styles.categoryImage}
            source={
              image || require("../../assets/images/item/fruitcatimage.png")
            }
          />
        </View>
        <View>
          <Text style={styles.categoryText}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  categoryCard: {
    gap: 5,
  },
  touchable: {
    gap: 10,
  },
  categoryImageContainer: {
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  categoryImage: {
    width: 85,
    height: 85,
  },
  categoryText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 12,
    color: "rgba(0, 0, 0, 1)",
    textAlign: "center",
  },
});
