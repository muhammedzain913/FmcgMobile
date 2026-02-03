import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./RootStackParamList";
import { SafeAreaView } from "react-native-safe-area-context";

import OnBoarding from "../screens/OnBoarding/OnBoarding";
import { useTheme } from "@react-navigation/native";
import Components from "../screens/Components/Components";
import AccordionScreen from "../screens/Components/Accordion";
import BottomSheet from "../screens/Components/BottomSheet";
import ModalBox from "../screens/Components/ModalBox";
import Buttons from "../screens/Components/Buttons";
import Badges from "../screens/Components/Badges";
import Charts from "../screens/Components/Charts";
import Headers from "../screens/Components/Headers";
import Footers from "../screens/Components/Footers";
import TabStyle1 from "../components/Footers/FooterStyle1";
import TabStyle2 from "../components/Footers/FooterStyle2";
import TabStyle3 from "../components/Footers/FooterStyle3";
import TabStyle4 from "../components/Footers/FooterStyle4";
import Inputs from "../screens/Components/Inputs";
import ListScreen from "../screens/Components/lists";
import Pricings from "../screens/Components/Pricings";
import DividerElements from "../screens/Components/DividerElements";
import Snackbars from "../screens/Components/Snackbars";
import Socials from "../screens/Components/Socials";
import SwipeableScreen from "../screens/Components/Swipeable";
import Tabs from "../screens/Components/Tabs";
import Tables from "../screens/Components/Tables";
import Toggles from "../screens/Components/Toggles";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import Forgotpassword from "../screens/Auth/Forgotpassword";
import OTPAuthentication from "../screens/Auth/OTPAuthentication";
import ResetPassword from "../screens/Auth/ResetPassword";
import DrawerNavigation from "./DrawerNavigation";
import Search from "../screens/Search/Search";
import Notification from "../screens/Notification/Notification";
import Products from "../screens/Category/Products";
import ProductsDetails from "../screens/Category/ProductsDetails";
import DeleveryAddress from "../screens/Payment/DeleveryAddress";
import AddDeleveryAddress from "../screens/Payment/AddDeleveryAddress";
import Payment from "../screens/Payment/Payment";
import Addcard from "../screens/Payment/Addcard";
import Checkout from "../screens/Payment/Checkout";
import Myorder from "../screens/Myorder/Myorder";
import Trackorder from "../screens/Myorder/Trackorder";
import Writereview from "../screens/Myorder/Writereview";
import EditProfile from "../screens/Profile/EditProfile";
import Language from "../screens/Language/Language";
import Questions from "../screens/Profile/Questions";
import Coupons from "../screens/Profile/Coupons";
import Demo from "../screens/Home/Demo";
import Chat from "../screens/Chat/Chat";
import Singlechat from "../screens/Chat/Singlechat";
import Call from "../screens/Chat/Call";
import Datepicker from "../screens/Components/Datepicker";
import Search2 from "../screens/Components/Search2";
import { useSelector } from "react-redux";
import MyCart from "../screens/MyCart/MyCart";
import UserLocation from "../screens/Location/UserLocation";
import ConfirmLocation from "../screens/Location/ConfirmLocation";
import DeliveryLocation from "../screens/Location/DeliveryLocation";
import { LogLevel, OneSignal } from "react-native-onesignal";
import UserDeliveryAddress from "../screens/Location/UserDeliveryAddress";
import Categories from "../screens/Category/Categories";
import ProductCard from "../screens/Product/ProductCard";
import AllCategories from "../screens/Category/AllCategories";
import Brands from "../screens/Brand/Brands";
import OrderSuccess from "../screens/Myorder/OrderSuccess";
import ShopByBrand from "../screens/Brand/ShopByBrand";
//import BottomNavigation from './BottomNavigation';

