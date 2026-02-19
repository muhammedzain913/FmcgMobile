import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
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

type MyCartScreenProps = StackScreenProps<RootStackParamList, "MyCart">;

const MyCart = ({ navigation }: MyCartScreenProps) => {
  const apiPath = ApiClient();
  const addresses = useSelector((x: any) => x?.user?.addresses || []);
  const { saveLocation, loading: locationLoading } = useSaveUserLocation();
  const user = useSelector((x: any) => x.user.userInfo);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
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

  const isOpen = useSharedValue(false);
  const isOpenEdit = useSharedValue(false);

  const [view, setView] = useState<"LIST" | "EDIT" | "LOCATION">("LIST");
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

  useEffect(() => {
    console.log("first item", cart[0]);
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
    setLoading(true);
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
      setLoading(false);
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
                  fontSize: 14,
                  fontFamily: "Lato-Bold",
                }}
              >
                15 mins
              </Text>
            </LinearGradient>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Text
                style={{
                  color: "rgba(5, 155, 93, 1)",
                  fontSize: 12,
                  fontFamily: "Lato-Bold",
                }}
              >
                Delivering To
              </Text>
              <Image
                style={{ width: 15, height: 15 }}
                source={require("../../assets/images/icons/delivery-man.png")}
              />
              <Image source={require("../../assets/images/line.png")} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
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
                      fontFamily: "Lato-SemiBold",
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
                      lineHeight: 28,
                      color: "rgb(17, 17, 17)",
                    }}
                  >
                    Sreet {selectedAddress.street} , Apartment{" "}
                    {selectedAddress.apartmentNumber} ,{" "}
                    {selectedAddress.contactPhone}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={toggleSheet}>
                <View
                  style={{
                    borderWidth: 1,
                    borderBlockColor: "black",
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 8,
                  }}
                >
                  <Text>Change</Text>
                </View>
              </TouchableOpacity>
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

                    <Text style={styles.subTitle}>{item.quantity}</Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.price}>{item.price}</Text>
                      <Text style={styles.strike}>{item.productPrice}</Text>
                    </View>
                  </View>

                  <View style={styles.stepper}>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(decrementQuantity({ id: item.id }));
                      }}
                    >
                      <Text style={styles.stepperBtn}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.qty}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => {
                        dispatch(incrementQuantity({ id: item.id }));
                      }}
                    >
                      <Text style={styles.stepperBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 15,
                  lineHeight: 20,
                  fontWeight: 600,
                  letterSpacing: -0.39, // -3% of 13px ≈ -0.39
                  color: "rgba(31, 31, 31, 1)",
                  textTransform: "uppercase", // Cap height look
                }}
              >
                APPLY COUPONS AND OFFERS
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
                <View
                  style={{
                    flexDirection: "row", // Flow: Horizontal
                    alignItems: "center", // Inner alignment
                    height: 30, // Fixed height
                    paddingVertical: 7.78,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "rgba(240, 240, 240, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0.6)", // Required for blur effect
                  }}
                >
                  <Image
                    style={{ height: 10, width: 10, marginTop: 4 }}
                    source={require("../../assets/images/icons/top-right.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 30,
                padding: 20,
                paddingRight: 20,
              }}
            >
              {OFFERS.map((item: any, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      gap: 10,
                      padding: 10,
                      borderRadius: 8,
                      minWidth: 280,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: 200 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#000000",
                            marginBottom: 4,
                          }}
                        >
                          {item.title}
                        </Text>

                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(0,0,0,0.6)",
                            lineHeight: 16,
                            flexShrink: 1,
                          }}
                        >
                          {item.description}
                        </Text>
                      </View>

                      <LinearGradient
                        colors={[
                          "rgba(253, 110, 106, 1)",
                          "rgba(255, 198, 0, 1)",
                        ]}
                        style={{
                          paddingHorizontal: 10,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 23,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: "#FFFFFF",
                            lineHeight: 16,
                          }}
                        >
                          Save upto 2000
                        </Text>
                      </LinearGradient>
                    </View>

                    <View
                      style={{
                        backgroundColor: "rgba(249, 236, 246, 1)",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ color: "rgba(150, 0, 116, 1)", fontSize: 20 }}
                      >
                        {item.couponCode}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{ fontSize: 15, color: "rgba(0, 138, 25, 1)" }}
                        >
                          Applied
                        </Text>
                        <Image
                          source={require("../../assets/images/icons/Checks.png")}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <SectionContainer>
            <SectionHeader
              title="PRODUCTS"
              showViewAll={true}
              onViewAllPress={() => {
                navigation.navigate("ShopByBrand");
              }}
            />
            <ScrollView
              contentContainerStyle={{
                gap: 15,
                flexDirection: "row",
                marginTop: 20,
                paddingRight: 20,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {displayedProducts?.map((data: any) => {
                return (
                  <ProductCard
                    key={data.id || data.slug}
                    addToCart={addItemToCart}
                    product={data}
                    navigation={navigation}
                    containerStyle={{
                      width: wp("30%"),
                      minWidth: 120,
                      maxWidth: 160,
                    }}
                  />
                );
              })}
            </ScrollView>
          </SectionContainer>

          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10,
              paddingVertical: 10,
              gap: 20,
            }}
          >
            <Text>Bill Details</Text>

            <View style={{ gap: 10 }}>
              <View style={styles.billContainer}>
                <Text>Sub Total</Text>
                <Text>{totalPrice}</Text>
              </View>
              <View style={styles.billContainer}>
                <Text>Discout</Text>
                <Text style={{ color: "rgba(5, 155, 93, 1)" }}>-₹ 30</Text>
              </View>
              <View style={styles.billContainer}>
                <Text>Delivery Charge </Text>
                <Text>₹ 15</Text>
              </View>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{ width: width - 100 }}
                source={require("../../assets/images/icons/linebill.png")}
              />
            </View>

            <View>
              <View style={styles.billContainer}>
                <Text>To Pay </Text>
                <Text>₹ {totalPrice}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>


      
        <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
          {view === "LIST" && (
            <Animated.View style={styles.bottomSheetContent}>
              <BottomSheetHeader title="CHANGE ADDRESS" onClose={toggleSheet} />
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
                          setView("LIST");
                          // Cart is cleared globally when saveUserLocation succeeds
                          navigation.navigate("Home");
                        },
                        onError: (error) => {
                          Alert.alert("Error", error || "Failed to save location");
                        },
                      });
                    };

                    if (locationChanged) {
                      Alert.alert(
                        "Change location?",
                        "Changing governorate/city/block will clear your cart because products depend on your location. Do you want to continue?",
                        [
                          { text: "Cancel", style: "cancel" },
                          { text: "Continue", style: "destructive", onPress: doSaveLocation },
                        ],
                      );
                      return;
                    }

                    // No gov/city/block change: no warning and no location API call
                    isOpen.value = false;
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
            <Text style={{ color: "rgba(89, 89, 89, 1)" }}>Payment Method</Text>
            <Text style={{ fontWeight: "bold" }}>Online Payment</Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderBlockColor: "black",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 8,
              width: 90,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Change</Text>
          </View>
        </View>


        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              ₹ {totalPrice}
            </Text>
            <Text style={{ color: "rgba(0, 138, 25, 1)" }}>Saved ₹ 750</Text>
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
              <Text style={{ color: "#fff", fontSize: 18 }}>
                Proceed To Pay
              </Text>
              <Image source={require("../../assets/images/icons/arrow.png")} />
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
    fontSize: 12,
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
  },

  price: {
    fontSize: 12,
    marginRight: 6,
    fontFamily: "lato-Bold",
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
    paddingHorizontal: 8,
  },

  stepperBtn: {
    fontSize: 18,
    fontWeight: "600",
  },

  qty: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Lato-SemiBold",
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
});
