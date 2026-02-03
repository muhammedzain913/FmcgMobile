import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomNavigation from "./BottomNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import DrawerMenu from "../layout/DrawerMenu";
import { useDispatch } from "react-redux";
import { test } from "../redux/reducer/userReducer";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const { colors }: { colors: any } = useTheme();
  const dispatch = useDispatch();



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={[]}>
      <Drawer.Navigator
        initialRouteName="BottomNavigation"
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={(props) => {
          return <DrawerMenu navigation={props.navigation} />;
        }}
      >
        <Drawer.Screen name="BottomNavigation" component={BottomNavigation} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default DrawerNavigation;