const StackComponent = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const authState = useSelector((state: any) => state.user);
  const defaultAddress = useSelector((x: any) => x.user?.defaultAddress);

  // Determine initial route based on whether user has saved location
  const isDeliveryAddressExist =
    defaultAddress?.street !== null && defaultAddress?.building !== null;

  const initialRouteName =
    defaultAddress && isDeliveryAddressExist
      ? "DrawerNavigation"
      : "UserLocation";

  useEffect(() => {
    console.log("true or not", isDeliveryAddressExist);
    try {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      OneSignal.initialize("9a5c6e06-280d-4a50-8b1c-8c95d71f2c45");
      OneSignal.Notifications.requestPermission(true);
      console.log("OneSignal initialized");
    } catch (error) {
      console.log("Error initializing OneSignal:", error);
    }
  }, [authState]); // Ensure this only runs once on app mount

  useEffect(() => {
    const handleUserLogin = async () => {
      console.log("Handling user login for OneSignal", authState.userInfo.id);
      try {
        if (authState?.userInfo?.id) {
          console.log("Logging in user with ID:", authState.userInfo.id);
          await OneSignal.login(authState?.userInfo?.id);
          const externalUserId = await OneSignal.User.getExternalId();
          console.log("externalUserId:", externalUserId);
        }
      } catch (error) {
        console.log("Error logging in user to OneSignal:", error);
      }
    };

    if (authState) {
      console.log("yes id is there");
      handleUserLogin();
    }
  }, [authState.userInfo?.id]);

  useEffect(() => {
    console.log("Initial Route Name:", isDeliveryAddressExist, defaultAddress);
  }, [isDeliveryAddressExist]);

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }} edges={[]}>
      {/* <StatusBar style="auto" /> */}
      <StackComponent.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent", flex: 1 },
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <StackComponent.Screen name="Demo" component={Demo} />
        {/* <StackComponent.Screen name="OnBoarding" component={OnBoarding} />
				<StackComponent.Screen name="Login" component={Login} />
				<StackComponent.Screen name="Register" component={Register} />
				<StackComponent.Screen name="ForgotPassword" component={Forgotpassword} /> */}
        <StackComponent.Screen
          name="DeliveryLocation"
          component={DeliveryLocation}
        />
        <StackComponent.Screen name="UserLocation" component={UserLocation} />
        <StackComponent.Screen
          name="UserDeliveryAddress"
          component={UserDeliveryAddress}
        />

        <StackComponent.Screen
          name="ConfirmLocation"
          component={ConfirmLocation}
        />
        <StackComponent.Screen
          name="ShopByBrand"
          component={ShopByBrand}
        />
        <StackComponent.Screen name="Brands" component={Brands} />

        <StackComponent.Screen name="OrderSuccess" component={OrderSuccess} />
        <StackComponent.Screen name="AllCategories" component={AllCategories} />
        <StackComponent.Screen name="Categories" component={Categories} />

        <StackComponent.Screen name="Product" component={ProductCard} />
        <StackComponent.Screen
          name="OTPAuthentication"
          component={OTPAuthentication}
        />
        <StackComponent.Screen name="ResetPassword" component={ResetPassword} />
        <StackComponent.Screen
          name="DrawerNavigation"
          component={DrawerNavigation}
        />
        <StackComponent.Screen name="Search" component={Search} />
        <StackComponent.Screen name="Notification" component={Notification} />
        <StackComponent.Screen name="MyCart" component={MyCart} />
        <StackComponent.Screen name="Products" component={Products} />
        <StackComponent.Screen
          name="ProductsDetails"
          component={ProductsDetails}
        />
        <StackComponent.Screen
          name="DeleveryAddress"
          component={DeleveryAddress}
        />
        <StackComponent.Screen
          name="AddDeleveryAddress"
          component={AddDeleveryAddress}
        />
        <StackComponent.Screen name="Payment" component={Payment} />
        <StackComponent.Screen name="Addcard" component={Addcard} />
        <StackComponent.Screen name="Checkout" component={Checkout} />
        <StackComponent.Screen name="Myorder" component={Myorder} />
        <StackComponent.Screen name="Trackorder" component={Trackorder} />
        <StackComponent.Screen name="Writereview" component={Writereview} />
        <StackComponent.Screen name="EditProfile" component={EditProfile} />
        <StackComponent.Screen name="Language" component={Language} />
        <StackComponent.Screen name="Questions" component={Questions} />
        <StackComponent.Screen name="Coupons" component={Coupons} />
        <StackComponent.Screen name="Chat" component={Chat} />
        <StackComponent.Screen name="Singlechat" component={Singlechat} />
        <StackComponent.Screen name="Call" component={Call} />
        {/* <StackComponent.Screen name="BottomNavigation" component={BottomNavigation} /> */}

        <StackComponent.Screen name="Components" component={Components} />
        <StackComponent.Screen name="Accordion" component={AccordionScreen} />
        <StackComponent.Screen name="BottomSheet" component={BottomSheet} />
        <StackComponent.Screen name="ModalBox" component={ModalBox} />
        <StackComponent.Screen name="Buttons" component={Buttons} />
        <StackComponent.Screen name="Badges" component={Badges} />
        <StackComponent.Screen name={"Datepicker"} component={Datepicker} />
        <StackComponent.Screen name={"Search2"} component={Search2} />
        <StackComponent.Screen name="Charts" component={Charts} />
        <StackComponent.Screen name="Headers" component={Headers} />
        <StackComponent.Screen name="Footers" component={Footers} />
        <StackComponent.Screen name="TabStyle1" component={TabStyle1} />
        <StackComponent.Screen name="TabStyle2" component={TabStyle2} />
        <StackComponent.Screen name="TabStyle3" component={TabStyle3} />
        <StackComponent.Screen name="TabStyle4" component={TabStyle4} />
        <StackComponent.Screen name="Inputs" component={Inputs} />
        <StackComponent.Screen name="lists" component={ListScreen} />
        <StackComponent.Screen name="Pricings" component={Pricings} />
        <StackComponent.Screen
          name="DividerElements"
          component={DividerElements}
        />
        <StackComponent.Screen name="Snackbars" component={Snackbars} />
        <StackComponent.Screen name="Socials" component={Socials} />
        <StackComponent.Screen name="Swipeable" component={SwipeableScreen} />
        <StackComponent.Screen name="Tabs" component={Tabs} />
        <StackComponent.Screen name="Tables" component={Tables} />
        <StackComponent.Screen name="Toggles" component={Toggles} />
      </StackComponent.Navigator>
    </SafeAreaView>
  );
};

export default StackNavigator;
