import React, { useRef, useState } from 'react';
import { Text, View,Image,  ScrollView,Animated, Platform, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IMAGES } from '../../constants/Images';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { COLORS,FONTS, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Button from '../../components/Button/Button';


const DATA = [
    {
        title: "YOUR FEET WILL NEVER LOOK THE",
        desc: 'SAME AGAIN',
    },
    {
        title: "YOUR FEET WILL NEVER LOOK THE",
        desc: 'SAME AGAIN',
    },
    {
        title: "YOUR FEET WILL NEVER LOOK THE",
        desc: 'SAME AGAIN',
    },
]


type OnBoardingScreenProps = StackScreenProps<RootStackParamList, 'OnBoarding'>;

const OnBoarding = ({navigation} : OnBoardingScreenProps) => {  

    const theme = useTheme();
    const {colors}:{colors : any} = theme;
    
	const scrollRef = useRef<any>();

    const [sliderIndex , setSliderIndex] = useState<any>(1);

    const onScroll = (val:any) => {
        setSliderIndex((Math.round(val.nativeEvent.contentOffset.x / SIZES.width)) + 1);
    }

    return (
		<View style={{ flex: 1, backgroundColor:colors.card }}>
			 <ScrollView contentContainerStyle={{ flexGrow:1}}>
				<View style={{  }}>
					<Image
						style={{height:undefined,width:'100%',aspectRatio:1/1.4}}
						source={IMAGES.onborder1}
					/>
					<View style={{
							position:'absolute',
							transform: [{rotate: '-90deg'}],
							top:100,
							left:-100,
							zIndex:-1
						}}
					>
						<Text style={[FONTS.fontJostExtraLight,{fontSize:120,color:colors.background}]}>SPORTS</Text>
						<Text style={[FONTS.fontMedium,{fontSize:120,color:colors.background,lineHeight:45}]}>SHOES</Text>
					</View>
				</View>
				<View style={{marginTop:10,flex:1}}>
                    {/* <View style={[styles.indicatorConatiner,Platform.OS === "ios" && { 
                        bottom:10
                    }]} pointerEvents="none">
                        {DATA.map((x, i) => (
                            <Indicator i={i} key={i} scrollValue={scrollX} />
                        ))}
                    </View> */}
                    <ScrollView
                        // contentContainerStyle={{ marginTop: 20 }}
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        scrollEventThrottle={16}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}    
                    >
                        {DATA.map((data:any, index) => (

                            <View style={[styles.slideItem,Platform.OS === "ios" && {
                                // paddingBottom:35
                            }]} key={index}>
                                <View style={{paddingHorizontal:30 }}>
                                    <Text style={[FONTS.fontJostLight,{fontSize:35,color:colors.title}]}>{data.title}</Text>
                                    <Text style={[FONTS.fontBold,{fontSize:35,color:colors.title}]}>{data.desc}</Text>
                                </View>
                            </View>

                            ))
                        }
                    </ScrollView>
                </View>
				<View style={[GlobalStyleSheet.container,{paddingHorizontal:25,paddingBottom:20,backgroundColor:colors.card}]}>
					<View style={[GlobalStyleSheet.row,{alignItems:'center'}]}>
						<View style={GlobalStyleSheet.col50}>
							<Button
								title='Get Stard'
								color={theme.dark ? COLORS.white :COLORS.primary}
                                text={theme.dark ? COLORS.primary : COLORS.white }
								onPress={() => navigation.navigate('Login')}
							/>
						</View>
						<View style={GlobalStyleSheet.col50}>
							<Text style={[FONTS.fontRegular,{fontSize:20,color:colors.title,textAlign:'right'}]}>{sliderIndex}/{DATA.length}</Text>
						</View>
					</View>
				</View>
			 </ScrollView>
		</View>
	)
}



const styles = StyleSheet.create({


    slideItem: {
        width: SIZES.width,
        paddingBottom: 10,    
    },
    slideItem2: {
        width: SIZES.width,
        alignItems:'center',
        justifyContent: 'center',
        // padding: 20,
        paddingBottom: 0,
        paddingTop:20,
    },

    indicatorConatiner: {
        alignSelf: 'flex-end',
        position: 'absolute',
        flexDirection: 'row',
        paddingRight:30,
        top:-30
    },
    indicator: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        overflow: 'hidden',
    },
    activeIndicator: {
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },

})

export default OnBoarding;