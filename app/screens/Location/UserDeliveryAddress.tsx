import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Typography } from "../../constants/typography";
import { useSelector } from "react-redux";
import ReAnimated, { useSharedValue } from "react-native-reanimated";
import LocationBottomSheet from "../../components/BottomSheet/LocationBottomSheet";
import DropdownMenu from "../../components/DropDown/DropDownMenu";
import MenuOption from "../../components/DropDown/MenuOption";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useUserAddress } from "../../hooks/useSaveUserAddress";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { AddressRequest } from "../../types/requests/addressRequest";
import { StatusBar } from "expo-status-bar";
import LocationDisplay from "../../components/Location/LocationDisplay";

type UserDeliveryAddressScreenProps = StackScreenProps<
  RootStackParamList,
  "UserDeliveryAddress"
>;

const UserDeliveryAddress = ({
  navigation,
}: UserDeliveryAddressScreenProps) => {
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const { saveAddress, loading } = useUserAddress();
  const isOpen = useSharedValue(false);

  const [noDeliveryVisible, setNoDeliveryVisible] = useState(false);
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const showNoDeliveryModal = () => {
    setNoDeliveryVisible(true);
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 12,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideNoDeliveryModal = (onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(modalScale, { toValue: 0.8, duration: 180, useNativeDriver: true }),
      Animated.timing(modalOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setNoDeliveryVisible(false);
      modalScale.setValue(0);
      modalOpacity.setValue(0);
      onDone?.();
    });
  };

  const [savedAddress, setSavedAddress] = useState<AddressRequest>({
    type: "HOME",
    street: "",
    apartmentName: "",
    apartmentNumber: "",
    contactPhone: "",
  });

  const handleChange = (text: string, field: keyof AddressRequest) => {
    setSavedAddress((prev) => ({
      ...prev,
      [field]: text,
    }));
  };

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

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

  useEffect(() => {
    console.log('settted ',governorate)
  })

  const onSaveAddress = () => {
    if (!savedAddress.type) {
      Alert.alert("Error", "Please select an address type");
      return;
    }

    saveAddress({
      payload: {
        ...savedAddress,
        userId,
      } as AddressRequest,
      onSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "DrawerNavigation" }],
        });
      },
      onError: (error: string) => {
        const msg = (error || "").toLowerCase();
        const isNoVendor =
          msg.includes("no delivery available") ||
          msg.includes("vendor") ||
          msg.includes("no delivery") ||
          msg.includes("not available") ||
          msg.includes("unavailable") ||
          msg.includes("no vendor") ||
          msg.includes("region");
        if (isNoVendor) {
          showNoDeliveryModal();
        } else {
          Alert.alert("Error", error || "Failed to save address");
        }
      },
    });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#1E123D" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <StatusBar translucent={true} backgroundColor="#1E123D" style="light" />
        <ScrollView
          style={{ backgroundColor: "transparent" }}
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                  style={styles.backButton}
                >
                  <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "grey",
                    paddingBottom: 20,
                  }}
                >
                  <LocationDisplay
                    governorate={governorate}
                    city={city}
                    block={block}
                    showChangeButton={true}
                    onChangePress={toggleSheet}
                    textColor="#FFFFFF"
                  />
                </View>
              </View>

              <View style={{ gap: 15 }}>
                <Input
                  onChangeText={(value) => handleChange(value, "street")}
                  variant="dark"
                  placeholder="Street"
                  value={savedAddress.street || ""}
                />
                <Input
                  onChangeText={(value) => handleChange(value, "apartmentName")}
                  variant="dark"
                  placeholder="Apartment"
                  value={savedAddress.apartmentName || ""}
                />
                <Input
                  onChangeText={(value) => handleChange(value, "apartmentNumber")}
                  variant="dark"
                  placeholder="Apartment / Flat number"
                  value={savedAddress.apartmentNumber || ""}
                />
                <Input
                  onChangeText={(value) => handleChange(value, "contactPhone")}
                  variant="dark"
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  value={savedAddress.contactPhone || ""}
                />
              </View>

              <View>
                <View>
                  <Text style={[Typography.titleMedium, { color: "white" }]}>
                    Save As
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.buttonView, savedAddress.type === "HOME" && styles.buttonViewActive]}
                    onPress={() => handleChange("HOME", "type")}
                  >
                    <Ionicons name="home-outline" size={13} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.buttonView, savedAddress.type === "WORK" && styles.buttonViewActive]}
                    onPress={() => handleChange("WORK", "type")}
                  >
                    <Ionicons name="briefcase-outline" size={13} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Work</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.buttonView, savedAddress.type === "OTHER" && styles.buttonViewActive]}
                    onPress={() => handleChange("OTHER", "type")}
                  >
                    <Ionicons name="ellipsis-horizontal" size={13} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>

          <View style={{ marginVertical: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <Button
                variant="decorate"
                text={"black"}
                color={"white"}
                title="Save Address"
                onPress={onSaveAddress}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LocationBottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        <ScrollView contentContainerStyle={{ paddingBottom: 400 }}>
          <ReAnimated.View
            style={{ flex: 1, paddingVertical: 60, paddingHorizontal: 20 }}
          >
            <Text style={[Typography.titleMedium]}>CHOOSE GOVERNORATE</Text>
            <DropdownMenu
              visible={govVisible}
              handleOpen={() => setGovVisible(true)}
              handleClose={() => setGovVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {governorate ? governorate?.name : "Select Governerate"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#333333" />
                </View>
              }
            >
              {governorates.map((block: any, index) => {
                return (
                  <MenuOption
                    key={index}
                    onSelect={() => {
                      setGovernorate(block);
                      setCity(null);
                      setBlock(null);
                    }}
                  >
                    <Text>{block?.name}</Text>
                  </MenuOption>
                );
              })}
            </DropdownMenu>

            <Text style={[Typography.titleMedium]}>CHOOSE CITY</Text>

            <DropdownMenu
              visible={cityVisible}
              handleOpen={() => setCityVisible(true)}
              handleClose={() => setCityVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {city ? city?.name : "Select City"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#333333" />
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {cities.map((city, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setCity(city);
                        setCityVisible(false);
                        setBlock(null);
                      }}
                    >
                      <Text>{city?.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>

            <Text style={[Typography.titleMedium]}>CHOOSE BLOCK</Text>

            <DropdownMenu
              visible={blockVisible}
              handleOpen={() => setBlockVisible(true)}
              handleClose={() => setBlockVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {block ? block.name : "Select Block"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#333333" />
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {blocks.map((block, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setBlock(block);
                        setBlockVisible(false);
                      }}
                    >
                      <Text>{block?.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>
          </ReAnimated.View>
        </ScrollView>
        <Animated.View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Button
            variant="non"
            color={"#1E123D"}
            title="Continue"
            onPress={() => {
              isOpen.value = false;
            }}
          />
        </Animated.View>
      </LocationBottomSheet>

      <Modal
        transparent
        visible={noDeliveryVisible}
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => hideNoDeliveryModal()}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              { opacity: modalOpacity, transform: [{ scale: modalScale }] },
            ]}
          >
            <View style={styles.modalIconRing}>
              <Ionicons name="location-outline" size={38} color="#1E123D" />
            </View>

            <Text style={styles.modalTitle}>No Delivery Here Yet</Text>
            <Text style={styles.modalBody}>
              Sorry, we don't deliver to this region yet. But we're growing fast
              and will be available in your area soon!
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() =>
                hideNoDeliveryModal(() => {
                  isOpen.value = true;
                })
              }
            >
              <Ionicons name="map-outline" size={16} color="#FFFFFF" />
              <Text style={styles.modalPrimaryBtnText}>Change Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalSecondaryBtn}
              onPress={() => BackHandler.exitApp()}
            >
              <Ionicons name="exit-outline" size={16} color="#1E123D" />
              <Text style={styles.modalSecondaryBtnText}>Exit App</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default UserDeliveryAddress;

const styles = StyleSheet.create({
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F0F0F0",
    borderRadius: 8,
    borderWidth: 1,
    width: 36,
    height: 36,
  },
  buttonView: {
    width: 78,
    height: 32,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  buttonViewActive: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 2,
  },
  triggerStyle: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
  },
  triggerText: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Lato-Regular",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  modalIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EDE8F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Lato-Bold",
    fontSize: 20,
    color: "#1E123D",
    textAlign: "center",
    marginBottom: 10,
  },
  modalBody: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  modalPrimaryBtn: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#1E123D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  modalPrimaryBtnText: {
    fontFamily: "Lato-Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  modalSecondaryBtn: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F0EDF8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalSecondaryBtnText: {
    fontFamily: "Lato-Bold",
    fontSize: 15,
    color: "#1E123D",
  },
});
