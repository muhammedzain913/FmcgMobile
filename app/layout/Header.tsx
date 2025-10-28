import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/theme';
import  Ionicons  from '@expo/vector-icons/Ionicons';
import { GlobalStyleSheet } from '../constants/StyleSheet';
//import { RootStackParamList } from '../navigation/RootStackParamList';
//import { StackScreenProps } from '@react-navigation/stack';
import { IMAGES } from '../constants/Images';

type Props = {
    title : string,
    leftIcon ?: string,
    leftAction ?: any,
    transparent?:any,
    productId?:any,
    titleLeft?:any,
    titleLeft2?:any,
    titleRight?:any,
    rightIcon1?:any,
    rightIcon2?:any,
    onPress ?: (e : any) => void,
}


const Header = ({title, leftIcon, leftAction,transparent,productId,titleLeft,titleLeft2,titleRight,rightIcon1,rightIcon2,onPress} : Props) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const navigation = useNavigation<any>();

    return (
        <View
            style={[{
                height: 60,
                backgroundColor:colors.card,
                alignItems:'center',
                justifyContent:'center'
            },transparent && {
                position: 'absolute',
                left: 0,
                right: 0,
                borderBottomWidth: 0,
            },Platform.OS === 'ios' && {
                backgroundColor:colors.card
            }]}
        >
             <View style={[GlobalStyleSheet.container, {
                    flexDirection: 'row',
                    alignItems: 'center',
                    //paddingLeft: 0,
                    justifyContent: 'space-between',
                    //paddingTop:10
                }]}
                >
                    {leftIcon === 'back' && 
                        <TouchableOpacity 
                        onPress={() => leftAction ? leftAction() : navigation.goBack()}
                        style={[styles.actionBtn,{backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)':colors.background}]}
                        >
                            <Ionicons size={20} color={colors.title} name='chevron-back'/>
                        </TouchableOpacity>
                    }
                    <View style={{ flex: 1}}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title, textAlign: titleLeft ? 'left' : 'center',paddingLeft:titleLeft2 ? 10 :0,paddingRight:titleRight ? 20 : 0}}>{title}</Text>
                        {productId &&
                            <Text style={{ ...FONTS.fontSm, color: colors.text, textAlign: 'center', marginTop: 2 }}>{productId}</Text>
                        }
                    </View>
                    {rightIcon1 == "search" &&
                        
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Search')}
                                style={[styles.actionBtn,{backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)' : colors.background}]}
                            >
                                <Ionicons size={18} color={colors.title} name='search'/>
                            </TouchableOpacity>
                       
                    }
                    {rightIcon2 == "cart" &&
                       
                            <TouchableOpacity 
                                onPress={onPress}
                                style={[styles.actionBtn,{backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)' : colors.background}]}
                            >
                                <Image
                                    style={{height:18,width:18,tintColor:colors.title}}
                                    source={IMAGES.mycart}
                                />
                            </TouchableOpacity>
                    }
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header : {
        height:60,
        backgroundColor:COLORS.card,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    title : {
        fontSize:20,
        ...FONTS.fontMedium,
    },
    actionBtn : {
        height: 35,
        width: 35,
        borderRadius:8,
        alignItems:'center',
        justifyContent : 'center',
        // position:'absolute',
        // left:10,
        // top:10,
        backgroundColor:COLORS.background
    }
})

export default Header;