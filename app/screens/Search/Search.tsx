import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react'
import { View, Text,TouchableOpacity, TextInput, ScrollView, Image } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import  { Feather }  from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';


const ArrivalData = [
    {
        title: "All",
    },
    {
        title: "Child",
    },
    {
        title: "Man",
    },
    {
        title: "Woman",
    },
    {
        title: "Dress",
    },
    {
        title: "unisex",
    },
  
  ]
  
const SearchData = [
    {
        title: "Woman Fashion Shoes",
    },
    {
        title: "Man Shoes",
    },
    {
        title: "Girl Shoes",
    },
    {
        title: "Shorts Shoes",
    },
    {
        title: "Shorts",
    },
    {
        title: "unisex",
    },
  
  ]

const Search = ({navigation} :any) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [active, setactive] = useState(ArrivalData[0])

    const [items, setItems] = useState(SearchData);

    const removeItem = () => {
        setItems([]);
    };

    const [show, setshow] = useState(SearchData);


    const removeItem2 = (indexToRemove: number) => {
        setshow(prevItems => prevItems.filter((item, index) => index !== indexToRemove));
    };

  return (
    <View style={{backgroundColor:colors.card,flex:1}}>
        <View style={[GlobalStyleSheet.container]}>
            <View style={[GlobalStyleSheet.row,{gap:10}]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        height:48,
                        width:48,
                        borderRadius:8,
                        backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)':colors.title,
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                >
                    <Feather name='chevron-left' size={24} color={theme.dark ? COLORS.white :colors.card}/>
                </TouchableOpacity>
                <View style={{flex:1}}>
                    <TextInput
                        placeholder='Search Best items for You'
                        placeholderTextColor={'#666666'}
                        style={[FONTS.fontRegular,{
                        height:48,
                        width:'100%',
                        borderWidth:1,
                        borderColor:colors.border,
                        borderRadius:8,
                        paddingHorizontal:20,
                        color:colors.title,
                        fontSize:16
                        }]}
                    />
                </View>
            </View>
            <View style={{paddingTop:25}}>
                <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>Categories</Text>
                <View style={{ marginHorizontal: -15,paddingVertical:15 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
                            {ArrivalData.map((data:any, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {setactive(data) ; navigation.navigate('Products')}}
                                        activeOpacity={0.5}
                                        key={index}
                                        style={[{
                                            backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)': colors.background,
                                            height: 38,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                            //borderColor: theme.dark ? COLORS.white : colors.borderColor,
                                            //marginTop: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 5
                                        }, active === data && {
                                            backgroundColor:colors.title
                                        }]}>
                                        <Text style={[{ ...FONTS.fontMedium, fontSize: 13, color: colors.title },active === data && {color:theme.dark ? COLORS.title :COLORS.white}]}>{data.title}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
                {items.length > 0 &&
                    <View style={{marginTop:10}}>
                        {show.length > 0 && 
                            <View style={[GlobalStyleSheet.row,{alignItems:'center',justifyContent:'space-between'}]}>
                                <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>Search history</Text>
                                <TouchableOpacity
                                    onPress={() => removeItem()}
                                >
                                    <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title,textDecorationLine:'underline'}]}>Clear All</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={{ marginTop: 10 }}>
                            {show.map((data:any, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 }}>
                                        <Text style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title }}>{data.title}</Text>
                                        <TouchableOpacity
                                            onPress={() => removeItem2(index)}
                                        >
                                            <Image
                                                style={{ height: 19, width: 19, resizeMode: 'contain', opacity: 0.5, tintColor: colors.title }}
                                                source={IMAGES.close}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                }
            </View>
        </View>
    </View>
  )
}

export default Search