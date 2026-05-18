import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

interface FilterBarProps {
  onFilterPress: () => void;
  onSortPress: () => void;
  onPricePress: () => void;
  onBrandPress: () => void;
  backgroundColor?: string;
  hasActiveSort?: boolean;
  hasActivePrice?: boolean;
  hasActiveBrand?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterPress,
  onSortPress,
  onPricePress,
  onBrandPress,
  backgroundColor,
  hasActiveSort,
  hasActivePrice,
  hasActiveBrand,
}) => {
  return (
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: backgroundColor || "#FFF",
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          gap: 10,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <TouchableOpacity onPress={onFilterPress}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>Filter</Text>
            <Ionicons
              name="options-outline"
              size={14}
              color="#000000"
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSortPress}>
          <View style={[styles.filterContainer, hasActiveSort && styles.activeContainer]}>
            <Text style={[styles.filterText, hasActiveSort && styles.activeText]}>Sort</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={hasActiveSort ? "#059B5D" : "#000000"}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPricePress}>
          <View style={[styles.filterContainer, hasActivePrice && styles.activeContainer]}>
            <Text style={[styles.filterText, hasActivePrice && styles.activeText]}>Price</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={hasActivePrice ? "#059B5D" : "#000000"}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBrandPress}>
          <View style={[styles.filterContainer, hasActiveBrand && styles.activeContainer]}>
            <Text style={[styles.filterText, hasActiveBrand && styles.activeText]}>Brand</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={hasActiveBrand ? "#059B5D" : "#000000"}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  filterText: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "#000000",
  },
  activeText: {
    color: "#059B5D",
    fontFamily: "Lato-SemiBold",
  },
  filterContainer: {
    height: 30,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 18,
    borderColor: "rgba(240, 240, 240, 1)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeContainer: {
    borderColor: "#059B5D",
    backgroundColor: "#E6F5EF",
  },
});
