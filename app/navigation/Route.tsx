import React, { useEffect } from "react";
import StackNavigator from "./StackNavigator";
import { ThemeContextProvider } from "../constants/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import { StatusBar } from "expo-status-bar";



const Route = () => {
  const token = useSelector((x: any) => x.user?.userInfo?.accessToken);

  useEffect(() => {
    console.log('token',token)
  },[token])
  return (
    <SafeAreaProvider>
      <ThemeContextProvider>
        <StatusBar style="auto" translucent={true} animated={true} hideTransitionAnimation="fade"/>
        {token ? <StackNavigator /> : <AuthNavigator />}
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
};

export default Route;
