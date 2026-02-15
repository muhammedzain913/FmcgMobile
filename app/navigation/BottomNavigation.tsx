import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './BottomTabParamList';
import WishlistScreen from '../screens/Wishlist/Wishlist';
import MyCartScreen from '../screens/MyCart/MyCart';
import HomeScreen from '../screens/Home/Home';
import CategoryScreen from '../screens/Category/Category';
import ProfileScreen from '../screens/Profile/Profile';
import BottomMenu from '../layout/BottomMenu';
import AllCategories from '../screens/Category/AllCategories';
import MyCart from '../screens/MyCart/MyCart';
import Myorder from '../screens/Myorder/Myorder';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown : false
            }}
            tabBar={(props:any) => <BottomMenu {...props}/>}
        >
            <Tab.Screen 
                name='Home'
                component={HomeScreen}
            />

            <Tab.Screen 
                name='Categories'
                component={AllCategories}
            />
            <Tab.Screen 
                name='My Orders'
                component={Myorder}
            />
            <Tab.Screen 
                name='My Cart'
                component={MyCart}
            />
        </Tab.Navigator>
    )
}

export default BottomNavigation;