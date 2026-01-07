import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DropdownMenu from "../../components/DropDown/DropDownMenu";
import MenuOption from "../../components/DropDown/MenuOption";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, saveUserLocation } from "../../redux/reducer/userReducer";
import { AppDispatch } from "../../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { LocationRequest } from "../../types/requests/locationRequest";
type ConfirmLocationScreenProps = StackScreenProps<
  RootStackParamList,
  "ConfirmLocation"
>;

const ConfirmLocation = ({ navigation, route }: ConfirmLocationScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const blocks = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ];
  1;
  const [visible, setVisible] = useState<boolean>(false);
  const { locationData } = route.params;
  const [block, setBlock] = useState<number>(0);
  const [locationRequest,setLocationRequest] = useState<LocationRequest>(locationData);

  useEffect(() => {
    console.log("obj from coonfirm", locationData);
    console.log("block from coonfirm", block);
  });

  const navigateToNextScreen = async () => {
    const updatedLocation = {
      ...locationRequest,
      block
    };

    console.log('block added',updatedLocation)


    try {
      const response = await dispatch(saveUserLocation(updatedLocation));
      const result = unwrapResult(response);
      console.log("Location saved successfully:", result);
      navigation.navigate("DrawerNavigation", { screen: "Home" });
    } catch (error) {
        console.log("Error registering user:", error);
        Alert.alert("Registration Error", "Failed to register user. Please try again.");
    }
  };

  useEffect(()=>{
    console.log("updatedLocation", locationData);
  })

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Your Selected Location:
        </Text>
        <Text>City: {locationData.city}</Text>
        <Text>Governorate: {locationData.governorate}</Text>
        <Text>Block: {block ? block : "block not selected"}</Text>
      </View>
      <Text>Please Select In Which Block Are You Living?</Text>
      <DropdownMenu
        visible={visible}
        handleOpen={() => setVisible(true)}
        handleClose={() => setVisible(false)}
        trigger={
          <View style={styles.triggerStyle}>
            <Text style={styles.triggerText}>Blocks</Text>
          </View>
        }
      >
        {blocks.map((block, index) => {
          return (
            <MenuOption
              key={index}
              onSelect={() => {
                setBlock(parseInt(block));
                setVisible(false);
              }}
            >
              <Text>{block}</Text>
            </MenuOption>
          );
        })}
      </DropdownMenu>

      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <TouchableOpacity
          onPress={navigateToNextScreen}
          style={{
            height: 50,
            backgroundColor: "green",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  triggerStyle: {
    height: 40,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp("90%"),
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 16,
  },
});
