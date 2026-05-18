import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { StatusBar } from "expo-status-bar";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import DashedLine from "../../components/Common/DashedLine";
import { formatDateTime } from "../../utils/formatDateTime";

const apiPath = ApiClient();

type TrackorderScreenProps = StackScreenProps<RootStackParamList, "Trackorder">;

const STEPS = [
  { key: "ORDER_PLACED",    label: ["Order", "Placed"],    icon: "bag-outline"        },
  { key: "ORDER_CONFIRMED", label: ["Order", "Confirmed"], icon: "storefront-outline"  },
  { key: "PARTNER_ASSIGNED",label: ["Delivery", "Partner"],icon: "person-outline"      },
  { key: "OUT_FOR_DELIVERY",label: ["Out For", "Delivery"],icon: "bicycle-outline"     },
] as const;

const Trackorder = ({ route, navigation }: TrackorderScreenProps) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // Animation values
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scooterAnim = useRef(new Animated.Value(0)).current;
  const pulseAnims  = useRef(STEPS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const fetchOrderById = async () => {
      try {
        const response = await apiPath.get(`${Url}/api/orders/${orderId}`);
        setOrder(response.data);
        console.log("order data", response.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderById();
  }, []);

  // Scooter bounce — runs once on mount
  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(scooterAnim, { toValue: -6, duration: 650, useNativeDriver: true }),
        Animated.timing(scooterAnim, { toValue: 0,  duration: 650, useNativeDriver: true }),
      ]),
    );
    bounce.start();
    return () => bounce.stop();
  }, []);

  // Card fade-in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  // Progress + pulse animations — (re-)run when order loads
  useEffect(() => {
    if (!order) return;
    const step = getCurrentStepIndex();

    Animated.timing(progressAnim, {
      toValue: step,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnims[step], { toValue: 1.7, duration: 750, useNativeDriver: true }),
        Animated.timing(pulseAnims[step], { toValue: 1,   duration: 750, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [order]);

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    let step = 0;
    if (order.orderStatus === "PROCESSING") step = 1;
    if (order.deliveryAgentStatus === "ASSIGNED") step = 2;
    if (order.deliveryAgentStatus === "PICKED_UP" && order.orderStatus === "SHIPPED") step = 3;
    if (order.orderStatus === "DELIVERED") step = 3;
    return step;
  };

  const currentStepIndex = getCurrentStepIndex();

  // Animated progress fill width (as % of the connecting track)
  const progressWidth = progressAnim.interpolate({
    inputRange:  [0,    1,      2,      3],
    outputRange: ["3%", "33.5%","67%",  "100%"],
  });

  // Bill total
  const orderTotal = order?.orderItems?.reduce(
    (sum: number, item: any) => sum + (parseFloat(item.price) || 0),
    0,
  ) ?? 0;

  const statusLabel =
    currentStepIndex === 3 ? "Order Delivered!" : "Order is on the way";

  const handleCall = () => {
    const phone = order?.deliveryAgent?.phone;
    if (!phone) {
      Alert.alert("Unavailable", "No phone number on file for this delivery agent.");
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.screen}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 20, paddingBottom: 40 }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 24 }}>

          {/* ── Delivery Status Card ────────────────────────────── */}
          <Animated.View style={[styles.statusCard, { opacity: fadeAnim }]}>

            {/* Title + scooter */}
            <View style={styles.statusTop}>
              <Text style={styles.statusTitle}>Delivery Status</Text>
              <Text style={styles.statusSubtitle}>{statusLabel}</Text>

              <View style={styles.scooterWrapper}>
                {/* Radial glow */}
                <View style={styles.glowContainer} pointerEvents="none">
                  <Svg width="180" height="180">
                    <Defs>
                      <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%"   stopColor="rgba(5,155,93,0.45)" stopOpacity="0.45" />
                        <Stop offset="45%"  stopColor="rgba(5,155,93,0.18)" stopOpacity="0.18" />
                        <Stop offset="100%" stopColor="rgba(5,155,93,0)"    stopOpacity="0"    />
                      </RadialGradient>
                    </Defs>
                    <Circle cx="90" cy="90" r="90" fill="url(#glow)" />
                  </Svg>
                </View>
                <Animated.Image
                  style={[styles.scooterImage, { transform: [{ translateY: scooterAnim }] }]}
                  source={require("../../assets/images/icons/delivery-bike.png")}
                />
              </View>
            </View>

            {/* ── Step Progress ─────────────────────────────── */}
            <View style={styles.stepsSection}>

              {/* Connecting track + animated fill */}
              <View style={styles.trackOuter}>
                {/* Grey track */}
                <View style={styles.trackBg}>
                  {/* Green animated fill */}
                  <Animated.View style={[styles.trackFill, { width: progressWidth }]} />
                </View>

                {/* Step circles */}
                <View style={styles.stepsRow}>
                  {STEPS.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive    = index === currentStepIndex;

                    return (
                      <View key={step.key} style={styles.stepItem}>
                        {/* Pulse ring (active only) */}
                        {isActive && (
                          <Animated.View
                            style={[
                              styles.pulseRing,
                              { transform: [{ scale: pulseAnims[index] }] },
                            ]}
                          />
                        )}
                        <View
                          style={[
                            styles.stepCircle,
                            isCompleted ? styles.stepDone :
                            isActive    ? styles.stepActive :
                                          styles.stepPending,
                          ]}
                        >
                          <Ionicons
                            name={isCompleted ? "checkmark-sharp" : (step.icon as any)}
                            size={13}
                            color={
                              isCompleted || isActive
                                ? "#fff"
                                : "rgba(255,255,255,0.3)"
                            }
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Labels */}
              <View style={styles.labelsRow}>
                {STEPS.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isActive    = index === currentStepIndex;
                  const labelColor  = isActive
                    ? "#059B5D"
                    : isCompleted
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.35)";

                  return (
                    <View key={step.key} style={styles.labelItem}>
                      {step.label.map((line, i) => (
                        <Text key={i} style={[styles.labelText, { color: labelColor }]}>
                          {line}
                        </Text>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* ── Delivery Agent Card ───────────────────────── */}
            <View style={styles.agentCard}>
              <View style={styles.agentLeft}>
                <View style={styles.agentAvatar}>
                  <Ionicons name="person" size={18} color="#059B5D" />
                </View>
                <View>
                  <Text style={styles.agentName}>
                    {order?.deliveryAgent?.name ?? "Assigning agent…"}
                  </Text>
                  <Text style={styles.agentRole}>Delivery Partner</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.callBtn} activeOpacity={0.8} onPress={handleCall}>
                <Ionicons name="call" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

          </Animated.View>

          {/* ── Delivering To ───────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivering To</Text>
              <Image
                style={{ width: 18, height: 18 }}
                source={require("../../assets/images/icons/delivery-bike.png")}
              />
              <DashedLine />
            </View>

            <View style={styles.addressRow}>
              <Ionicons name="location-sharp" size={20} color="#059B5D" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.addressTitle}>
                  {order?.streetAddress || "Home"}
                </Text>
                <Text style={styles.addressSubtitle}>
                  Street {order?.streetAddress}, Apartment {order?.apartmentNumber}
                  {order?.phone ? `, ${order?.phone}` : ""}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Order Details ────────────────────────────────────── */}
          <View style={[styles.sectionCard, { gap: 14 }]}>
            <View style={styles.billRow}>
              <Text style={styles.orderDetailTitle}>ORDER DETAILS</Text>
              <Text style={styles.orderDateTime}>
                {formatDateTime(order?.createdAt)}
              </Text>
            </View>

            <DashedLine />

            {order?.orderItems?.map((item: any, index: number) => (
              <View key={index} style={styles.billRow}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemPrice}>
                  {parseFloat(item.price).toFixed(3)}
                </Text>
              </View>
            ))}

            <DashedLine />

            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>KWD {orderTotal.toFixed(3)}</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default Trackorder;

const CARD_BG   = "rgba(13,8,27,1)";
const GREEN     = "#059B5D";
const STEP_SIZE = 30;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "rgba(250,250,250,1)",
  },

  // Header
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: "rgba(250,250,250,1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Status card
  statusCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    overflow: "visible",
    paddingBottom: 20,
  },
  statusTop: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 10,
    gap: 4,
  },
  statusTitle: {
    color: "#fff",
    fontFamily: "Lato-SemiBold",
    fontSize: 20,
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  statusSubtitle: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: "Lato-Regular",
    fontSize: 13,
  },
  scooterWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: 180,
    height: 90,
  },
  glowContainer: {
    position: "absolute",
    width: 180,
    height: 180,
    top: -45,
  },
  scooterImage: {
    width: 64,
    height: 64,
    zIndex: 1,
  },

  // Step progress
  stepsSection: {
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 8,
  },
  trackOuter: {
    position: "relative",
    height: STEP_SIZE,
  },
  trackBg: {
    position: "absolute",
    // Align with centers of first/last circles: each circle = STEP_SIZE, centered in flex:1 cell (25% of row)
    // Center of first = 12.5%, center of last = 87.5% → margin = 12.5%
    left: "12.5%",
    right: "12.5%",
    top: (STEP_SIZE - 4) / 2,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    backgroundColor: GREEN,
    borderRadius: 2,
  },
  stepsRow: {
    flexDirection: "row",
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
  },
  stepItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: STEP_SIZE + 14,
    height: STEP_SIZE + 14,
    borderRadius: (STEP_SIZE + 14) / 2,
    backgroundColor: "rgba(5,155,93,0.22)",
  },
  stepCircle: {
    width: STEP_SIZE,
    height: STEP_SIZE,
    borderRadius: STEP_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  stepDone: {
    backgroundColor: GREEN,
  },
  stepActive: {
    backgroundColor: GREEN,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  stepPending: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
  },

  // Labels
  labelsRow: {
    flexDirection: "row",
  },
  labelItem: {
    flex: 1,
    alignItems: "center",
    gap: 1,
  },
  labelText: {
    fontSize: 9,
    fontFamily: "Lato-Regular",
    textAlign: "center",
    lineHeight: 13,
  },

  // Agent card
  agentCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(5,155,93,0.15)",
    borderWidth: 1,
    borderColor: "rgba(5,155,93,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  agentName: {
    color: "#fff",
    fontFamily: "Lato-SemiBold",
    fontSize: 14,
  },
  agentRole: {
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Lato-Regular",
    fontSize: 11,
    marginTop: 1,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },

  // Section cards
  sectionCard: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  sectionTitle: {
    color: GREEN,
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  addressRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  addressTitle: {
    fontFamily: "Lato-Bold",
    fontSize: 15,
    color: "#141313",
  },
  addressSubtitle: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "rgb(110,110,110)",
    marginTop: 2,
    lineHeight: 18,
  },

  // Order details
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderDetailTitle: {
    color: "#000",
    fontSize: 15,
    fontFamily: "Lato-SemiBold",
  },
  orderDateTime: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    color: "#454545",
  },
  itemName: {
    color: "#5D5D5D",
    fontSize: 13,
    fontFamily: "Lato-Regular",
    flex: 1,
    paddingRight: 10,
  },
  itemPrice: {
    color: "#1a1a1a",
    fontSize: 13,
    fontFamily: "Lato-SemiBold",
  },
  totalLabel: {
    color: "#000",
    fontSize: 15,
    fontFamily: "Lato-Bold",
  },
  totalAmount: {
    color: GREEN,
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
});
