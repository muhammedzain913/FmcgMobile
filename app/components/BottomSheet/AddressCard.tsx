import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AddressResponse } from "../../types/response/addressResponse";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAddress } from "../../redux/reducer/userReducer";
import Ionicons from "@expo/vector-icons/Ionicons";

interface AddressCardProps {
  address: AddressResponse;
  onEdit: () => void;
  onRemove: () => void;
  onSelect: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onRemove,
  onSelect,
}) => {
  const getAddressTypeLabel = (type: string) =>
    type?.toUpperCase() || "ADDRESS";

  const getAddressIcon = (type: string): any => {
    switch (type?.toUpperCase()) {
      case "HOME":
        return "home-outline";
      case "WORK":
        return "briefcase-outline";
      default:
        return "location-outline";
    }
  };

  const dispatch = useDispatch();
  const selectedAddress = useSelector((x: any) => x?.user?.selectedAddress);
  const isSelected = String(selectedAddress?.id) === String(address.id);

  const addressLine = [
    address.street && `Street ${address.street}`,
    address.apartmentName && `Apt ${address.apartmentName}`,
    address.apartmentNumber && `Flat ${address.apartmentNumber}`,
    address.contactPhone,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.7}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {/* Icon */}
      <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
        <Ionicons
          name={getAddressIcon(address.type)}
          size={18}
          color={isSelected ? "#fff" : "#1E123D"}
        />
      </View>

      {/* Address info */}
      <View style={styles.info}>
        <Text style={styles.typeLabel}>
          {getAddressTypeLabel(address.type)}
        </Text>
        {!!addressLine && (
          <Text style={styles.addressText} numberOfLines={2}>
            {addressLine}
          </Text>
        )}
      </View>

      {/* Right column: checkmark + actions */}
      <View style={styles.rightCol}>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={18} color="#1E123D" />
        )}
        <TouchableOpacity
          onPress={onEdit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardSelected: {
    borderColor: "#1E123D",
    backgroundColor: "#faf9ff",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EDE8F9",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapSelected: {
    backgroundColor: "#1E123D",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  typeLabel: {
    fontFamily: "Lato-Bold",
    fontSize: 13,
    color: "#1E123D",
    letterSpacing: 0.5,
  },
  addressText: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "#595959",
    lineHeight: 18,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 6,
  },
  editText: {
    fontFamily: "Lato-Medium",
    fontSize: 12,
    color: "#1E123D",
  },
  removeText: {
    fontFamily: "Lato-Medium",
    fontSize: 12,
    color: "#EB0000",
  },
});

export default AddressCard;
