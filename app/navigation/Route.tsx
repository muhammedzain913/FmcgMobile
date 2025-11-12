import React, { useEffect } from "react";
import StackNavigator from "./StackNavigator";
import { ThemeContextProvider } from "../constants/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Route = () => {
  return (
    <SafeAreaProvider>
      <ThemeContextProvider>
        <StackNavigator />
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
};

export default Route;
