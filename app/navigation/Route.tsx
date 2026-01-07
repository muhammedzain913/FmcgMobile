import React, { useEffect } from "react";
import StackNavigator from "./StackNavigator";
import { ThemeContextProvider } from "../constants/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";



const Route = () => {
  const token = useSelector((x: any) => x.user?.userInfo?.accessToken);

  useEffect(() => {
    console.log('token',token)
  },[token])
  return (
    <SafeAreaProvider>
      <ThemeContextProvider>
        {token ? <StackNavigator /> : <AuthNavigator />}
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
};

export default Route;
