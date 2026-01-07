import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FONTS } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import { BaseLocation } from "../../types/location";

const apiPath = ApiClient();

interface SearchDropDownProps {
  onSelect?: (item: BaseLocation) => void; // 👈 callback prop
  placeHolder: string;
}

const SearchDropDown: React.FC<SearchDropDownProps> = ({
  onSelect,
  placeHolder,
}) => {
  const [search, setSearch] = useState<string>("");
  const { colors }: { colors: any } = useTheme();
  const [clicked, setClicked] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();
  const [selectedItem, setSelectedItem] = useState<BaseLocation>({
      governorate: "",
      street: "",
      block: "",
      city: "",
      phone :"",
      building : "",
      country: ""
  });
  const searchRef = useRef<TextInput>(null);
  const onSearch = async () => {
    console.log("else");
    const response = await apiPath.get(
      `${Url}/api/kuwait-locations?q=${search}`
    );
    setData(response.data);
  };

  useEffect(() => {
    if(clicked){
      onSearch()
    }
  },[])
  return (
    <View style={{ flex: 1, marginTop: 15 }}>
      <TouchableOpacity
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => {
          setClicked(!clicked);
        }}
      >
        <View
          style={[styles.iconContainer, { borderRightColor: colors.border }]}
        >
          <Feather name="globe" size={20} color={colors.title} />
        </View>
        <Text
          style={[
            FONTS.font,
            {
              flex: 1,
              color:
                selectedItem.street === "" ? "rgba(0,0,0,0.4)" : colors.title,
              fontSize: 14,
              paddingHorizontal: 15,
            },
          ]}
        >
          {selectedItem.street === "" ? placeHolder : selectedItem.street}
        </Text>
        <View style={styles.arrowContainer}>
          <Feather
            name={clicked ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.title}
          />
        </View>
      </TouchableOpacity>
      {clicked ? (
        <View
          style={[
            styles.dropdownBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TextInput
            placeholder="Search.."
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={search}
            ref={searchRef}
            returnKeyType="search"
            onChangeText={(txt) => {
              setSearch(txt);
            }}
            onSubmitEditing={() => onSearch()}
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.title,
              },
            ]}
          />
          <View
            style={{
              elevation: 5,
              marginTop: 10,
              maxHeight: 180, // ✅ limit height
              alignSelf: "center",
              width: "90%",
              backgroundColor: colors.card,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden", // ✅ trims overflow
            }}
          >
            <FlatList
              nestedScrollEnabled={true}
              data={data}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedItem(item);
                      setClicked(!clicked);
                      onSelect?.(item);
                      onSearch();
                      setSearch("");
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>
                      {item.area} {item.id}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    ...FONTS.font,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 250,
    overflow: "hidden",
  },
  inputContainer: {
    ...FONTS.font,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  arrowContainer: {
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    margin: 10,
    ...FONTS.font,
  },
  dropdownBox: {
    elevation: 5,
    marginTop: 10,
    height: 300,
    alignSelf: "center",
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
  },
  iconContainer: {
    width: 58,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1, // ✅ same vertical line like your Input
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
});

export default SearchDropDown;
