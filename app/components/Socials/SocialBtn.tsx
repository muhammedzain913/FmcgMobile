import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";

type Props = {
  color?: string;
  rounded?: any;
  icon?: any;
  text?: string;
  onpress?: any;
  gap?: string;
};

const SocialBtn = ({ color, rounded, icon, text, onpress, gap }: Props) => {
  const { colors }: { colors: any } = useTheme();
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: color ? color : COLORS.primary,
          // paddingVertical: 12
          overflow: "hidden",
          paddingLeft: 20,
          paddingRight: 20,
          height: 50,
          alignItems: "center",
          flexDirection: "row",
          gap: gap ? 0 : 10,
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
        },
        rounded && {
          borderRadius: 8,
        },
      ]}
      onPress={onpress}
    >
      <View
        style={[
          {
            // width: 44,
            alignItems: "center",
            justifyContent: "center",
          },
          rounded && {
            borderRadius: 30,
          },
        ]}
      >
        {icon}
      </View>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SocialBtn;

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: "Lato-SemiBold",
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: -0.45,
    color: "#000000",
    textAlign: "center",
  },
});
