import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react' 
import { View, Text ,ScrollView,Image,TouchableOpacity} from 'react-native'
import { IMAGES } from '../../constants/Images';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';


const saveData = [
    {
        image: IMAGES.Home,
        title: "Home Address",
        text: "123 Main Street, Anytown, USA 12345",
    },
    {
        image: IMAGES.Location,
        title: "Office Address",
        text: "456 Elm Avenue, Smallville, CA 98765",
    },
    {
        image: IMAGES.Home,
        title: "Home Address",
        text: "789 Maple Lane, Suburbia, NY 54321",
    },
    {
        image: IMAGES.Bag,
        title: "Shop Address",
        text: "654 Pine Road, Countryside, FL 34567",
    },
]


type DeleveryAddressScreenProps = StackScreenProps<RootStackParamList, 'DeleveryAddress'>;

const DeleveryAddress = ({navigation} : DeleveryAddressScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [isChecked, setIsChecked] = useState(saveData[0]);

    return (
        <View style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title='Delivery Address'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={[GlobalStyleSheet.container, { paddingTop: 10 }]}>
                    {saveData.map((data, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => setIsChecked(data)}
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
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 ,flex:1}}>
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
                                <View
                                    style={{
                                        borderWidth: 1,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 50,
                                        borderColor: theme.dark ? COLORS.white : colors.borderColor,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // flex:1
                                        
                                    }}
                                >
                                    <View style={[{
                                        width: 14,
                                        height: 14,
                                        backgroundColor: colors.card,
                                        borderRadius: 50
                                    }, isChecked === data && {
                                        backgroundColor: colors.title
                                    }]}></View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                    <TouchableOpacity
                        style={{
                            height: 48,
                            width: '100%',
                            borderWidth: 1,
                            borderColor:colors.border,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            marginTop: 30
                        }}
                        onPress={() => navigation.navigate('AddDeleveryAddress')}
                    >
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Image
                                style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: colors.title }}
                                source={IMAGES.plus}
                            />
                            <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title }}>Add Address</Text>
                        </View>
                        <Ionicons  color={colors.title} name='chevron-forward' size={20}/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingBottom:0}]}>
                <View style={{height:88,width:'100%',borderTopWidth:1,borderTopColor:colors.border,justifyContent:'center',paddingHorizontal:15}}>
                    <Button
                        title='Save Address'
                        color={colors.title}
                        text={theme.dark ? COLORS.primary : COLORS.white}
                        onPress={() => navigation.navigate('Payment')}
                    />
                </View>
            </View>
        </View>
    )
}

export default DeleveryAddress