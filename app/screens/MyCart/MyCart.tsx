import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from "../../redux/reducer/cartReducer";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Url } from "../../redux/userConstant";
import { ApiClient } from "../../redux/api";
import ProductCard from "../Product/ProductCard";
import SectionContainer from "../../components/Home/SectionContainer";
import SectionHeader from "../../components/Home/SectionHeader";
import { useAddToCart } from "../../hooks/useAddToCart";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Animated, { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import BottomSheetHeader from "../../components/BottomSheet/BottomSheetHeader";
import AddressList from "../../components/BottomSheet/AddressList";
import { useUserAddress } from "../../hooks/useSaveUserAddress";
import UserDeliveryAddressDropDown from "../Location/UserDeliveryAddressDropDown";
import LocationSelectionView from "../../components/BottomSheet/LocationSelectionView";
import { useSaveUserLocation } from "../../hooks/useSaveUserLocation";
import Input from "../../components/Input/Input";
import DashedLine from "../../components/Common/DashedLine";
import { setSelectedAddress } from "../../redux/reducer/userReducer";
import { AddressResponse } from "../../types/response/addressResponse";

type MyCartScreenProps = StackScreenProps<RootStackParamList, "MyCart">;

const MyCart = ({ navigation }: MyCartScreenProps) => {
  const apiPath = ApiClient();
  const addresses = useSelector((x: any) => x?.user?.addresses || []);
  const { saveLocation, loading: locationLoading } = useSaveUserLocation();
  const user = useSelector((x: any) => x.user.userInfo);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const userLocation = useSelector((x: any) => x.user.defaultAddress);
  const selectedAddress = useSelector((x: any) => x.user.selectedAddress);
  const [products, setProducts] = useState<[]>();
  const [displayedProducts, setDisplayedProducts] = useState<any[]>();
  const cart = useSelector((state: any) => state.cart.cart);
  const [searchQuery, setSearchQuety] = useState<string>("");
  const { width } = useWindowDimensions();

  const { deleteAddress, loading: deleteLoading } = useUserAddress();

  const subTotal = cart.reduce((acc: number, item: any) => {
    return acc + item.productPrice * item.quantity;
  }, 0);

  const isOpen = useSharedValue(false);
  const isOpenEdit = useSharedValue(false);

  const [view, setView] = useState<"LIST" | "EDIT" | "LOCATION">("LOCATION");
  const [editingAddress, setEditingAddress] = useState<any>(null); // Store address being edited
  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  const toggleSheetEdit = () => {
    isOpenEdit.value = !isOpenEdit.value;
  };

  const sheetRef = useRef<any>(null);

  const removeItemFromCart = (data: any) => {
    dispatch(removeFromCart(data));
  };

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const addItemToCart = useAddToCart();

  const totalQuantity = useSelector(selectCartTotalQuantity);
  const totalPrice = useSelector(selectCartTotalPrice);

  const formattedTotalPrice = Number(totalPrice.toFixed(2));

  const savedAmount = cart.reduce((acc: number, item: any) => {
    return acc + (item.productPrice - item.price) * item.quantity;
  }, 0);

  const formattedSavedAmount = Number(savedAmount.toFixed(2));

  useEffect(() => {
    console.log("first item", selectedAddress);
  });

  const {
    governorates,
    cities,
    blocks,

    governorate,
    city,
    block,

    setGovernorate,
    setCity,
    setBlock,

    govVisible,
    cityVisible,
    blockVisible,

    setGovVisible,
    setCityVisible,
    setBlockVisible,
  } = useLocationSelector();

  const OFFERS = [
    {
      title: "Extra 35% Off",
      description: "On your first purchase from SOOPER app purchase",
      couponCode: "FIRSTBUY35",
    },
    {
      title: "Extra 35% Off",
      description: "On your first purchase from SOOPER app purchase",
      couponCode: "FIRSTBUY35",
    },
  ];

  const cartItems = useSelector((x: any) => x?.cart?.cart);

  const orderItems = cartItems.map((x: any) => {
    return {
      id: x.id,
      vendorId: x.vendorId,
      qty: x.quantity,
      variantId: x.variantId,
      salePrice: x.price,
      imageUrl: x.image,
      title: x.title,
    };
  });

  const handleSubmitOrder = async () => {
    setIsOrderSubmitting(true);
    console.log("cartItems", orderItems);
    try {
      const checkoutFormData = {
        name: user.name,
        userId: user.id,
        email: user.email,
        country: userLocation.country,
        city: userLocation.city.name,
        governorate: userLocation.governorate.name, // governorate → state
        block: userLocation.block.name, // block → district
        streetAddress: selectedAddress?.street, // street → streetAddress
        phone: selectedAddress?.contactPhone || user.phone, // Fallback to user phone or dummy if selectedAddress is missing
        apartmentNumber: selectedAddress.apartmentNumber,
        paymentMethod: "Cash On Delivery",
      };

      await apiPath.post(
        `${Url}/api/orders`,
        { checkoutFormData, orderItems },
        "",
      );

      dispatch(clearCart());
      navigation.navigate("OrderPlacedSuccess");
    } catch (error: any) {
      console.log("Error submitting order:", error.message);
    } finally {
      setIsOrderSubmitting(false);
    }
  };

  useEffect(() => {
    if (!userLocation) return;
    if (!userLocation.governorate) return;
    const fetchProducts = async () => {
      try {
        const response = await apiPath.get(
          `${Url}/api/products?gov=${userLocation.governorate.name}&city=${userLocation.city.name}&block=${userLocation.block.name}&search =${searchQuery}`,
        );
        console.log("product api", response.data.length);
        setProducts(response.data);
        setDisplayedProducts(response.data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  useEffect(() => {
    console.log("screen width", width);
  });

  useEffect(() => {
    console.log(" this is the cart", cart);
  });

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(250, 250, 250, 1)" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={{ gap: 20 }}>
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
            </TouchableOpacity>
            <View style={{ position: "absolute", left: 0, right: 0 }}>
              <Text
                style={{
                  fontFamily: "Lato-Bold", // preferred if font file exists
                  fontSize: 20,
                  lineHeight: 32,
                  letterSpacing: -0.48, // -3% of 16px = -0.48
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                My Cart
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 20 }}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 20,
              borderRadius: 8,
              backgroundColor: "#ffff",
            }}
          >
            <LinearGradient
              colors={["rgba(106, 61, 208, 1)", "rgba(54, 31, 106, 1)"]}
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 13,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontFamily: "Lato-Bold",
                }}
              >
                15 mins
              </Text>
            </LinearGradient>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  color: "rgba(5, 155, 93, 1)",
                  fontSize: 16,
                  fontFamily: "Lato-Bold",
                }}
              >
                Delivering To
              </Text>
              <Image
                style={{ width: 15, height: 15 }}
                source={require("../../assets/images/icons/delivery-bike.png")}
              />
              <DashedLine />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {selectedAddress !== null ? (
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ height: 15, width: 15, resizeMode: "contain" }}
                      source={require("../../assets/images/icons/locationpinblack.png")}
                    />
                    <Text
                      style={{
                        fontFamily: "Lato-Bold",
                        fontSize: 15,
                        lineHeight: 28,
                        color: "#141313",
                      }}
                    >
                      {selectedAddress.type}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 13,
                        lineHeight: 20,
                        color: "rgb(17, 17, 17)",
                        flexShrink: 1,
                      }}
                      numberOfLines={2}
                    >
                      Street {selectedAddress.street}
                      {selectedAddress.apartmentName
                        ? `, Apartment ${selectedAddress.apartmentName}`
                        : ""}
                      {selectedAddress.apartmentNumber
                        ? `, Flat ${selectedAddress.apartmentNumber}`
                        : ""}
                      {selectedAddress.contactPhone
                        ? `, ${selectedAddress.contactPhone}`
                        : ""}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ height: 15, width: 15, resizeMode: "contain" }}
                      source={require("../../assets/images/icons/locationpinblack.png")}
                    />
                    <Text
                      style={{
                        fontFamily: "Lato-Bold",
                        fontSize: 15,
                        lineHeight: 28,
                        color: "#141313",
                      }}
                    >
                      Add a delivery address
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={{
                  borderWidth: 1,
                  borderBlockColor: "black",
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setView("LOCATION");
                    toggleSheet();
                  }}
                >
                  <Text style={{ fontFamily: "Lato-Regular" }}>
                    {selectedAddress ? "Change" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: "white", gap: 20 }}>
            {cart.map((item: any, index: number) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 12,
                    padding: 10,
                    borderBottomWidth: cart.at(-1) === item ? 0 : 1,
                    paddingBottom: 15,
                    borderBottomColor: "#E0E0E0",
                  }}
                >
                  <View style={styles.imageBox}>
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={{ uri: item.image }}
                    />
                  </View>

                  <View style={styles.textBox}>
                    <Text numberOfLines={2} style={styles.title}>
                      {item.title}
                    </Text>

                    <Text style={styles.subTitle}>
                      {item.variantQuantity}
                      {item.unit === "LITRE"
                        ? "L"
                        : item.unit === "KILOGRAM"
                          ? "KG"
                          : item.unit}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text
                        style={{
                          ...styles.itemDescription,
                          fontFamily: "Lato-Bold",
                          fontSize: 14,
                        }}
                      >
                        {item.price}
                      </Text>
                      <Text
                        style={{
                          ...styles.itemDescription,
                          fontFamily: "Lato-Medium",
                          fontSize: 14,
                          color: "#8C8C8C",
                          textDecorationLine: "line-through",
                        }}
                      >
                        {item.productPrice}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stepper}>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(decrementQuantity({ id: item.id }));
                      }}
                    >
                      <Image
                        source={require("../../assets/images/icons/minusblack.png")}
                        style={{ width: 15, height: 15 }}
                      />
                    </TouchableOpacity>

                    <Text style={styles.qty}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => {
                        dispatch(incrementQuantity({ id: item.id }));
                      }}
                    >
                      <Image
                        source={require("../../assets/images/icons/plusblack.png")}
                        style={{ width: 15, height: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <Input
            multiline={true}
            numberOfLines={10}
            placeholder="ADDITIONAL NOTES"
          />

          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 20,
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 15,
                fontFamily: "Lato-SemiBold",
              }}
            >
              Bill Details
            </Text>

            <View style={{ gap: 10 }}>
              <View style={styles.billContainer}>
                <Text style={styles.billDetailsText}>Sub Total</Text>
                <Text> {subTotal}</Text>
              </View>
              <View style={styles.billContainer}>
                <Text style={styles.billDetailsText}>Discount</Text>
                <Text style={{ color: "rgba(5, 155, 93, 1)" }}>
                  {formattedSavedAmount}
                </Text>
              </View>
              <View style={styles.billContainer}>
                <Text style={styles.billDetailsText}>Delivery Charge</Text>
                <Text>15</Text>
              </View>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <DashedLine />
            </View>

            <View>
              <View style={styles.billContainer}>
                <Text>To Pay </Text>
                <Text> د.ك {formattedTotalPrice}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        {view === "LIST" && (
          <Animated.View style={styles.bottomSheetContent}>
            <BottomSheetHeader
              title="CHANGE ADDRESS"
              onClose={() => {
                setView("LOCATION");
                toggleSheet();
              }}
            />
            <AddressList
              addresses={addresses}
              onEdit={(address) => {
                setEditingAddress(address); // Set the address to be edited
                toggleSheetEdit();
                setView("EDIT");
              }}
              onRemove={(address) => {
                Alert.alert(
                  "Delete Address",
                  "Are you sure you want to delete this address?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        deleteAddress({
                          id: address.id,
                          onSuccess: () => {
                            // Address will be removed from Redux state automatically
                          },
                          onError: (error) => {
                            Alert.alert(
                              "Error",
                              error || "Failed to delete address",
                            );
                          },
                        });
                      },
                    },
                  ],
                );
              }}
              onAddNew={() => {
                setEditingAddress(null); // Clear editing address (add new mode)
                setView("EDIT");
              }}
              onSelect={(address: AddressResponse) => {
                dispatch(setSelectedAddress(address));
              }}
            />
          </Animated.View>
        )}

        {view === "EDIT" && (
          <Animated.View style={{ ...styles.bottomSheetContent, gap: 40 }}>
            <BottomSheetHeader title="CHANGE ADDRESS" onClose={toggleSheet} />
            <UserDeliveryAddressDropDown
              addressToEdit={editingAddress} // Pass address if editing, null if adding new
              onChangeLocation={() => {
                setView("LOCATION");
              }}
            />
          </Animated.View>
        )}

        {view === "LOCATION" && (
          <Animated.View
            style={{
              ...styles.bottomSheetContent,
              justifyContent: "space-between",
              gap: 15,
            }}
          >
            <BottomSheetHeader title="CHANGE ADDRESS" onClose={toggleSheet} />
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <LocationSelectionView
                governorates={governorates}
                cities={cities}
                blocks={blocks}
                governorate={governorate}
                city={city}
                block={block}
                govVisible={govVisible}
                cityVisible={cityVisible}
                blockVisible={blockVisible}
                onGovOpen={() => setGovVisible(true)}
                onGovClose={() => setGovVisible(false)}
                onCityOpen={() => setCityVisible(true)}
                onCityClose={() => setCityVisible(false)}
                onBlockOpen={() => setBlockVisible(true)}
                onBlockClose={() => setBlockVisible(false)}
                onGovernorateSelect={(item) => {
                  setGovernorate(item);
                  setCity(null);
                  setBlock(null);
                }}
                onCitySelect={(item) => {
                  setCity(item);
                  setCityVisible(false);
                  setBlock(null);
                }}
                onBlockSelect={(item) => {
                  setBlock(item);
                  setBlockVisible(false);
                }}
                onContinue={() => {
                  if (!governorate || !city || !block) {
                    Alert.alert(
                      "Error",
                      "Please select governorate, city, and block",
                    );
                    return;
                  }

                  const currentGovId = userLocation?.governorate?.id;
                  const currentCityId = userLocation?.city?.id;
                  const currentBlockId = userLocation?.block?.id;

                  const nextGovId = governorate?.id;
                  const nextCityId = city?.id;
                  const nextBlockId = block?.id;

                  const locationChanged =
                    (!!currentGovId && currentGovId !== nextGovId) ||
                    (!!currentCityId && currentCityId !== nextCityId) ||
                    (!!currentBlockId && currentBlockId !== nextBlockId);

                  const doSaveLocation = () => {
                    saveLocation({
                      payload: {
                        userId: user.id,
                        governorate: governorate.id,
                        city: city.id,
                        block: block.id,
                        country: "Kuwait",
                      },
                      onSuccess: () => {
                        isOpen.value = false;
                        navigation.navigate("Home");
                      },
                      onError: (error) => {
                        Alert.alert(
                          "Error",
                          error || "Failed to save location",
                        );
                      },
                    });
                  };

                  if (locationChanged) {
                    Alert.alert(
                      "Change location?",
                      "Changing governorate/city/block will clear your cart because products depend on your location. Do you want to continue?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Continue",
                          style: "destructive",
                          onPress: doSaveLocation,
                        },
                      ],
                    );
                    return;
                  }

                  setView("LIST");
                }}
              />
            </View>
          </Animated.View>
        )}
      </LocationBottomSheet>

      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 1)",
          paddingVertical: 20,
          paddingHorizontal: 20,
          gap: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 }, // shadow comes from top
          shadowOpacity: 0.12,
          shadowRadius: 8,

          // ✅ SHADOW (Android)
          elevation: 10,

          // Optional but recommended
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 10 }}>
            <Text
              style={{
                color: "rgba(89, 89, 89, 1)",
                fontFamily: "Lato-Regular",
              }}
            >
              Payment Method
            </Text>
            <Text style={{ fontFamily: "Lato-SemiBold" }}>
              Cash On Delivery
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 10 }}>
            <Text style={{ fontFamily: "Lato-Bold", fontSize: 35 }}>
              د.ك {formattedTotalPrice}
            </Text>
            <Text style={{ color: "rgba(0, 138, 25, 1)" }}>
              Saved د.ك {formattedSavedAmount}
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderBlockColor: "black",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 8,
              height: 53,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(30, 18, 61, 1)",
            }}
          >
            <TouchableOpacity
              disabled={isOrderSubmitting}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                handleSubmitOrder();
              }}
            >
              {isOrderSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontFamily: "Lato-Medium",
                    }}
                  >
                    Order Now
                  </Text>
                  <Image
                    style={{ width: 15, height: 15 }}
                    source={require("../../assets/images/icons/arrow.png")}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MyCart;

const styles = StyleSheet.create({
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
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

  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  textBox: {
    flex: 1, // 🔑 key point
    paddingRight: 10,
  },

  title: {
    fontSize: 14,
    color: "#00000",
    fontFamily: "Lato-Medium",
  },

  subTitle: {
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

  price: {
    fontSize: 12,
    marginRight: 6,
    fontFamily: "Lato-SemiBold",
    fontWeight: 700,
  },

  strike: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },

  stepper: {
    width: 90, // 🔑 fixed width
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  stepperBtn: {
    fontSize: 18,
    fontWeight: "600",
  },

  qty: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Lato-Medium",
  },

  billContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: "white",
    // gap: 10,
    paddingBottom: 5,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  billDetailsText: {
    color: "#5D5D5D",
    fontSize: 13,
    fontFamily: "Lato-Regular",
  },
  itemDescription: {
    fontFamily: "Lato-Medium",
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.36, // -3% of 12px
    color: "rgba(0, 0, 0, 1)",
  },
});
