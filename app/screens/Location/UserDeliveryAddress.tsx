import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { COLORS } from "../../constants/theme";
import { Typography } from "../../constants/typography";

const UserDeliveryAddress = () => {
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "#1E123D", padding: 20 }}>
      <ImageBackground
        imageStyle={{ opacity: 0.1 }}
        style={{
          flex: 1,
        }}
        resizeMode="cover"
        source={require("../../assets/images/bg.png")}
      >
        <View style={{ gap: 30 }}>
          <View style={{ gap: 50 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#F0F0F0",
                borderRadius: 8,
                borderWidth: 1,
                width: 36,
                height: 36,
              }}
            >
              <Image
                source={require("../../assets/images/icons/wbackbtn.png")}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "grey",
                paddingBottom: 20,
              }}
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
                    source={require("../../assets/images/icons/locationaddress.png")}
                  />
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: 20,
                      color: "#FFFFFF",
                    }}
                  >
                    Farwaniya
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: 15,
                      color: "#FFFFFF",
                    }}
                  >
                    Andalus , Block 10
                  </Text>
                </View>
              </View>

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
                    fontFamily: "Lato",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: 12,
                    color: "#FFFFFF",
                  }}
                >
                  Change
                </Text>
              </View>
            </View>
          </View>

          <View style={{ gap: 15 }}>
            <Input variant="dark" placeholder="House / Flat No*" />
            <Input
              multiline={true}
              numberOfLines={5}
              variant="dark"
              placeholder="Apartment / Road*"
            />
            <Input
              multiline={true}
              numberOfLines={5}
              variant="dark"
              placeholder="Directions to reach"
            />
          </View>

          <View>
            <View>
              <Text style={[Typography.titleMedium, { color: "white" }]}>
                Save As
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }} >
              <View style={styles.buttonView}>
                <TouchableOpacity>
                  <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity>
                  <Text style={{ color: "#FFFFFF" }}>Work</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity>
                  <Text style={{ color: "#FFFFFF" }}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={{ marginVertical: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Button text={'black'} color={"white"} title="Save Address" onPress={() => {}} />
        )}
      </View>
    </View>
  );
};

export default UserDeliveryAddress;

const styles = StyleSheet.create({
  buttonView: {
    width: 78,
    height: 32,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});
