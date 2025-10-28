import React, { useEffect } from 'react';
import StackNavigator from './StackNavigator';
import { ThemeContextProvider } from '../constants/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const Route = () => {

	const token = useSelector((x : any) => x.user.userInfo.accessToken)
	useEffect(() => {
			console.log('persisted',token)
	})

	return (
		<SafeAreaProvider>
			<ThemeContextProvider>
				<StackNavigator/> 
			</ThemeContextProvider>
		</SafeAreaProvider>
	)
  
}

export default Route;