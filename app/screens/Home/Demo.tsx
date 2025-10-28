import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated,{
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,

} from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';
import OTPInput from '../../components/Input/OTPInput';
import { StatusBar } from 'expo-status-bar';

const Demo = () => {

  // const position = useSharedValue(0);

  // const gestureHandler = useAnimatedGestureHandler({
  //   onStart:(_, ctx) =>{
  //     ctx.startX = position.value;
  //   },
  //   onActive:(e ,ctx:any) => {
  //     position.value = ctx.startX + e.translationX;
  //   }
  // }) 

  // const animatedStyle = useAnimatedStyle(() => ({
  //     transform:[{translateX: position.value}],
  // }))


  const [otpCode, setOTPCode] = useState("");
  const [isPinReady, setIsPinReady] = useState(false);
  const maximumCodeLength = 6;

  return (
        <View style={styles.container}>
            {/* <View style={styles.sliderBack}/>
            <View style={styles.sliderFront}/>
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.sliderThumb, animatedStyle]}>
                  <View style={styles.lable}>
                      <Text style={styles.labletext}>$10</Text>
                  </View>
              </Animated.View>
            </PanGestureHandler> */}
            {/* <View style={styles.sliderThumb}>
                <View style={styles.lable}>
                    <Text style={styles.labletext}>$500</Text>
                </View>
            </View> */}
             <OTPInput
                code={otpCode}
                setCode={setOTPCode}
                maximumLength={maximumCodeLength}
                setIsPinReady={setIsPinReady}
             />
            <StatusBar style="auto" />
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:15,
    backgroundColor:COLORS.white
  },
  sliderBack: {
      width:300,
      backgroundColor:'#000',
      height:2,
      borderRadius:10
  },
  sliderFront: {
      width:300,
      backgroundColor:'red',
      height:2,
      borderRadius:10,
      position:'absolute'
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    left:20
  },
  lable: {
    // height:10,
    // width:20,
    backgroundColor:'#159E42',
    position: 'absolute',
    top: -40,
    bottom:40,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
    borderRadius:15,
  },
  labletext: {
    padding:5,
    color:'white',
    fontWeight:'bold',
    width:'100%',
    fontSize:15
  
  },
  values: {
    marginTop: 10,
    fontSize: 16,
  },
});

  
export default Demo;