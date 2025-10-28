import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { View, Text,ScrollView } from 'react-native'
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import CreditCard from '../../components/Card/CreditCard';
import Input from '../../components/Input/Input';
import { COLORS, FONTS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type AddcardScreenProps = StackScreenProps<RootStackParamList, 'Addcard'>;

const Addcard = ({navigation} : AddcardScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [inputValue, setInputValue] = useState("");

    const handleChange = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue(numericValue); 
    };

    const [inputValue1, setInputValue1] = useState("");

    const handleChange1 = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue1(numericValue); 
    };

    const [inputValue2, setInputValue2] = useState("");

    const handleChange2 = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue2(numericValue); 
    };


    return (
       <View style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title='Add Card'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{flexGrow:1}}>
            <View style={GlobalStyleSheet.container}>
                    <CreditCard
                        creditCard
                    />
                    <View style={{ marginBottom: 15, marginTop: 20 }}>
                        <Text style={{ ...FONTS.fontRegular, fontSize: 15, color:colors.title, marginBottom: 5 }}>Card Name</Text>
                        <Input
                            onChangeText={(value) => console.log(value)}
                            backround
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title, marginBottom: 5 }}>Card Number</Text>
                        <Input
                            value={inputValue}
                            onChangeText={(value) => handleChange(value)}
                            keyboardType={'number-pad'}
                            backround
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingRight: 20 }}>
                        <View style={{ marginBottom: 15, width: '50%' }}>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title, marginBottom: 5 }}>Expiry Date</Text>
                            <Input
                                value={inputValue1}
                                onChangeText={(value) => handleChange1(value)}
                                keyboardType={'number-pad'}
                                backround
                            />
                        </View>
                        <View style={{ marginBottom: 15, width: '50%' }}>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title, marginBottom: 5 }}>CVV</Text>
                            <Input
                                 value={inputValue2}
                                 onChangeText={(value) => handleChange2(value)}
                                 keyboardType={'number-pad'}
                                backround
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingBottom:0}]}>
                <View style={{height:88,width:'100%',borderTopWidth:1,borderTopColor:colors.border,justifyContent:'center',paddingHorizontal:15}}>
                    <Button
                        title='Save Address'
                        color={theme.dark ? COLORS.white :COLORS.primary}
                        text={theme.dark ? COLORS.primary :COLORS.white}
                        onPress={() => navigation.navigate('Payment')}
                    />
                </View>
            </View>
       </View>
    )
}

export default Addcard