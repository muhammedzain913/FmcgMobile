import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { COLORS } from "../../constants/theme";
import { useSelector } from "react-redux";
import { useUserAddress } from "../../hooks/useSaveUserAddress";
import { AddressRequest } from "../../types/requests/addressRequest";
import { AddressResponse } from "../../types/response/addressResponse";

type Props = {
  onChangeLocation: () => void;
  addressToEdit?: AddressResponse | null;
  onSuccess?: () => void;
};

const UserDeliveryAddressDropDown = ({
  onChangeLocation,
  addressToEdit,
  onSuccess,
}: Props) => {
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const { saveAddress, updateAddress, loading } = useUserAddress();

  // Initialize state: if editing, use addressToEdit data; if adding new, use empty state
  const [savedAddress, setSavedAddress] = useState<AddressRequest>(() => {
    if (addressToEdit) {
      // Edit mode: Pre-populate with existing address data
      return {
        type: addressToEdit.type || "HOME",
        street: addressToEdit.street || "",
        apartmentName: addressToEdit.apartmentName || "",
        apartmentNumber: addressToEdit.apartmentNumber || "",
        contactPhone: addressToEdit.contactPhone || "",
      };
    } else {
      // Add new mode: Empty state
      return {
        type: "HOME",
        street: "",
        apartmentName: "",
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
        apartmentName: addressToEdit.apartmentName || "",
        apartmentNumber: addressToEdit.apartmentNumber || "",
        contactPhone: addressToEdit.contactPhone || "",
      });
    } else {
      setSavedAddress({
        type: "HOME",
        street: "",
        apartmentName: "",
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
      updateAddress({
        payload: { ...payload, id: addressToEdit.id },
        onSuccess: () => onSuccess?.(),
        onError: (error: any) => {
          Alert.alert("Error", error || "Failed to update address");
        },
      });
    } else {
      saveAddress({
        payload,
        onSuccess: () => onSuccess?.(),
        onError: (error: any) => {
          Alert.alert("Error", error || "Failed to save address");
        },
      });
    }
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 15 }}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street</Text>
            <Input
              value={savedAddress.street || ""}
              onChangeText={(value) => handleChange(value, "street")}
              placeholder="e.g. Street 5"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Apartment Name</Text>
            <Input
              value={savedAddress.apartmentName || ""}
              onChangeText={(value) => handleChange(value, "apartmentName")}
              placeholder="e.g. Al Noor Building"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Flat / Unit Number</Text>
            <Input
              value={savedAddress.apartmentNumber || ""}
              onChangeText={(value) => handleChange(value, "apartmentNumber")}
              placeholder="e.g. 12"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <Input
              value={savedAddress.contactPhone || ""}
              onChangeText={(value) => handleChange(value, "contactPhone")}
              placeholder="e.g. +965 XXXX XXXX"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.saveAsSection}>
          <Text style={styles.saveAsLabel}>Save As</Text>
          <View style={styles.typeRow}>
            {(["HOME", "WORK", "OTHER"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                activeOpacity={0.7}
                style={[
                  styles.typeChip,
                  savedAddress.type === t && styles.typeChipActive,
                ]}
                onPress={() => handleChange(t, "type")}
              >
                <Ionicons
                  name={
                    t === "HOME"
                      ? "home-outline"
                      : t === "WORK"
                      ? "briefcase-outline"
                      : "ellipsis-horizontal"
                  }
                  size={13}
                  color={savedAddress.type === t ? "#fff" : "#1E123D"}
                />
                <Text
                  style={[
                    styles.typeChipText,
                    savedAddress.type === t && styles.typeChipTextActive,
                  ]}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save button always visible at the bottom */}
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Button
            variant="non"
            text={"#fff"}
            color={"rgba(30, 18, 61, 1)"}
            title={addressToEdit ? "Update Address" : "Save Address"}
            onPress={onSaveAddress}
          />
        )}
      </View>
    </View>
  );
};

export default UserDeliveryAddressDropDown;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 10,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: "Lato-Medium",
    fontSize: 13,
    color: "#1E123D",
  },
  saveAsSection: {
    gap: 10,
  },
  saveAsLabel: {
    fontFamily: "Lato-SemiBold",
    fontSize: 14,
    color: "#1E123D",
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#1E123D",
    backgroundColor: "#fff",
  },
  typeChipActive: {
    backgroundColor: "#1E123D",
  },
  typeChipText: {
    fontFamily: "Lato-Medium",
    fontSize: 13,
    color: "#1E123D",
  },
  typeChipTextActive: {
    color: "#fff",
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
});
