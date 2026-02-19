import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import StarRating from "../../components/Rating/StarRating";
import Button from "../../components/Button/Button";
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
  productId : string,
  rating : number
}

const apiPath = ApiClient();

const GiveRating = ({ navigation, route }: GiveRatingScreenProps) => {
  const apiPath = ApiClient();
  const orderFromParams = route.params?.order;
  const [order, setOrder] = useState<any>(orderFromParams);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState<Rating[]>([]);
  
  // Always fetch full order details to ensure we have deliveryAgent populated
  useEffect(() => {
    const fetchFullOrder = async () => {
      if (orderFromParams?.id) {
        setLoading(true);
        try {
          // Fetch full order from API (this endpoint includes deliveryAgent: true)
          const response = await apiPath.get(`${Url}/api/orders/${orderFromParams.id}`);
          setOrder(response.data);
          console.log("Fetched full order:", response.data);
          console.log("DeliveryAgent:", response.data?.deliveryAgent);
          console.log("DeliveryAgent name:", response.data?.deliveryAgent?.name);
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
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Coconut Grove Fresh Pasteurized Milk",
      quantity: "2L",
      image: require("../../assets/images/item/pic1.png"),
      rating: 5,
    },
    {
      id: "2",
      name: "Spice Route Exotic Pasteurized Milk",
      quantity: "500g",
      image: require("../../assets/images/item/pic2.png"),
      rating: 0,
    },
    {
      id: "3",
      name: "Coconut Grove Fresh Pasteurized Milk",
      quantity: "2L",
      image: require("../../assets/images/item/pic1.png"),
      rating: 0,
    },
  ]);

  const handleProductRatingChange = (productId: string, rating: number) => {
   setRating((prevRatings) => {
      const existingRatingIndex = prevRatings.findIndex(r => r.productId === productId);
      if (existingRatingIndex !== -1) {
        const updatedRatings = [...prevRatings];
        updatedRatings[existingRatingIndex] = { ...updatedRatings[existingRatingIndex], rating };
        return updatedRatings;
      } else {
        return [...prevRatings, {  productId, rating }];
      }
    });
  };

  const handleSubmitRating = async () => {
    try {
      const payload = {
        productRatings: rating,
      };
      console.log("Payload to be sent:", payload);
      const response = await apiPath.post(`${Url}/api/products/ratings`, payload,{});
      console.log("Response from rating submission:", response.data);
    } catch (error) {
      console.error("Error submitting ratings:", error);
    } finally {
      navigation.goBack();
    }
  };

  useEffect(() => {
    console.log("Current Ratings State:", rating);
  }, [rating]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Header title="Give Rating" leftIcon="back" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={GlobalStyleSheet.container}>
          {/* RATE YOUR DELIVERY Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RATE YOUR DELIVERY</Text>
            <View style={styles.deliveryCard}>
              {/* First Row: Avatar and Name */}
              <View style={styles.deliveryPartnerInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={require("../../assets/images/user.png")}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.deliveryPartnerName}>
                  {order?.deliveryAgent?.name || 
                   order?.deliveryAgent?.fullName || 
                   order?.deliveryAgent?.firstName || 
                   (order?.deliveryAgent ? "Delivery Partner" : "No Agent Assigned")}
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
            {order.orderItems.map((orderItem : any) => (
              <View key={orderItem.id} style={styles.productCard}>
                {/* First Row: Product Image, Name, and Quantity */}
                <View style={styles.productInfoRow}>
                  <Image
                    source={{ uri: orderItem.product?.imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{orderItem?.product?.title}</Text>
                    {/* <Text style={styles.productQuantity}>{product.quantity}</Text> */}
                  </View>
                </View>
                
                {/* Second Row: Rate This Product with light green background */}
                <View style={styles.productRatingRowContainer}>
                  <Text style={styles.rateProductText}>Rate This Product</Text>
                  <StarRating
                    rating={rating.find(r => r.productId === orderItem.product.id)?.rating || 0}
                    onRatingChange={(rating) =>
                      handleProductRatingChange(orderItem.product.id, rating)
                    }
                    starSize={20}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Submit Rating Button */}
      <View style={styles.buttonContainer}>
        <Button
          variant="non"
          color="#1E123D"
          text="#FFFFFF"
          title="Submit Rating"
          onPress={handleSubmitRating}
        />
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
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F1F1F",
    fontFamily: "Lato-Bold",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  deliveryPartnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 48,
    height: 48,
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
    fontFamily: "Lato-SemiBold",
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
    fontFamily: "Lato-Regular",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  productInfoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
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
    fontSize: 13,
    color: "#8C8C8C",
    fontFamily: "Lato-Regular",
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
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
});
