import { useTheme } from '@react-navigation/native';
import React from 'react'
import { View, Text ,ScrollView,Image, TouchableOpacity} from 'react-native'
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import CreditCard from '../../components/Card/CreditCard';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import PaymentAccordion from '../../components/Accordion/PaymentAccordion';
import Button from '../../components/Button/Button';

type PaymentScreenProps = StackScreenProps<RootStackParamList, 'Payment'>;

const Payment = ({navigation} : PaymentScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;
    return (
        <View style={{backgroundColor:colors.card,flex:1,}}>
            <Header
                title='Checkout'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{flexGrow:1}}>
            <View style={[GlobalStyleSheet.container, { flex: 1 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>Credit/Debit Card</Text>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5
                            }}
                            onPress={() => navigation.navigate('Addcard')}
                        >
                            <Image
                                style={{ height: 14, width: 14, resizeMode: 'contain' }}
                                source={IMAGES.plus}
                            />
                            <Text style={{ ...FONTS.fontMedium, fontSize: 13, color:colors.title }}>Add Card</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20, marginHorizontal: -15 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 20, paddingLeft: 15, paddingRight: 15 }}
                        >
                            <CreditCard
                                creditcard
                            />
                            <CreditCard
                               debitcard
                            />
                        </ScrollView>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <PaymentAccordion
                            component
                            Payment
                            netbanking
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingBottom:0}]}>
                <View style={{height:88,width:'100%',borderTopWidth:1,borderTopColor:colors.border,justifyContent:'center',paddingHorizontal:15}}>
                    <Button
                        title='Continue'
                        color={theme.dark ? COLORS.white :COLORS.primary}
                        text={theme.dark ? COLORS.primary :COLORS.white}
                        onPress={() => navigation.navigate('Checkout')}
                    />
                </View>
            </View>
        </View>
    )
}

export default Payment