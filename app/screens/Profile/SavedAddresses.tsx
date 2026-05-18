import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS } from "../../constants/theme";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAddress, deleteUserAddress } from "../../redux/reducer/userReducer";
import { AddressResponse } from "../../types/response/addressResponse";

const addressTypeIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  work: "briefcase-outline",
  other: "location-outline",
};

const SavedAddresses = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const dispatch = useDispatch();

  const addresses: AddressResponse[] = useSelector((x: any) => x.user.addresses ?? []);
  const selectedAddress: AddressResponse | null = useSelector((x: any) => x.user.selectedAddress);

  const handleSelect = (address: AddressResponse) => {
    dispatch(setSelectedAddress(address));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to remove this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(deleteUserAddress(id) as any),
        },
      ]
    );
  };

  const formatAddress = (addr: AddressResponse) => {
    const parts = [
      addr.building,
      addr.street,
      addr.user?.location?.block?.name,
      addr.user?.location?.city?.name,
      addr.user?.location?.governorate?.name,
    ].filter(Boolean);
    return parts.join(", ") || "No address details";
  };

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Saved Addresses" leftIcon="back" titleRight />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[GlobalStyleSheet.container, { paddingTop: 20 }]}>
          {addresses.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.dark ? "rgba(255,255,255,0.08)" : "#F0EDF8" }]}>
                <Ionicons name="location-outline" size={48} color="#1E123D" />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.title }]}>No saved addresses</Text>
              <Text style={[styles.emptySubtitle, { color: colors.text }]}>
                Add your delivery address to enjoy faster checkout.
              </Text>
              <TouchableOpacity
                style={styles.addBtn}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("AddDeleveryAddress")}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {addresses.map((addr, index) => {
                const isSelected = selectedAddress?.id === addr.id;
                const icon = addressTypeIcon[addr.type?.toLowerCase()] ?? "location-outline";
                return (
                  <TouchableOpacity
                    key={addr.id ?? index}
                    style={[
                      styles.card,
                      { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : "#fff" },
                      isSelected && styles.cardSelected,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => handleSelect(addr)}
                  >
                    {/* Icon + label */}
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                        <Ionicons name={icon} size={20} color={isSelected ? "#fff" : "#1E123D"} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.cardLabel, { color: colors.title }]}>
                          {addr.label || addr.type || "Address"}
                        </Text>
                        {addr.contactPerson && (
                          <Text style={[styles.cardContact, { color: colors.text }]}>
                            {addr.contactPerson}
                            {addr.contactPhone ? `  ·  ${addr.contactPhone}` : ""}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Ionicons name="checkmark-circle" size={20} color="#1E123D" />
                        </View>
                      )}
                    </View>

                    {/* Address text */}
                    <Text style={[styles.cardAddress, { color: colors.text }]}>
                      {formatAddress(addr)}
                    </Text>

                    {/* Landmark / instructions */}
                    {addr.landmark ? (
                      <Text style={[styles.cardLandmark, { color: colors.text }]}>
                        Near: {addr.landmark}
                      </Text>
                    ) : null}

                    {/* Actions */}
                    <View style={[styles.cardActions, { borderTopColor: theme.dark ? "rgba(255,255,255,0.1)" : "#F0EDF8" }]}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleSelect(addr)}
                      >
                        <Ionicons
                          name={isSelected ? "radio-button-on" : "radio-button-off"}
                          size={16}
                          color={isSelected ? "#1E123D" : colors.text}
                        />
                        <Text style={[styles.actionText, { color: isSelected ? "#1E123D" : colors.text }]}>
                          {isSelected ? "Selected" : "Select"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDelete(addr.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                        <Text style={[styles.actionText, { color: COLORS.danger }]}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.addMoreBtn}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("AddDeleveryAddress")}
              >
                <Ionicons name="add-circle-outline" size={20} color="#1E123D" />
                <Text style={styles.addMoreText}>Add New Address</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SavedAddresses;

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },

  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 18,
    fontFamily: "Lato",
    fontWeight: "700",
  },

  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Lato",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E123D",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 12,
  },

  addBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "600",
  },

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: "#1E123D",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(30,18,61,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapSelected: {
    backgroundColor: "#1E123D",
  },

  cardLabel: {
    fontSize: 15,
    fontFamily: "Lato",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  cardContact: {
    fontSize: 12,
    fontFamily: "Lato",
    marginTop: 2,
  },

  selectedBadge: {
    marginLeft: "auto",
  },

  cardAddress: {
    fontSize: 13,
    fontFamily: "Lato",
    lineHeight: 19,
    marginBottom: 4,
  },

  cardLandmark: {
    fontSize: 12,
    fontFamily: "Lato",
    fontStyle: "italic",
    marginBottom: 4,
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionText: {
    fontSize: 13,
    fontFamily: "Lato",
    fontWeight: "500",
  },

  addMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#1E123D",
    marginTop: 4,
  },

  addMoreText: {
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "600",
    color: "#1E123D",
  },
});
