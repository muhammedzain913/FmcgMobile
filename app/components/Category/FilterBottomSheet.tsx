import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import BottomSheetHeader from "../BottomSheet/BottomSheetHeader";
import Button from "../Button/Button";
import { filterCriteria } from "../../types/filterCrieria";

interface FilterBottomSheetProps {
  onClose: () => void;
  filterCriterias: filterCriteria[];
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  onClose,
  filterCriterias,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("PRICE RANGE");

  // Filter item dimensions
  const FILTER_ITEM_PADDING = 20; // paddingVertical
  const FILTER_TEXT_HEIGHT = 15; // Approximate text height (fontSize: 15)
  const FILTER_ITEM_TOTAL_HEIGHT = FILTER_ITEM_PADDING * 2 + FILTER_TEXT_HEIGHT; // 20*2 + 15 = 55px total (no gap)
  const FILTER_CONTENT_HEIGHT = FILTER_ITEM_PADDING * 2 + FILTER_TEXT_HEIGHT; // 20*2 + 15 = 55px (padding + text)
  const INDICATOR_HEIGHT = 40; // Fixed indicator height

  // Calculate position to center indicator on the selected item
  const calculateIndicatorPosition = (index: number) => {
    const itemStartPosition = index * FILTER_ITEM_TOTAL_HEIGHT;
    const itemCenter = FILTER_ITEM_TOTAL_HEIGHT / 1.8; // Center of each item (27.5px)
    const indicatorCenter = INDICATOR_HEIGHT / 2.1; // Center of indicator (20px)
    return itemStartPosition + itemCenter - indicatorCenter;
  };

  const filterAnim = useRef(
    new Animated.Value(calculateIndicatorPosition(0)),
  ).current;

  // const sortOptions = [

  // ];
  const [selectedSortOption, setSelectedSortOption] = useState<string>(
    "Price (High To Low)",
  );

  const [selectedCriteria, setSelectedCriteria] = useState<filterCriteria>({
    title: "",
    values: [],
  });

  const getFilterContent = () => {
    switch (selectedFilter) {
      case "PRICE RANGE":
        return filterCriterias[0].values;
      case "BRANDS":
        return filterCriterias[1].values;
      case "SORT":
        return [
          "Price (Low To High)",
          "Price (High To Low)",
          "Discount (High To Low)",
        ];
      default:
        return filterCriterias[0].values;
    }
  };

  useEffect(() => {
    console.log("arrays", selectedCriteria);
    console.log("sort", selectedSortOption);

  });

  useEffect(() => {
    // Find the index of the selected filter
    let toValue;
    if (selectedFilter === "SORT") {
      toValue = calculateIndicatorPosition(2);
    } else {
      const selectedIndex = filterCriterias.findIndex(
        (filter) => filter.title === selectedFilter,
      );

      // If filter not found, default to first item or 0
      const index = selectedIndex >= 0 ? selectedIndex : 0;

      // Calculate position to center indicator on the selected item
      toValue = calculateIndicatorPosition(index);
    }

    Animated.timing(filterAnim, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedFilter]);

  const radioButton = (isSelected: boolean, isSingle: boolean) => {
    return (
      <View
        style={{
          width: 15,
          height: 15,
          borderWidth: 0.5,
          borderRadius: 10,
          borderColor: isSelected && !isSingle ? "#059B5D" : "grey",
          backgroundColor: isSelected && !isSingle ? "#E6F5EF" : "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isSelected && !isSingle && (
          <Image
            style={{ height: 15, width: 15 }}
            source={require("../../assets/images/icons/check (1).png")}
          />
        )}

        {isSelected && isSingle && (
          <View
            style={{
              backgroundColor: "#059B5D",
              width: 10,
              height: 10,
              borderRadius: 10,
            }}
          ></View>
        )}
      </View>
    );
  };

  const emptyCriteria = () => {
    setSelectedCriteria({ title: "", values: [] });
  };

  useEffect(() => {
    console.log("this is the selected one", selectedCriteria);
  }, [selectedCriteria]);

  const handleMultiSelect = (item: string, isSingle: boolean) => {
    if (isSingle) {
      setSelectedSortOption(prev => (
        prev === item ? '' : item
      ));
    } else {
      const updatedArray = selectedCriteria.values.includes(item)
        ? selectedCriteria.values.filter(
            (criteria: string) => criteria !== item,
          )
        : [...selectedCriteria.values, item];
      setSelectedCriteria({ title: selectedFilter, values: updatedArray });
    }
  };
  return (
    <Animated.View
      style={{
        ...styles.bottomSheetContent,
        flex: 1,
        paddingVertical: 10,
        // gap: 20,
      }}
    >
      <View style={{ paddingLeft: 10 }}>
        <BottomSheetHeader title="FILTERS" onClose={onClose} />
        <View style={{ height: 20 }}></View>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1, position: "relative" }}>
          {filterCriterias.map((filter, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                (setSelectedFilter(filter.title), emptyCriteria());
              }}
            >
              <View
                style={{
                  ...styles.fiterCategoryContainer,
                  backgroundColor:
                    selectedFilter === filter.title ? "white" : "#F5F5F5",
                }}
              >
                {/* <View> */}
                <Text
                  style={[
                    styles.filter,
                    selectedFilter === filter.title && styles.selectedFilter,
                  ]}
                >
                  {filter.title}
                </Text>
                {/* </View> */}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => {
              (setSelectedFilter("SORT"), emptyCriteria());
            }}
          >
            <View
              style={{
                ...styles.fiterCategoryContainer,
                backgroundColor:
                  selectedFilter === "SORT" ? "white" : "#F5F5F5",
              }}
            >
              {/* <View> */}
              <Text
                style={[
                  styles.filter,
                  selectedFilter === "SORT" && styles.selectedFilter,
                ]}
              >
                SORT
              </Text>
              {/* </View> */}
            </View>
          </TouchableOpacity>

          <Animated.View
            style={{
              height: INDICATOR_HEIGHT,
              position: "absolute",
              right: 0,
              top: 0,
              width: 4,
              backgroundColor: "green",
              borderRadius: 10,
              transform: [{ translateY: filterAnim }],
            }}
          />
        </View>

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {getFilterContent().map((item: string, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  handleMultiSelect(item, selectedFilter === "SORT");
                }}
              >
                <View
                  key={index}
                  style={{
                    ...styles.fiterCategoryContainer,
                    borderBottomWidth: 1,
                    borderColor: "#F5F5F5",
                  }}
                >
                  {radioButton(
                    selectedCriteria.values.includes(item) || selectedSortOption === item,
                    selectedFilter === "SORT",
                  )}
                  <Text style={{ fontFamily: "Lato-Regular", fontSize: 14 }}>
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Button
            variant="non"
            style={{ borderColor: "green", borderWidth: 1 }}
            text={"green"}
            color={"#fff"}
            title="Clear Filters"
          ></Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            variant="non"
            text={"#fff"}
            color={"#1E123D"}
            title="Apply Filters"
          ></Button>
        </View>
      </View>
    </Animated.View>
  );
};

export default FilterBottomSheet;

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    height: 700,
    // paddingHorizontal: 20,
    paddingTop: 50,
  },
  filter: {
    fontFamily: "Lato-Medium",
    fontSize: 15,
    color: "#8C8C8C",
  },
  selectedFilter: {
    color: "#000000",
  },
  fiterCategoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 10,
    alignItems: "center",
  },
  filterItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#059B5D",
    backgroundColor: "#059B5D",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  filterItemText: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "#000000",
  },
  selectedFilterItemText: {
    fontFamily: "Lato-SemiBold",
  },
});
