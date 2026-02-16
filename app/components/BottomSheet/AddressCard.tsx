import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AddressResponse } from '../../types/response/addressResponse';

interface AddressCardProps {
  address: AddressResponse;
  onEdit: () => void;
  onRemove: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onRemove,
}) => {
  const location = address.user?.location;
  const governorate = location?.governorate;
  const city = location?.city;
  const block = location?.block;

  const getAddressTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'HOME':
        return 'HOME';
      case 'WORK':
        return 'WORK';
      case 'OTHER':
        return 'OTHER';
      default:
        return type?.toUpperCase() || 'ADDRESS';
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'HOME':
        return require("../../assets/images/icons/House.png");
      case 'WORK':
        return require("../../assets/images/icons/briefcase.png");
      default:
        return require("../../assets/images/icons/House.png");
    }
  };

  return (
    <View style={styles.addressCard}>
      <View style={styles.addressCardContent}>
        <View style={styles.addressActions}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove}>
            <Text style={{ ...styles.editText, color: "#EB0000" }}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addressRow}>
          <View style={styles.addressIconContainer}>
            <Image
              source={getAddressIcon(address.type)}
            />
          </View>
          <View style={styles.addressInfo}>
            <View style={styles.addressLocationRow}>
              <Image
                style={{
                  resizeMode: "contain",
                  width: 15,
                  height: 15,
                }}
                source={require("../../assets/images/icons/locationpinblack.png")}
              />
              <Text style={styles.addressTItle}>
                {getAddressTypeLabel(address.type)}
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              {governorate && city && block && (
                <Text style={styles.addressContent}>
                  {governorate.name}, {city.name}, {block.name}
                </Text>
              )}
              <Text style={styles.addressContent}>
                {address.street && `${address.street}, `}
                {address.building && `${address.building}`}
                {address.contactPhone && `, ${address.contactPhone}`}
              </Text>
              {address.apartmentNumber && (
                <Text style={styles.addressContent}>
                  Apt {address.apartmentNumber}
                  {address.floorNumber && `, Floor ${address.floorNumber}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  addressCardContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  addressActions: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "flex-end",
  },
  addressRow: {
    flexDirection: "row",
    gap: 10,
  },
  addressIconContainer: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "rgba(240, 240, 240, 1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 245, 245, 1)",
  },
  addressInfo: {
    flex: 1,
    gap: 5,
  },
  addressLocationRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  addressTItle: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    color: "#000000",
  },
  addressContent: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "rgba(89, 89, 89, 1)",
    lineHeight: 18,
  },
  editText: {
    fontFamily: "Lato-Medium",
    fontSize: 13,
    color: "#000000",
  },
});

export default AddressCard;
