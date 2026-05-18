import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ProductSearchRecentItem = {
  id: string;
  label: string;
  onPress?: () => void;
};

export type ProductSearchChip = {
  id: string;
  label: string;
  onPress?: () => void;
};

type ProductSearchProps = {
  onBackPress?: () => void;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  containerStyle?: ViewStyle;
  recentSearches?: ProductSearchRecentItem[];
  discoverMore?: ProductSearchChip[];
};

const ProductSearch: React.FC<ProductSearchProps> = ({
  onBackPress,
  value,
  onChangeText,
  placeholder = "Search products",
  onSubmit,
  containerStyle,
  recentSearches = [],
  discoverMore = [],
}) => {
  const hasRecent = recentSearches.length > 0;
  const hasDiscover = discoverMore.length > 0;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.topRow}>
        {onBackPress ? (
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color="rgba(0,0,0,0.8)" />
          </TouchableOpacity>
        ) : null}

        <View style={styles.searchBoxContainer}>
          <Ionicons name="search" size={18} color="rgba(0,0,0,0.45)" />
          <View style={styles.searchBoxDivider} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={styles.textInput}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => onSubmit?.()}
          />
          {value.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeText("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color="rgba(0,0,0,0.35)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {hasRecent ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentRow}
          >
            {recentSearches.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={item.onPress}
                style={styles.recentChip}
              >
                <Ionicons name="time-outline" size={13} color="#1E123D" style={{ marginRight: 5 }} />
                <Text style={styles.recentLabel} numberOfLines={1}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {hasDiscover ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover More</Text>
          <View style={styles.chipsWrap}>
            {discoverMore.map((chip) => (
              <TouchableOpacity
                key={chip.id}
                activeOpacity={0.85}
                onPress={chip.onPress}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{chip.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", gap: 18 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 42,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBoxContainer: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBoxDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  textInput: {
    flex: 1,
    height: 48,
    color: "rgba(0,0,0,0.90)",
    fontSize: 15,
    fontFamily: "Lato-Regular",
    padding: 0,
  },
  section: { gap: 10 },
  sectionTitle: {
    fontFamily: "Lato-SemiBold",
    fontSize: 15,
    color: "rgba(0,0,0,0.85)",
  },
  recentRow: { gap: 10, paddingRight: 4 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(30,18,61,0.18)",
    backgroundColor: "rgba(30,18,61,0.04)",
  },
  recentLabel: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "#1E123D",
  },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontFamily: "Lato-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.75)",
  },
});

export default ProductSearch;
