import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export type Props = {
  onSelect: () => void;
  children: ReactNode;
};

const MenuOption = ({ onSelect, children }: Props) => {
  return (
    <View style={{justifyContent : 'center', alignItems : 'center'}}>
      <TouchableOpacity onPress={onSelect} style={styles.menuOption}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default MenuOption;

const styles = StyleSheet.create({
  menuOption: {
    padding : 15,
    width: wp("90%"),
    height: hp("6%"),
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
});
