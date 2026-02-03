import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import DropdownMenu from "../../components/DropDown/DropDownMenu";
import { citiesAndBlocks } from "../../data";
import MenuOption from "../../components/DropDown/MenuOption";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Block, City } from "../../types/area";
import { AppDispatch } from "../../redux/store";
import { saveUserLocation } from "../../redux/reducer/userReducer";
import { unwrapResult } from "@reduxjs/toolkit";
import { ApiClient } from "../../redux/api";
import { Url } from "../../redux/userConstant";
import Button from "../../components/Button/Button";
import { COLORS } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../constants/typography";
import { useLocationSelector } from "../../hooks/useLocationSelector";
import { useSaveUserLocation } from "../../hooks/useSaveUserLocation";
type UserLocationScreenProps = StackScreenProps<
  RootStackParamList,
  "UserLocation"
>;

const apiPath = ApiClient();

const UserLocation = ({ navigation }: UserLocationScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((x: any) => x?.user?.userInfo.id);
  const { saveLocation } = useSaveUserLocation();

  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const {
    governorates,
    cities,
    blocks,

    governorate,
    city,
    block,

    setGovernorate,
    setCity,
    setBlock,

    govVisible,
    cityVisible,
    blockVisible,

    setGovVisible,
    setCityVisible,
    setBlockVisible,
  } = useLocationSelector();

  const onContinue = () => {
    setLoading(true);
    try {
      saveLocation({
        payload: {
          userId,
          country: "Kuwait",
          governorate: governorate.id,
          city: city.id,
          block: block.id,
        },
        onSuccess: () => {
          console.log("SUCCESS SUCCESS");
          navigation.navigate("UserDeliveryAddress");
        },
        onError: () => {
          Alert.alert("Error", "Failed to save location");
        },
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 20,
        flexDirection: "column",
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          // paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            borderWidth: 0.2,
            width: 38,
            height: 38,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            borderColor: "grey",
          }}
        >
          <Image source={require("../../assets/images/icons/CaretLeft.png")} />
        </View>
        <Text
          style={[
            Typography.headerText,
            {
             
              color: "#000000",
              textAlign: "center",
            },
          ]}
        >
          Select Your Location
        </Text>
        <View></View>
      </View>

      <View style={{ gap: 10, marginTop: 50 }}>
        <View style={{ gap: 5 }}>
          <Text style={[Typography.titleMedium]}>CHOOSE GOVERNORATE *</Text>
          <DropdownMenu
            visible={govVisible}
            handleOpen={() => setGovVisible(true)}
            handleClose={() => setGovVisible(false)}
            trigger={
              <View style={styles.triggerStyle}>
                <Text style={styles.triggerText}>
                  {governorate ? governorate.name : "Select Governerate"}
                </Text>
                <Image
                  source={require("../../assets/images/icons/dropicon.png")}
                />
              </View>
            }
          >
            {governorates.map((block: any, index) => {
              return (
                <MenuOption
                  key={index}
                  onSelect={() => {
                    setGovernorate(block);
                    setCity(null);
                    setBlock(null);
                    setGovVisible(false);
                  }}
                >
                  <Text>{block.name}</Text>
                </MenuOption>
              );
            })}
          </DropdownMenu>
        </View>

        {cities && cities.length > 0 && (
          <View style={{ gap: 5 }}>
            <Text style={[Typography.titleMedium]}>CHOOSE CITY *</Text>
            <DropdownMenu
              visible={cityVisible}
              handleOpen={() => setCityVisible(true)}
              handleClose={() => setCityVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {city ? city.name : "Select City"}
                  </Text>
                  <Image
                    source={require("../../assets/images/icons/dropicon.png")}
                  />
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {cities.map((city, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setCity(city);
                        setBlock(null);
                        setCityVisible(false);
                      }}
                    >
                      <Text>{city.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>
          </View>
        )}

        {blocks && blocks.length > 0 && (
          <View style={{ gap: 5 }}>
            <Text style={[Typography.titleMedium]}>CHOOSE BLOCK *</Text>
            <DropdownMenu
              visible={blockVisible}
              handleOpen={() => setBlockVisible(true)}
              handleClose={() => setBlockVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>
                    {block ? block.name : "Select Block"}
                  </Text>
                  <Image
                    source={require("../../assets/images/icons/dropicon.png")}
                  />
                </View>
              }
            >
              <ScrollView
                style={{ maxHeight: hp("40%") }}
                nestedScrollEnabled={true}
              >
                {blocks.map((block, index) => {
                  return (
                    <MenuOption
                      key={index}
                      onSelect={() => {
                        setBlock(block);
                        setBlockVisible(false);
                      }}
                    >
                      <Text>{block.name}</Text>
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </DropdownMenu>
          </View>
        )}
      </View>

      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Button
            variant="dark"
            title="Save"
            color={"#1E123D"}
            text={theme.dark ? COLORS.primary : COLORS.white}
            onPress={onContinue}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserLocation;
const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 999, // IMPORTANT FOR ANDROID + iOS
    elevation: 10, // ANDROID ONLY
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
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
    fontFamily : 'Lato-Regular',
    fontSize: 16,
  },
});
