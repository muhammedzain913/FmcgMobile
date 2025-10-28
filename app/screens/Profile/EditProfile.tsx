import React, { useState } from 'react'
import { View, Text,  ScrollView, Image, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import Input from '../../components/Input/Input';
import { Feather } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { COLORS } from '../../constants/theme';

const EditProfile = ({navigation} : any) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [inputValue, setInputValue] = useState("");

    const handleChange = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue(numericValue); 
    };

    return (
       <View style={{backgroundColor:colors.card,flex:1}}>
           <Header
                title='Edit Profile'
                leftIcon='back'
                titleRight
           />
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={[GlobalStyleSheet.container, { flex: 1 }]}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <View style={{ borderWidth: 2, borderColor: colors.title, height: 150, width: 150, borderRadius: 150, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ height: 140, width: 140, borderRadius: 100 }}
                                source={IMAGES.small1}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={{ height: 45, width: 45, borderRadius: 45, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, right: 115 }}>
                            <View style={{ height: 40, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.title }}>
                                <Image
                                    style={{ height: 18, width: 18, resizeMode: 'contain', tintColor: colors.card }}
                                    source={IMAGES.write}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:30}}>
                        <Input
                            backround
                            inputLg
                            //value={''}  
                            placeholder="Name"
                            onChangeText={(value)=> console.log(value)}
                            icon={<Feather style={{}} name={'user'} size={20} color={colors.title}/> }
                        />
                    </View>
                    <View style={{marginTop:15}}>
                        <Input
                            backround
                            inputLg
                            //value={''}  
                            placeholder="Email Address"
                            onChangeText={(value)=> console.log(value)}
                            icon={<Feather style={{}} name={'mail'} size={20} color={colors.title}/> }
                        />
                    </View>
                    <View style={{marginTop:15}}>
                        <Input
                            backround
                            inputLg
                            value={inputValue}  
                            placeholder="Mobile Number"
                            onChangeText={(value)=> handleChange(value)}
                            keyboardType={'number-pad'}
                            icon={<Feather style={{}} name={'phone-call'} size={20} color={colors.title}/> }
                        />
                    </View>
                    <View style={{marginTop:15}}>
                        <Input
                            backround
                            inputLg
                            //value={''}  
                            placeholder="Location"
                            onChangeText={(value)=> console.log(value)}
                            icon={<Feather style={{}} name={'map-pin'} size={20} color={colors.title}/> }
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingBottom:0}]}>
                <View style={{height:88,width:'100%',borderTopWidth:1,borderTopColor:colors.border,justifyContent:'center',paddingHorizontal:15}}>
                    <Button
                        title='Update Profile'
                        color={theme.dark ? COLORS.white :COLORS.primary}
                        text={theme.dark ? COLORS.primary : COLORS.white}
                        onPress={() => navigation.navigate('Profile')}
                    />
                </View>
            </View> 
       </View>
    )
}

export default EditProfile