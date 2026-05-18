import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface NoDeliveryModalProps {
  visible: boolean;
  onChangeLocation: () => void;
  governorate?: string;
  city?: string;
  block?: string;
}

const NoDeliveryModal = ({
  visible,
  onChangeLocation,
  governorate,
  city,
  block,
}: NoDeliveryModalProps) => {
  const locationLabel =
    [block, city, governorate].filter(Boolean).join(", ") || "your selected area";

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Top band */}
          <LinearGradient
            colors={["#1E123D", "#3A1F6E"]}
            style={styles.topBand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={38} color="#fff" />
            </View>
          </LinearGradient>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.title}>No Delivery Available</Text>

            <Text style={styles.subtitle}>
              Sorry! We currently don't deliver to{"\n"}
              <Text style={styles.locationText}>{locationLabel}</Text>
            </Text>

            <Text style={styles.hint}>
              We're working hard to reach your region soon.{"\n"}
              Try a different address or check back later.
            </Text>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={onChangeLocation}
            >
              <LinearGradient
                colors={["#1E123D", "#3A1F6E"]}
                style={styles.primaryBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons
                  name="map-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.primaryBtnText}>Change Location</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.75}
              onPress={() => BackHandler.exitApp()}
            >
              <Text style={styles.secondaryBtnText}>Exit App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NoDeliveryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  card: {
    width: width - 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#1E123D",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 20,
  },
  topBand: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 28,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E123D",
    marginBottom: 12,
    letterSpacing: 0.2,
    fontFamily: "Lato-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Lato-Regular",
    marginBottom: 10,
  },
  locationText: {
    color: "#3A1F6E",
    fontFamily: "Lato-Bold",
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    fontFamily: "Lato-Regular",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 20,
  },
  primaryBtn: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  primaryBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Lato-Bold",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0D8F0",
    backgroundColor: "rgba(30,18,61,0.04)",
  },
  secondaryBtnText: {
    color: "#1E123D",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Lato-SemiBold",
  },
});
