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
            resizeMode="contain"
            style={styles.categoryImage}
            source={{uri : image}}
          />
        </View>
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryText} numberOfLines={2}>{title}</Text>
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
    width: "100%",
    alignItems: "center",
  },
  categoryImageContainer: {
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
  },
  categoryImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
  },
  categoryTextContainer: {
    height: 34,
    justifyContent: "center",
  },
  categoryText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(0, 0, 0, 1)",
    textAlign: "center",
  },
});
