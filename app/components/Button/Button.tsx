import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../constants/theme";

type Props = {
  title: string;
  onPress?: (e: any) => void;
  color?: any;
  style?: object;
  size?: any;
  text?: any;
  disabled?: boolean;
  variant: string;
};

const Button = ({
  title,
  onPress,
  color,
  style,
  size,
  text,
  disabled,
  variant,
}: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.button,
          color && {
            backgroundColor: color,
          },
          size === "sm" && {
            height: 34,
            paddingHorizontal: 10,
          },
          size === "lg" && {
            height: 55,
            paddingHorizontal: 30,
          },
          style && { ...style },
        ]}
      >
        <View></View>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.buttnTitle,
              size === "sm" && {
                fontSize: 14,
              },
              size === "lg" && {
                fontSize: 18,
              },
              color && { color: "white" },
              text && { color: text },
              { fontFamily: "Lato-SemiBold" }, // Ensure fontFamily is applied last
            ]}
          >
            {title}
          </Text>
        </View>

        {variant === "decorate" ? (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: "#FDC302",
                  height: 24,
                  width: 24,
                  borderRadius: 50,
                  top: 10,
                }}
              ></View>
              <View
                style={{
                  backgroundColor: "#6A3DD0",
                  height: 54,
                  width: 54,
                  borderRadius: 50,
                  bottom: 22,
                }}
              ></View>
            </View>
            <View style={{ flexDirection: "row", left: 25, gap: 10 }}>
              <View
                style={{
                  backgroundColor: "#F7700B",
                  height: 12,
                  width: 12,
                  borderRadius: 50,
                  bottom: 15,
                }}
              ></View>
              <View
                style={{
                  backgroundColor: "#059B5D",
                  height: 25,
                  width: 25,
                  borderRadius: 50,
                  bottom: 20,
                }}
              ></View>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: SIZES.radius_sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  buttnTitle: {
    fontFamily : 'Lato-SemiBold',
    fontSize: 18,
    color: "#000",
    lineHeight: 24,
  },
});

export default Button;
