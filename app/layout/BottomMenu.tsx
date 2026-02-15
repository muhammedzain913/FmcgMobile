import React, {useEffect, useRef, useState} from 'react';
import { 
    View, 
    Animated,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Dimensions
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { SIZES, FONTS, COLORS } from '../constants/theme';
import { IMAGES } from '../constants/Images';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type Props = {
    state : any,
    navigation : any,
    descriptors : any
}

const BottomMenu = ({state, navigation, descriptors}: Props) => {

    const theme = useTheme();
    const {colors} : {colors : any} = theme;
    
    const [tabWidth, setWidth] = useState(wp('100%'));

    const tabWD =
        tabWidth < SIZES.container ? tabWidth / 4 : SIZES.container / 4;

    const circlePosition = useRef(
        new Animated.Value(0),
    ).current;

    Dimensions.addEventListener('change', val => {
        setWidth(val.window.width);
    });
    
    useEffect(() => {
        Animated.spring(circlePosition, {
            toValue: state.index * tabWD,
            useNativeDriver: true,
        }).start();
    },[state.index,tabWidth])


    const onTabPress = (index:any) => {
        const tabW =
            tabWidth < SIZES.container ? tabWidth / 4 : SIZES.container / 4; // Adjust this according to your tab width

        Animated.spring(circlePosition, {
            toValue: index * tabW,
            useNativeDriver: true,
        }).start();
    };




    return (
        <View style={{
            backgroundColor:theme.dark ? colors.background : colors.card,
            
        }}>
            
                <View
                    style={[styles.tabBar,
                    {
                        borderTopColor:colors.border,
                    }]}
                >
                    <View
                        style={[GlobalStyleSheet.container,{
                            flexDirection: 'row',
                            paddingHorizontal: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                        }]}
                    >

                     

                        {state.routes.map((route:any , index:string) => {

                            const {options} = descriptors[route.key];
                            const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                ? options.title
                                : route.name;

                            const isFocused = state.index === index;

                            const iconTranslateY = useRef(new Animated.Value(0)).current;
                            Animated.timing(iconTranslateY, {
                                toValue: isFocused ? -20 : 0,
                                duration: 200,
                                useNativeDriver: true,
                            }).start();

                            const onPress = () => {
                                const event = navigation.emit({
                                  type: 'tabPress',
                                  target: route.key,
                                  canPreventDefault: true,
                                });
                
                                if (!isFocused && !event.defaultPrevented) {
                                  navigation.navigate({name: route.name, merge: true});
                                  onTabPress(index);
                                }
                            };

                            return(
                                <View
                                    key={index}
                                    style={styles.tabItem}
                                >   
                                    <TouchableOpacity
                                        onPress={onPress}
                                        style={styles.tabLink}
                                    >
                                        {/* <Animated.View
                                            style={{
                                                transform: [{translateY: iconTranslateY}],
                                        }}> */}
                                            <Image 
                                                style={{
                                                    height:24,
                                                    width:24,
                                                    marginBottom:10,
                                                    resizeMode:'contain',
                                                    // tintColor: isFocused ? COLORS.title : theme.dark ? colors.title : colors.text,
                                                    // tintColor:colors.title
                                                }}
                                                source={
                                                    label === 'Home'    ?  IMAGES.Home:
                                                    label === 'My Cart'     ?  IMAGES.mycart:
                                                    label === 'Categories'   ?  IMAGES.Category:
                                                    label === 'My Orders'  ?  IMAGES.myorders : IMAGES.Home
                                                }
                                            />
                                        {/* </Animated.View> */}
                                        {/* <Text style={[styles.navText,{color:isFocused ? colors.title : colors.text}]}>{label}</Text> */}
                                    </TouchableOpacity>
                                    <Text style={{fontFamily : 'Lato-Medium' ,color : isFocused ? '#000' : '#8C8C8C',fontSize : 12}}>{label}</Text>
                           
                                </View>
                            )
                        })}
                    </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar : {
        height : 80,
        borderTopWidth:1,
        justifyContent : 'center'
        
    },
    tabItem : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    tabLink : {
        alignItems: 'center',
    },
    navText : {
        ...FONTS.fontXs,
        ...FONTS.fontMedium,
    }
});
 
export default BottomMenu;