import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

interface SectionHeaderProps {
  title: string;
  onViewAllPress?: () => void;
  showViewAll?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onViewAllPress,
  showViewAll = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showViewAll && onViewAllPress && (
        <TouchableOpacity onPress={onViewAllPress}>
          <View style={styles.viewAllButton}>
            <Image
              style={styles.icon}
              source={require("../../assets/images/icons/top-right.png")}
            />
          </View>
        </TouchableOpacity>
      )}
      {showViewAll && !onViewAllPress && (
        <View style={styles.viewAllButton}>
          <Image
            style={styles.icon}
            source={require("../../assets/images/icons/top-right.png")}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Lato-SemiBold",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.39,
    color: "rgba(31, 31, 31, 1)",
    textTransform: "uppercase",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    justifyContent : 'center',
    paddingVertical: 7.78,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(240, 240, 240, 1)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  icon: {
    height: 10,
    width: 10,
    marginTop: 4,
  },
});

export default SectionHeader;
