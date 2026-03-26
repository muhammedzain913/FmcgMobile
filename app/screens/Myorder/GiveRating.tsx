import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import StarRating from "../../components/Rating/StarRating";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";

type GiveRatingScreenProps = StackScreenProps<RootStackParamList, "GiveRating">;

interface Product {
  id: string;
  name: string;
  quantity: string;
  image: any;
  rating: number;
}

interface Rating {
  productId: string;
  rating: number;
}

const apiPath = ApiClient();

const GiveRating = ({ navigation, route }: GiveRatingScreenProps) => {
  const apiPath = ApiClient();
  const orderFromParams = route.params?.order;
  const [order, setOrder] = useState<any>(orderFromParams);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState<Rating[]>([]);

  // Always fetch full order details to ensure we have deliveryAgent populated
  useEffect(() => {
    const fetchFullOrder = async () => {
      if (orderFromParams?.id) {
        setLoading(true);
        try {
          // Fetch full order from API (this endpoint includes deliveryAgent: true)
          const response = await apiPath.get(
            `${Url}/api/orders/${orderFromParams.id}`,
          );
          setOrder(response.data);
          console.log("Fetched full order:", response.data);
          console.log("DeliveryAgent:", response.data?.deliveryAgent);
          console.log(
            "DeliveryAgent name:",
            response.data?.deliveryAgent?.name,
          );
        } catch (error: any) {
          console.error("Error fetching order details:", error);
          // Fallback to order from params if fetch fails
          setOrder(orderFromParams);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFullOrder();
  }, [orderFromParams?.id]);
  const [deliveryRating, setDeliveryRating] = useState(0);
  

  const handleProductRatingChange = (productId: string, rating: number) => {
    setRating((prevRatings) => {
      const existingRatingIndex = prevRatings.findIndex(
        (r) => r.productId === productId,
      );
      if (existingRatingIndex !== -1) {
        const updatedRatings = [...prevRatings];
        updatedRatings[existingRatingIndex] = {
          ...updatedRatings[existingRatingIndex],
          rating,
        };
        return updatedRatings;
      } else {
        return [...prevRatings, { productId, rating }];
      }
    });
  };

  const handleSubmitRating = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        productRatings: rating,
      };
      console.log("Payload to be sent:", payload);
      const response = await apiPath.post(
        `${Url}/api/products/ratings`,
        payload,
        {},
      );
      console.log("Response from rating submission:", response.data);
    } catch (error) {
      console.error("Error submitting ratings:", error);
    } finally {
      setIsSubmitting(false);
      if ((navigation as any)?.canGoBack?.()) {
        navigation.goBack();
      } else {
        navigation.navigate("Myorder");
      }
    }
  };

  useEffect(() => {
    console.log("Current Ratings State:", rating);
  }, [rating]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "white",
            paddingVertical: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              justifyContent: "space-between",
              backgroundColor: "#ffff",
            }}
          >
            <View
              style={{
                flexDirection: "row", // Flow: Horizontal
                alignItems: "center", // Inner alignment
                height: 36, // Fixed height // Padding
                paddingVertical: 7.78,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#E5E5E5",
                backgroundColor: "rgba(255, 255, 255, 0.6)", // Required for blur effect
                width: 36,
                justifyContent: "center",
              }}
            >
              <Image
                style={{ height: 20, width: 15, marginTop: 4 }}
                source={require("../../assets/images/icons/left-chevron.png")}
              />
            </View>
            <View style={{ position: "absolute", left: 0, right: 0 }}>
              <Text
                style={{
                  fontFamily: "Lato-SemiBold", // preferred if font file exists
                  fontSize: 20,
                  lineHeight: 32,
                  letterSpacing: -0.48, // -3% of 16px = -0.48
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                Give Rating
              </Text>
            </View>
          </View>
        </View>
        <View style={GlobalStyleSheet.container}>
          {/* RATE YOUR DELIVERY Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RATE YOUR DELIVERY</Text>
            <View style={styles.deliveryCard}>
              {/* First Row: Avatar and Name */}
              <View style={styles.deliveryPartnerInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={require("../../assets/images/icons/dp.png")}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.deliveryPartnerName}>
                  {order?.deliveryAgent?.name ||
                    order?.deliveryAgent?.fullName ||
                    order?.deliveryAgent?.firstName ||
                    (order?.deliveryAgent
                      ? "Delivery Partner"
                      : "No Agent Assigned")}
                </Text>
              </View>

              {/* Second Row: Rate Delivery Partner with light orange background */}
              <View style={styles.ratingRowContainer}>
                <Text style={styles.rateText}>Rate Delivery Partner</Text>
                <StarRating
                  rating={deliveryRating}
                  onRatingChange={setDeliveryRating}
                  starSize={20}
                />
              </View>
            </View>
          </View>

          {/* RATE YOUR PRODUCTS Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RATE YOUR PRODUCTS</Text>
            {order.orderItems.map((orderItem: any) => (
              <View key={orderItem.id} style={styles.productCardWrapper}>
                <View style={styles.productCard}>
                  {/* First Row: Product Image, Name, and Quantity */}
                  <View style={styles.productInfoRow}>
                    <View style={styles.imageBox}>
                      <Image
                        source={{ uri: orderItem.product?.imageUrl }}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.productDetails}>
                      <Text numberOfLines={2} style={styles.productName}>
                        {orderItem?.product?.title}
                      </Text>
                      <Text style={styles.productQuantity}>
                        {orderItem.quantity || orderItem.qty}{" "}
                        {orderItem.product?.unit === "LITRE"
                          ? "L"
                          : orderItem.product?.unit === "KILOGRAM"
                            ? "KG"
                            : orderItem.product?.unit || orderItem.unit}
                      </Text>
                      <View style={styles.priceRow}>
                        <Text
                          style={{
                            fontFamily: "Lato-Bold",
                            fontSize: 14,
                            color: "#000",
                          }}
                        >
                          {orderItem.salePrice || orderItem.price}
                        </Text>
                        {orderItem.productPrice && (
                          <Text
                            style={{
                              fontFamily: "Lato-Medium",
                              fontSize: 14,
                              color: "#8C8C8C",
                              textDecorationLine: "line-through",
                            }}
                          >
                            {orderItem.productPrice}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Second Row: Rate This Product with light green background */}
                  <View style={styles.productRatingRowContainer}>
                    <Text style={styles.rateProductText}>
                      Rate This Product
                    </Text>
                    <StarRating
                      rating={
                        rating.find((r) => r.productId === orderItem.product.id)
                          ?.rating || 0
                      }
                      onRatingChange={(rating) =>
                        handleProductRatingChange(orderItem.product.id, rating)
                      }
                      starSize={20}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Submit Rating Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitRating}
          disabled={isSubmitting}
          style={[
            styles.submitButton,
            isSubmitting && { opacity: 0.7 },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GiveRating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
    gap : 10
  },
  sectionTitle: {
    fontSize: 15,
    color: "#1F1F1F",
    fontFamily: "Lato-SemiBold",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  deliveryCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    // Bottom shadow
    boxShadow: "0px 0px 25px rgba(116, 116, 116, 0.1)",
  },
  deliveryPartnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    padding: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  deliveryPartnerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
    fontFamily: "Lato-Medium",
  },
  ratingRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#FEF1E7", // Very light orange background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "100%",
  },
  rateText: {
    fontSize: 14,
    color: "#F7700B",
    fontFamily: "Lato-Medium",
  },
  productCardWrapper: {},
  productCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    // Bottom shadow
    boxShadow: "0px 0px 25px rgba(116, 116, 116, 0.1)",
  },
  productInfoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
    padding : 10
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    
  },
  productDetails: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
    fontFamily: "Lato-SemiBold",
  },
  productQuantity: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontFamily: "Lato-SemiBold",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 5,
  },
  productRatingRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#E6F5EF", // Very light green background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "100%",
  },
  rateProductText: {
    fontSize: 14,
    color: "#059B5D",
    fontFamily: "Lato-Regular",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    height: 48,
    backgroundColor: "#1E123D",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Lato-Medium",
  },
   imageBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
