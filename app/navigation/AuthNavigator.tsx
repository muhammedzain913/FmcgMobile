import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { SafeAreaView } from 'react-native-safe-area-context';

import OnBoarding from '../screens/OnBoarding/OnBoarding';
import { useTheme } from '@react-navigation/native';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import Forgotpassword from '../screens/Auth/Forgotpassword';
import Demo from '../screens/Home/Demo';
import { useSelector } from 'react-redux';
//import BottomNavigation from './BottomNavigation';

const StackComponent = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => {

    const theme = useTheme();

    const [initialRoue,setInitialRoute] = useState<any>('')
    const token = useSelector((x : any ) => x.user?.userInfo?.accessToken)
    const [isSignedIn,setIsSignedIn] = useState(token ? true : false)

    

    return (
        <SafeAreaView style={{width : '100%',flex:1}}>
            {/* <StatusBar style="auto" /> */}
            <StackComponent.Navigator
                initialRouteName= {"Login"} 
                screenOptions={{
                    headerShown:false,
                    cardStyle: { backgroundColor: "transparent",flex:1  },
                    // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
            >
                <StackComponent.Screen name="Demo" component={Demo} />
                <StackComponent.Screen name="OnBoarding" component={OnBoarding} />
                <StackComponent.Screen name="Login" component={Login} />
                <StackComponent.Screen name="Register" component={Register} />
                <StackComponent.Screen name="ForgotPassword" component={Forgotpassword} />
                
            </StackComponent.Navigator>
        </SafeAreaView>
    )
}

export default AuthNavigator;