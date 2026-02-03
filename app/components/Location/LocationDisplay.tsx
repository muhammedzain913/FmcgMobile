import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export interface LocationData {
  governorate?: { id: string; name: string } | null;
  city?: { id: string; name: string } | null;
  block?: { id: string; name: string } | null;
}

interface LocationDisplayProps {
  governorate?: { id: string; name: string } | null;
  city?: { id: string; name: string } | null;
  block?: { id: string; name: string } | null;
  showChangeButton?: boolean;
  onChangePress?: () => void;
  containerStyle?: object;
  textColor?: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  governorate,
  city,
  block,
  showChangeButton = false,
  onChangePress,
  containerStyle,
  textColor = "#FFFFFF",
}) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        containerStyle,
      ]}
    >
      <View style={{ gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 15, height: 15 }}
            source={require("../../assets/images/icons/locationpin.png")}
          />
          <Text
            style={{
              fontFamily: "Lato-SemiBold",
              fontSize: 20,
              color: textColor,
            }}
          >
            {governorate?.name || "N/A"}
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 15,
              color: textColor,
            }}
          >
            {city?.name || "N/A"}
            {block?.name ? ` , Block ${block.name}` : ""}
          </Text>
        </View>
      </View>

      {showChangeButton && (
        <TouchableOpacity onPress={onChangePress}>
          <View
            style={{
              width: 70,
              height: 30,
              borderColor: "#F0F0F0",
              borderRadius: 8,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Medium",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: 12,
                color: textColor,
              }}
            >
              Change
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LocationDisplay;
