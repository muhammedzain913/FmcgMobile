import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useUserAddress } from "../../hooks/useSaveUserAddress";
import AddressCard from "../../components/BottomSheet/AddressCard";
import Button from "../../components/Button/Button";

type SavedAddressesScreenProps = StackScreenProps<
  RootStackParamList,
  "SavedAddresses"
>;

const SavedAddresses = ({ navigation }: SavedAddressesScreenProps) => {
  const addresses = useSelector((x: any) => x?.user?.addresses || []);
  const { deleteAddress, loading } = useUserAddress();

  const handleEdit = (address: any) => {
    // Navigate to edit address screen or open bottom sheet
    navigation.navigate("UserDeliveryAddress");
  };

  const handleRemove = (address: any) => {
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
                Alert.alert("Error", error || "Failed to delete address");
              },
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    navigation.navigate("UserDeliveryAddress");
  };

  const getAddressIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "HOME":
        return require("../../assets/images/icons/House.png");
      case "WORK":
        return require("../../assets/images/icons/briefcase.png");
      default:
        return require("../../assets/images/icons/House.png");
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
      case "HOME":
        return "Home";
      case "WORK":
        return "Work";
      case "OTHER":
        return "Other";
      default:
        return type || "Address";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              style={styles.backIcon}
              source={require("../../assets/images/icons/left-chevron.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Address List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No saved addresses</Text>
            </View>
          ) : (
            addresses.map((address: any) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressCardContent}>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleEdit(address)}>
                      <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRemove(address)}>
                      <Text style={styles.removeButton}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.addressRow}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={getAddressIcon(address.type)}
                        style={styles.icon}
                      />
                    </View>
                    <View style={styles.addressInfo}>
                      <View style={styles.addressTypeRow}>
                        <Image
                          style={styles.locationPin}
                          source={require("../../assets/images/icons/locationpinblack.png")}
                        />
                        <Text style={styles.addressType}>
                          {getAddressTypeLabel(address.type)}
                        </Text>
                      </View>
                      <Text style={styles.addressText}>
                        {address.street || ""}
                        {address.apartmentNumber
                          ? `, Apartment ${address.apartmentNumber}`
                          : ""}
                        {address.contactPhone ? `, ${address.contactPhone}` : ""}
                      </Text>
                      {address.user?.location && (
                        <Text style={styles.addressText}>
                          {address.user.location.governorate?.name || ""}
                          {address.user.location.city?.name
                            ? `, ${address.user.location.city.name}`
                            : ""}
                          {address.user.location.block?.name
                            ? `, ${address.user.location.block.name}`
                            : ""}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Add New Address Button */}
        <View style={styles.buttonContainer}>
          <Button
            variant="non"
            title="Add New Address"
            color="#1E123D"
            text="#FFFFFF"
            onPress={handleAddNew}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  backIcon: {
    width: 15,
    height: 20,
  },
  headerTitle: {
    fontFamily: "Lato-Bold",
    fontSize: 18,
    color: "#000000",
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    color: "#8C8C8C",
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  addressCardContent: {
    gap: 15,
  },
  addressRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginTop: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  addressInfo: {
    flex: 1,
    gap: 5,
  },
  addressTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationPin: {
    width: 12,
    height: 12,
    resizeMode: "contain",
  },
  addressType: {
    fontFamily: "Lato-Bold",
    fontSize: 15,
    color: "#141313",
  },
  addressText: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "#111111",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  editButton: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "#000000",
  },
  removeButton: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "#EB0000",
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
});

export default SavedAddresses;
