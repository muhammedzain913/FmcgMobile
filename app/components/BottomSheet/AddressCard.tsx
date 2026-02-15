import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface AddressCardProps {
  governorate?: { name: string } | null;
  city?: { name: string } | null;
  block?: { name: string } | null;
  defaultAddress?: {
    street?: string;
    building?: string;
    phone?: string;
  } | null;
  onEdit: () => void;
  onRemove: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  governorate,
  city,
  block,
  defaultAddress,
  onEdit,
  onRemove,
}) => {
  return (
    <View style={styles.addressCard}>
      <View style={styles.addressCardContent}>
        <View style={styles.addressActions}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <Text style={{ ...styles.editText, color: "#EB0000" }}>
            Remove
          </Text>
        </View>
        <View style={styles.addressRow}>
          <View style={styles.addressIconContainer}>
            <Image
              source={require("../../assets/images/icons/House.png")}
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
              <Text style={styles.addressTItle}>HOME</Text>
            </View>
            <View style={{ gap: 5 }}>
              <Text style={styles.addressContent}>
                {governorate?.name}, {city?.name}, {block?.name}
              </Text>
              <Text style={styles.addressContent}>
                {defaultAddress?.street}, {defaultAddress?.building},{" "}
                {defaultAddress?.phone}
              </Text>
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
