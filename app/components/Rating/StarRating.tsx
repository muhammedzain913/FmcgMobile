import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  starSize?: number;
  disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  starSize = 20,
  disabled = false,
}) => {
  const handleStarPress = (index: number) => {
    if (!disabled && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleStarPress(index)}
          disabled={disabled || !onRatingChange}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/images/icons/Star (1).png")}
            style={[
              styles.star,
              {
                width: starSize,
                height: starSize,
                tintColor: index < rating ? "#F7700B" : "#E0E0E0", // Orange for filled, gray for empty
              },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  star: {
    width: 20,
    height: 20,
  },
});

export default StarRating;
