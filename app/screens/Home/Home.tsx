import React, { useEffect, useRef } from 'react'
import { View, Text, ScrollView, Image,TouchableOpacity,TextInput ,Platform} from 'react-native'
import {  useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import Cardstyle1 from '../../components/Card/Cardstyle1';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import BottomSheet2 from '../Components/BottomSheet2';
import { useDispatch } from 'react-redux';
import { openDrawer } from '../../redux/actions/drawerAction';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { test } from '../../redux/reducer/userReducer';



const brandData = [
    {
        title:'Nike',
        image:IMAGES.brand1
    },
    {
        title:'Adidas',
        image:IMAGES.brand2
    },
    {
        title:'Reebok',
        image:IMAGES.brand3
    },
    {
        title:'Puma',
        image:IMAGES.brand4
    },
    {
        title:'Bata',
        image:IMAGES.brand5
    },
    {
        title:'Nike',
        image:IMAGES.brand1
    },
    {
        title:'Adidas',
        image:IMAGES.brand2
    },
    {
        title:'Reebok',
        image:IMAGES.brand3
    },
    {
        title:'Puma',
        image:IMAGES.brand4
    },
    {
        title:'Bata',
        image:IMAGES.brand5
    },
  ]

const ArrivalData = [
    {
        title: "All",
        active: true,
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

const cardData =[
    {
        id:"0",
        image:IMAGES.item5,
        title:"Swift Glide Sprinter Soles",
        price:"$199",
        offer:"30% OFF",
        color:false,
        hascolor:false
    },
    {
        id:"1",
        image:IMAGES.item6,
        title:"Echo Vibe Urban Runners",
        price:"$149",
        //offer:"30% OFF"
        color:false,
        hascolor:true
    },
    {
        id:"2",
        image:IMAGES.item7,
        title:"Zen Dash Active Flex Shoes",
        price:"$299",
        //offer:"30% OFF"
        color:false,
        hascolor:true
    },
    {
        id:"3",
        image:IMAGES.item8,
        title:"Nova Stride Street Stompers",
        price:"$99",
        offer:"70% OFF",
        color:true,
        hascolor:false
    },
]

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({navigation} : HomeScreenProps) => {

    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

  //const navigation = useNavigation()

    const sheetRef = useRef<any>(null);

    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
    }





  return (
      <View style={{backgroundColor:colors.card,flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:20,marginTop:5,marginBottom:10}]}>
                <View style={[GlobalStyleSheet.row,{alignItems:'center',justifyContent:'space-between'}]}>
                    <TouchableOpacity
                        style={{margin:5}}
                        // onPress={() => dispatch(openDrawer())}
                        onPress={() => navigation.openDrawer()}
                    >
                        <Image
                            style={{height:16,width:16,tintColor:colors.title}}
                            source={IMAGES.grid3}
                        />
                    </TouchableOpacity>
                    <View>
                        <Image
                            style={{height:25,width:50,resizeMode:'contain',tintColor:colors.title}}
                            source={IMAGES.shose}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notification')} 
                        style={{
                            height:35,
                            width:35,
                            borderRadius:8,
                            backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)' : COLORS.background,
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                    >
                        <Image
                        style={{height:20,width:20,tintColor:colors.title}}
                        source={IMAGES.ball}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20,gap:10,marginHorizontal:-5}}>
                    <View style={{flex:1}}>
                        <TextInput
                            placeholder='Search Product'
                            placeholderTextColor={'#666666'}
                            style={[FONTS.fontRegular,{
                            height:50,
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
                    <TouchableOpacity 
                        style={{
                        height:50,
                        width:50,
                        backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)' : colors.title,
                        borderRadius:8,
                        alignItems:'center',
                        justifyContent:'center'
                        }}
                        onPress={() => sheetRef.current.openSheet('filter')}
                    >
                        <Image
                        style={{height:24,width:24,resizeMode:'contain'}}
                        source={IMAGES.grid4}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{backgroundColor:COLORS.secondary}}>
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:30}]}>
                    <View style={GlobalStyleSheet.row}>
                        <View style={[GlobalStyleSheet.col50,{alignSelf:'center'}]}>
                            <View style={{paddingVertical:10}}>
                                <Text style={[FONTS.fontRegular,{fontSize:12,color:'#CC0D39'}]}>WOMAN'S SHOES</Text>
                                <Text style={[FONTS.fontMedium,{fontSize:22,color:COLORS.title,marginTop:5}]}>Nike SB Zoom{"\n"}Stefan Janoski</Text>
                                <View style={{width:'70%',marginTop:10}}>
                                    <Button
                                        onPress={() => navigation.navigate('Products')}
                                        title='Shop Now'
                                        size={"sm"}
                                        color={COLORS.primary}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={GlobalStyleSheet.col50}>
                        <View
                            style={{
                                marginTop:-15,
                                marginBottom:-15,
                                marginLeft:-15,
                                marginRight:-15,
                                position:'relative',
                                alignItems:'center',
                            }}
                        >
                            <View 
                                style={[{
                                    backgroundColor:theme.dark ? COLORS.background :colors.card,
                                    borderTopLeftRadius:200,
                                    borderTopRightRadius:200,
                                    position:'absolute',
                                    left:35,
                                    right:35,
                                    top:15,
                                    bottom:0,
                                },Platform.OS === 'web' && {bottom:-10}]}
                            />
                            <Image
                                style={[{
                                    height:undefined,
                                    width:'100%',
                                    aspectRatio:1/1,
                                },Platform.OS === 'web' && {height:null}]}
                                source={IMAGES.item1}
                            />
                        </View>
                    </View>
                    </View>
                </View>
            </View>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:20}]}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                    <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>Top Brands</Text>
                    <TouchableOpacity 
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('Products')}
                    >
                        <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title,textDecorationLine:'underline'}]}>View All</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:0}]}>
                <View>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{paddingHorizontal:20,flexGrow:1}}
                        showsHorizontalScrollIndicator={false}
                    >
                        {brandData.map((data:any,index) => {
                            return(
                                <TouchableOpacity 
                                    key={index} 
                                    style={{alignItems:'center',marginRight:20}}
                                    onPress={() => navigation.navigate('Products')}
                                >
                                    <View style={{height:60,width:60,borderRadius:50,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'}}>
                                        <Image
                                            style={{height:30,width:30,resizeMode:'contain',tintColor:colors.title}}
                                            source={data.image}
                                        />
                                    </View>
                                    <Text style={[FONTS.fontMedium,{fontSize:14,color:colors.title,marginTop:10}]}>{data.title}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:20,paddingBottom:10}]}>
                <View style={{}}>
                    <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>New Arrival</Text>
                </View>
            </View>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:20,paddingVertical:0}]}>
            <View style={{ marginHorizontal: -15 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
                        {ArrivalData.map((data:any, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Products')}
                                    key={index}
                                    style={{
                                        backgroundColor: data.active ? colors.title : theme.dark ? 'rgba(255,255,255,0.10)' :colors.background,
                                        height: 38,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 8,
                                        // borderColor: theme.dark ? COLORS.white : colors.borderColor,
                                        //marginTop: 10,
                                        paddingHorizontal: 20,
                                        paddingVertical: 5
                                    }}>
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: data.active ? theme.dark ? COLORS.title: colors.card : colors.title }}>{data.title}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
            </View>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:20}]}>
                <View style={[GlobalStyleSheet.row]}>
                    {cardData.map((data:any, index) => {
                        return (
                            <View style={[GlobalStyleSheet.col50, { marginBottom: 20, }]} key={index}>
                                <Cardstyle1
                                    id={data.id}
                                    title={data.title}
                                    image={data.image}
                                    price={data.price}
                                    offer={data.offer}
                                    color={data.color}
                                    hascolor={data.hascolor}
                                    onPress1={() => addItemToWishList(data)}
                                    onPress2={() => navigation.navigate('ProductsDetails')}
                                    onPress={() => navigation.navigate('ProductsDetails')}
                                />
                            </View>
                        )
                    })}
                </View>
            </View>
        </ScrollView>
        <BottomSheet2
            ref={sheetRef}
        />
      </View>
  );
};

export default Home