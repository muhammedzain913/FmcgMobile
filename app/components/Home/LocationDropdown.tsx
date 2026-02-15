import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import DropdownMenu from "../DropDown/DropDownMenu";
import MenuOption from "../DropDown/MenuOption";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface LocationDropdownProps {
  label: string;
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedValue: string | null;
  placeholder: string;
  options: any[];
  onSelect: (item: any) => void;
  scrollable?: boolean;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  label,
  visible,
  onOpen,
  onClose,
  selectedValue,
  placeholder,
  options,
  onSelect,
  scrollable = false,
}) => {
  const content = options.map((item, index) => (
    <MenuOption key={index} onSelect={() => onSelect(item)}>
      <Text>{item?.name}</Text>
    </MenuOption>
  ));

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <DropdownMenu
        visible={visible}
        handleOpen={onOpen}
        handleClose={onClose}
        trigger={
          <View style={styles.triggerStyle}>
            <Text style={styles.triggerText}>
              {selectedValue || placeholder}
            </Text>
            <Image
              source={require("../../assets/images/icons/dropicon.png")}
            />
          </View>
        }
      >
        {scrollable ? (
          <ScrollView
            style={{ maxHeight: hp("40%") }}
            nestedScrollEnabled={true}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </DropdownMenu>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    marginBottom: 8,
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
});

export default LocationDropdown;
