import { useTheme } from '@react-navigation/native';
import React from 'react'
import { View, Text,  ScrollView, Image } from 'react-native'
import Header from '../../layout/Header';
import { COLORS,FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch } from 'react-redux';
import { addTowishList } from '../../redux/reducer/wishListReducer';

const TrackorderData = [
    {
        id:"31",
        image:IMAGES.item9,
        title:'Echo Vibe Urban Runners',
        price:"$179",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Track Order'
    },
]

type TrackorderScreenProps = StackScreenProps<RootStackParamList, 'Trackorder'>;

const Trackorder = ({navigation} : TrackorderScreenProps)  => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const dispatch = useDispatch();

    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
    }

    return (
        <View style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title='Track Order'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{flex:1}}>
                <View style={[GlobalStyleSheet.container,{paddingTop:0}]}>
                    <View style={{
                        marginHorizontal: -15
                    }}>
                        {TrackorderData.map((data:any, index) => {
                            return (
                                <View key={index}>
                                    <Cardstyle2
                                        key={index}
                                        title={data.title}
                                        price={data.price}
                                        delevery={data.delevery}
                                        image={data.image}
                                        offer={data.offer}
                                        removelikebtn
                                        onPress1={() => addItemToWishList(data)}
                                        onPress={() => navigation.navigate('ProductsDetails')}
                                    />
                                </View>
                            )
                        })}
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title }}>Track Order</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Image
                            style={{ height: 24, width: 24, resizeMode: 'contain' }}
                            source={IMAGES.check}
                        />
                        <View>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color:'#CC0D39' }}>Order Placed<Text style={{ ...FONTS.fontRegular, fontSize: 14, color: 'rgba(0, 0, 0, 0.50)' }}>  27 Dec 2023</Text></Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>We have received your order</Text>
                        </View>
                        <View style={{ height: 70, width: 2, backgroundColor:'#CC0D39', position: 'absolute', left: 11, top: 33 }}></View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 40 }}>
                        <Image
                            style={{ height: 24, width: 24, resizeMode: 'contain' }}
                            source={IMAGES.check}
                        />
                        <View>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color:'#CC0D39' }}>Order Confirm<Text style={{ ...FONTS.fontRegular, fontSize: 14, color: 'rgba(0, 0, 0, 0.50)' }}>  27 Dec 2023</Text></Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>We has been confirmed</Text>
                        </View>
                        <View style={{ height: 60, width: 2, backgroundColor: '#CC0D39', position: 'absolute', left: 11, top: 33 }}></View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 40 }}>
                        <View style={{ height: 24, width: 24, borderWidth: 2, borderColor: colors.border, borderRadius: 24 }}>
                        </View>
                        <View>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>Order Processed<Text style={{ ...FONTS.fontRegular, fontSize: 14, color: 'rgba(0, 0, 0, 0.50)' }}>  28 Dec 2023</Text></Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>We are preparing your order</Text>
                        </View>
                        <View style={{ height: 60, width: 2, backgroundColor: colors.border, position: 'absolute', left: 11, top: 33 }}></View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 40 }}>
                        <View style={{ height: 24, width: 24, borderWidth: 2, borderColor: colors.border, borderRadius: 24 }}>
                        </View>
                        <View>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>Ready To Ship<Text style={{ ...FONTS.fontRegular, fontSize: 14, color: 'rgba(0, 0, 0, 0.50)' }}>  29 Dec 2023</Text></Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Your order is ready for shipping </Text>
                        </View>
                        <View style={{ height: 60, width: 2, backgroundColor: colors.border, position: 'absolute', left: 11, top: 33 }}></View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 40 }}>
                        <View style={{ height: 24, width: 24, borderWidth: 2, borderColor:colors.border, borderRadius: 24 }}>
                        </View>
                        <View>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>Out For Delivery<Text style={{ ...FONTS.fontRegular, fontSize: 14, color: 'rgba(0, 0, 0, 0.50)' }}>  31 Dec 2023</Text></Text>
                            <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Your order is out for delivery</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Trackorder