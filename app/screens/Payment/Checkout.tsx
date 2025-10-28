import { useTheme } from '@react-navigation/native';
import React from 'react'
import { View, Text ,ScrollView, Image, TouchableOpacity, TextInput} from 'react-native'
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { Ionicons } from '@expo/vector-icons';
import { COLORS,FONTS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';


const checkoutData = [
    {
        image: IMAGES.Location,
        title: "Delivery address",
        text: "123 Main Street, Anytown, USA 12345",
        navigate: "DeleveryAddress"
    },
    {
        image: IMAGES.card2,
        title: "Payment",
        text: "XXXX XXXX XXXX 3456",
        navigate: "Payment"
    },
]

type CheckoutScreenProps = StackScreenProps<RootStackParamList, 'Checkout'>;

const Checkout =  ({navigation} : CheckoutScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
       <View style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title='Checkout'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={[GlobalStyleSheet.container, { paddingTop: 10 }]}>
                    {checkoutData.map((data:any, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate(data.navigate)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border,
                                    paddingBottom: 10,
                                    marginTop: 10
                                }}
                                key={index}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10,flex:1 }}>
                                    <View style={{ height: 40, width: 40, borderRadius: 10, backgroundColor: colors.title, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            style={{ height: 20, width: 20, tintColor:theme.dark ? COLORS.primary : colors.card, resizeMode: 'contain' }}
                                            source={data.image}
                                        />
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>{data.title}</Text>
                                        <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>{data.text}</Text>
                                    </View>
                                </View>
                                <Ionicons color={colors.title} name='chevron-forward' size={20}/>
                            </TouchableOpacity>
                        )
                    })}
                    <View style={{ marginTop: 20, }}>
                        <Text style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title }}>Additional Notes:</Text>
                            <TextInput
                                style={{
                                    ...FONTS.fontRegular,
                                    fontSize: 15,
                                    color: colors.title,
                                    paddingVertical: 12,
                                    paddingHorizontal: 15,
                                    height: 120,
                                    width: '100%',
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    borderRadius: 8,
                                    backgroundColor: colors.card,
                                    marginTop: 10 
                                }}
                                placeholder='Write Here'
                                multiline
                                placeholderTextColor={colors.text}
                            />
                    </View>
                    <View style={{ marginTop: 150 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Bluebell Hand Block Tiered</Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>2 x $2000.00</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Men Black Grey Allover Printed</Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>2 x $1699.00</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color:'#CC0D39' }}>Discount</Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color:'#CC0D39' }}>-$100.00</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Shipping</Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: COLORS.success }}>FREE Delivery</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: theme.dark ? COLORS.white : colors.borderColor }}></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: colors.title }}>My Order</Text>
                            <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: COLORS.success }}>$3,599.00</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingBottom:0}]}>
                <View style={{height:88,width:'100%',borderTopWidth:1,borderTopColor:colors.border,justifyContent:'center',paddingHorizontal:15}}>
                    <Button
                        title='Submit Order'
                        color={theme.dark ? COLORS.white :COLORS.primary}
                        text={theme.dark ? COLORS.primary :COLORS.white}
                        onPress={() => navigation.navigate('Myorder')}
                    />
                </View>
            </View>
       </View>
    )
}

export default Checkout