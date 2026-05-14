import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";

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
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.categoryImage}
              contentFit="contain"
              cachePolicy="memory-disk"
              recyclingKey={image}
              transition={150}
            />
          ) : null}
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
  categoryText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 12,
    color: "rgba(0, 0, 0, 1)",
    textAlign: "center",
  },
});
