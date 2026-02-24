import React from "react";
import { View, StyleSheet } from "react-native";

interface DashedLineProps {
  width?: number | string;
  color?: string;
  dashWidth?: number;
  dashGap?: number;
  height?: number;
}

const DashedLine: React.FC<DashedLineProps> = ({
  width = "100%",
  color = "#E0E0E0",
  dashWidth = 8,
  dashGap = 4,
  height = 1,
}) => {
  // Calculate number of dashes needed based on width
  // For percentage width, we'll use a fixed number of dashes
  // For numeric width, calculate based on the width
  const dashCount = typeof width === "number" 
    ? Math.floor(width / (dashWidth + dashGap))
    : 50; // Default for percentage widths

  const dashArray = Array.from({ length: dashCount }, (_, i) => i);

  return (
    <View style={[styles.container, { width, height }]}>
      {dashArray.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dash,
            {
              width: dashWidth,
              height: height,
              backgroundColor: color,
              marginRight: index < dashArray.length - 1 ? dashGap : 0,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
  },
  dash: {
    borderRadius: 0.5,
  },
});

export default DashedLine;
