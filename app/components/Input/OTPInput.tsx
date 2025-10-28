import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet,TouchableOpacity, TextInput } from 'react-native'
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";


type props = {
    code : any,
    setCode :any ,
    maximumLength : any,
    setIsPinReady:any,
}

const OTPInput = ({code, setCode,maximumLength,setIsPinReady} : props) => {
    

    const boxArray = new Array(maximumLength).fill(0);

    const inputRef = useRef<any>();

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    const boxDigit = (_:any, index:any) => {
        const emptyInput = "";
        const digit = code[index] || emptyInput;

        return (
            <View  key={index} style={styles.SplitBoxes}>
                <Text style={[FONTS.fontJostLight,styles.SplitBoxText,{color:colors.title}]}>{digit}</Text>
            </View>
        );
    };


    const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

    const handleOnPress = () => {
        setIsInputBoxFocused(true);
        inputRef.current.focus();
      };
     
      const handleOnBlur = () => {
        setIsInputBoxFocused(false);
      };

     

  return (
    <View style={styles.OTPInputContainer}>
        <TouchableOpacity style={styles.SplitOTPBoxesContainer} onPress={handleOnPress}>
            {boxArray.map(boxDigit)}
        </TouchableOpacity>
        <TextInput 
            style={styles.TextInputHidden}
            value={code}
            onChangeText={setCode}
            maxLength={maximumLength}
            ref={inputRef}
            onBlur={handleOnBlur}
        />
    </View>
  )
}


const styles = StyleSheet.create({
    OTPInputContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    TextInputHidden: {
        // width:300,
        // borderWidth:1,
        // borderColor:'#e5e5e5',
        // borderRadius:5,
        // padding:15,
        position:'absolute',
        opacity:0
    },
    SplitOTPBoxesContainer :{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-evenly',
        //padding:20,
        paddingTop:20,
        gap:10,
        //height:20
    },
    SplitBoxes :{
        borderColor:'#CCCCCC',
        borderWidth:1,
        borderRadius:8,
        //padding:15,
        minWidth:45,
        height:60,
        alignItems:'center',
        justifyContent:'center'
    },
    SplitBoxText :{
        fontSize:28,
        textAlign:'center',
        color:'#000'
    },
    SplitBoxesFocused:{
        borderColor:'#ecdbba',
        backgroundColor: 'grey'
    }
});
export default OTPInput