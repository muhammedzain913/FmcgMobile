import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

interface FilterBarProps {
  onFilterPress: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterPress }) => {
  return (
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: "#F9F9F9",
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
            <Image
              source={require("../../assets/images/icons/filter (1).png")}
              style={{
                width: 12,
                height: 12,
                marginLeft: 5,
                marginTop: 3,
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Sort</Text>
          <Image
            source={require("../../assets/images/icons/CaretDown.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: 5,
              marginTop: 3,
            }}
          />
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Price</Text>
          <Image
            source={require("../../assets/images/icons/CaretDown.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: 5,
              marginTop: 3,
            }}
          />
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Brand</Text>
          <Image
            source={require("../../assets/images/icons/CaretDown.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: 5,
              marginTop: 3,
            }}
          />
        </View>
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
  filterContainer: {
    height: 30,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: "rgba(240, 240, 240, 1)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
