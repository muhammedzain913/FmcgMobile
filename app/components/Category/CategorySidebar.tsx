import React from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

interface CategorySidebarProps {
  categories: any[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string, categoryTitle: string) => void;
  categoryChangeAnim: Animated.Value;
  indicatorHeight: number;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  categoryChangeAnim,
  indicatorHeight,
}) => {
  return (
    <View style={{ alignItems: "center", paddingHorizontal: 5 }}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {categories?.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onCategorySelect(item.id, item.title);
              }}
            >
              <View
                style={{
                  marginBottom: 20,
                  alignItems: "center",
                  gap: 10,
                  width: 70,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F9F9F9",
                    borderRadius: 100,
                    overflow: "hidden",
                    width: 50,
                    height: 50,
                    borderColor: "#000",
                    borderWidth: selectedCategory === item.title ? 1 : 0,
                  }}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 50, height: 50 }}
                  />
                </View>
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontFamily: "Lato-SemiBold",
                      fontSize: 10,
                      color:
                        selectedCategory === item.title ? "black" : "#595959",
                      textAlign: "center",
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Animated.View
        style={{
          height: indicatorHeight,
          position: "absolute",
          right: 0,
          top: 0,
          width: 4,
          backgroundColor: "green",
          borderRadius: 10,
          transform: [{ translateY: categoryChangeAnim }],
        }}
      />
    </View>
  );
};

export default CategorySidebar;
