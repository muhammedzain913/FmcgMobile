import React, { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type ProductSearchRecentItem = {
  id: string;
  label: string;
  imageUrl?: string;
  imageSource?: any;
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
  onFilterPress?: () => void;
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
  onFilterPress,
  onSubmit,
  containerStyle,
  recentSearches = [],
  discoverMore = [],
}) => {
  const hasRecent = (recentSearches?.length || 0) > 0;
  const hasDiscover = (discoverMore?.length || 0) > 0;

  const filterIcon = useMemo(
    () => require("../../assets/images/icons/filter (1).png"),
    [],
  );
  const searchIcon = useMemo(
    () => require("../../assets/images/icons/searchiconimg.png"),
    [],
  );
  const backIcon = useMemo(
    () => require("../../assets/images/icons/left-chevron.png"),
    [],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.topRow}>
        {onBackPress ? (
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Image source={backIcon} style={styles.backIcon} />
          </TouchableOpacity>
        ) : null}
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["rgba(255,255,255,1)", "rgba(184,184,184,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.searchBoxCotainer}>
              <Image source={searchIcon} style={styles.searchIcon} />
              <View style={styles.searchBoxDivider} />
              <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(0,0,0,0.45)"
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                onSubmitEditing={() => onSubmit?.()}
              />
            </View>
          </LinearGradient>
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
                style={styles.recentItem}
              >
                <View style={styles.recentAvatar}>
                  {item.imageSource || item.imageUrl ? (
                    <Image
                      source={
                        item.imageSource
                          ? item.imageSource
                          : { uri: item.imageUrl }
                      }
                      style={styles.recentAvatarImg}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>
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
  container: {
    width: "100%",
    gap: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gradientBorder: {
    borderRadius: 8,
    padding: 1,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 6,
  },
  searchBoxCotainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgb(115, 158, 123)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "rgba(0,0,0,0.65)",
  },
  searchBoxDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  textInput: {
    flex: 1,
    height: 48,
    color: "rgba(0,0,0,0.90)",
    fontSize: 16,
    fontFamily: "Lato-Regular",
    padding: 0,
  },
  filterBtn: {
    width: 40,
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: {
    width: 18,
    height: 18,
    tintColor: "rgba(0,0,0,0.65)",
  },
  backBtn: {
    width: 40,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 16,
    height: 16,
    tintColor: "rgba(0,0,0,0.80)",
    resizeMode: "contain",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "Lato-SemiBold",
    fontSize: 16,
    color: "rgba(0,0,0,0.85)",
  },
  recentRow: {
    gap: 18,
    paddingRight: 4,
  },
  recentItem: {
    alignItems: "center",
    width: 70,
    gap: 8,
  },
  recentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  recentAvatarImg: {
    width: "100%",
    height: "100%",
  },
  recentLabel: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "rgba(0,0,0,0.75)",
    maxWidth: 70,
    textAlign: "center",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
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

