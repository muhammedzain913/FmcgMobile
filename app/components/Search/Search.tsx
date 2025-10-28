import React from 'react'
import { View, Text, TextInput ,Platform} from 'react-native'
import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

const Search = (props : any) => {

    const theme = useTheme();
    const { colors } : {colors : any } = theme;

    return (
        <View 
            style={[{
                marginBottom:10,
                height: 48,
                paddingVertical:5, 
                width:'100%',
                flex: 1, 
                backgroundColor:theme.dark ? 'rgba(0,0,0,0.20)' : COLORS.input, 
                borderRadius:props.btnRounded ?  35 :  0,
                borderWidth:props.border ? 0 : 1,
                borderBottomWidth:props.border ? 1 : 1,
                borderColor:theme.dark ? 'rgba(255,255,255,0.20)' : COLORS.borderColor,
                // position:'relative'
                justifyContent:'center'
            },Platform.OS === 'web' && {height:58}]}
        >
            {props.icon &&
                <View
                    style={[{
                        top:12,
                        bottom:0,
                        left:10,
                        position:'absolute',
                    },Platform.OS === 'web' && {top:5}]}
                >
                    {props.icon}
                </View>
            }
            <TextInput
                style={{ ...FONTS.fontRegular, fontSize: 16, color: colors.text, paddingLeft:props.icon ? 40 : props.border ? 0 : 20,flex:1 }}
                placeholder={props.placeholder}
                placeholderTextColor={colors.title}
            />
        </View>
    )
}

export default Search