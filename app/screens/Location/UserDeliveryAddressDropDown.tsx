import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { COLORS } from "../../constants/theme";
import { Typography } from "../../constants/typography";
import { useSelector } from "react-redux";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { useUserAddress } from "../../hooks/useSaveUserAddress";
import { AddressRequest } from "../../types/requests/addressRequest";
import { AddressResponse } from "../../types/response/addressResponse";
import LocationDisplay from "../../components/Location/LocationDisplay";

type Props = {
  onChangeLocation: () => void;
  addressToEdit?: AddressResponse | null; // If provided, edit mode. If null/undefined, add new mode
};

const UserDeliveryAddressDropDown = ({
  onChangeLocation,
  addressToEdit,
}: Props) => {
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const { saveAddress, updateAddress, loading } = useUserAddress();

  const {
    governorate,
    city,
    block,
  } = useLocationSelector();

  // Initialize state: if editing, use addressToEdit data; if adding new, use empty state
  const [savedAddress, setSavedAddress] = useState<AddressRequest>(() => {
    if (addressToEdit) {
      // Edit mode: Pre-populate with existing address data
      return {
        type: addressToEdit.type || "HOME",
        street: addressToEdit.street || "",
        apartmentNumber: addressToEdit.apartmentNumber || "",
        contactPhone: addressToEdit.contactPhone || "",
      };
    } else {
      // Add new mode: Empty state
      return {
        type: "HOME",
        street: "",
        apartmentNumber: "",
        contactPhone: "",
      };
    }
  });

  // Update state when addressToEdit changes (e.g., switching between edit/add)
  useEffect(() => {
    if (addressToEdit) {
      setSavedAddress({
        type: addressToEdit.type || "HOME",
        street: addressToEdit.street || "",
        apartmentNumber: addressToEdit.apartmentNumber || "",
        contactPhone: addressToEdit.contactPhone || "",
      });
    } else {
      setSavedAddress({
        type: "HOME",
        street: "",
        apartmentNumber: "",
        contactPhone: "",
      });
    }
  }, [addressToEdit]);

  const handleChange = (text: string, field: keyof AddressRequest) => {
    setSavedAddress((prev: AddressRequest) => ({
      ...prev,
      [field]: text,
    }));
  };

  const onSaveAddress = () => {
    if (!savedAddress.type) {
      Alert.alert("Error", "Please select an address type");
      return;
    }

    // Prepare payload with userId
    const payload: AddressRequest = {
      ...savedAddress,
      userId,
    };

    // If editing (addressToEdit has id), call updateAddress
    // If adding new (addressToEdit is null), call saveAddress
    if (addressToEdit?.id) {
      // Update existing address
      updateAddress({
        payload: {
          ...payload,
          id: addressToEdit.id,
        },
        onSuccess: () => {
          // Handle success (could close bottom sheet, refresh list, etc.)
        },
        onError: (error: any) => {
          Alert.alert("Error", error || "Failed to update address");
        },
      });
    } else {
      // Create new address
      saveAddress({
        payload,
        onSuccess: () => {
          // Handle success (could close bottom sheet, refresh list, etc.)
        },
        onError: (error: any) => {
          Alert.alert("Error", error || "Failed to save address");
        },
      });
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{}}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ justifyContent: "space-between" }}>
            <View style={{ gap: 30 }}>

              <View style={{ gap: 15 }}>
                <Input
                  value={savedAddress.street || ""}
                  onChangeText={(value) => handleChange(value, "street")}
                  placeholder="Street"
                />
                <Input
                  value={savedAddress.apartmentNumber || ""}
                  onChangeText={(value) =>
                    handleChange(value, "apartmentNumber")
                  }
                  placeholder="Apartment / Flat number"
                  keyboardType="numeric"
                />
                <Input
                  value={savedAddress.contactPhone || ""}
                  onChangeText={(value) =>
                    handleChange(value, "contactPhone")
                  }
                  placeholder="Phone"
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <View>
                  <Text style={[Typography.titleMedium, { color: "#000" }]}>
                    Save As
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View
                    style={[
                      styles.buttonView,
                      savedAddress.type === "HOME" && styles.buttonViewActive,
                    ]}
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                      }}
                      onPress={() => handleChange("HOME", "type")}
                    >
                      <Image
                        style={{ width: 13, height: 13 }}
                        source={require("../../assets/images/icons/homeltst.png")}
                      />
                      <Text style={styles.buttonText}>Home</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.buttonView,
                      savedAddress.type === "WORK" && styles.buttonViewActive,
                    ]}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: "row", gap: 5 }}
                      onPress={() => handleChange("WORK", "type")}
                    >
                      <Image
                        style={{ width: 13, height: 13 }}
                        source={require("../../assets/images/icons/briefcase.png")}
                      />
                      <Text style={styles.buttonText}>Work</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.buttonView,
                      savedAddress.type === "OTHER" && styles.buttonViewActive,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleChange("OTHER", "type")}
                    >
                      <Text style={styles.buttonText}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ marginVertical: 10 }}>
              {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <Button
                  variant=""
                  text={"#fff"}
                  color={"rgba(30, 18, 61, 1)"}
                  title="Save Address"
                  onPress={onSaveAddress}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default UserDeliveryAddressDropDown;

const styles = StyleSheet.create({
  buttonView: {
    width: 78,
    height: 32,
    borderRadius: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
  },
  buttonViewActive: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
    fontSize: 16,
  },
  buttonText: {
    color: "#000",
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    height: 250,
  },
  buttonContainer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  toggleButton: {
    backgroundColor: "#b58df1",
    padding: 12,
    borderRadius: 48,
  },
  toggleButtonText: {
    color: "white",
    padding: 1,
  },
  safeArea: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bottomSheetButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 2,
  },
  bottomSheetButtonText: {
    fontWeight: 600,
    textDecorationLine: "underline",
  },
});
