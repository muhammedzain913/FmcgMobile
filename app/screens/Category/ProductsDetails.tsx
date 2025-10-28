import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useState } from 'react'
import { View, Text,ScrollView,Image, TouchableOpacity ,Platform} from 'react-native'
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
//import { addTowishList, removeFromwishList } from '../../redux/reducer/wishListReducer';
//import LikeBtn from '../../components/LikeBtn';
import { addToCart } from '../../redux/reducer/cartReducer';
import { addTowishList } from '../../redux/reducer/wishListReducer';


const swiperimageData = [
    {
        image: IMAGES.product1,
        smallImage: IMAGES.product1,
    },
    {
        image: IMAGES.product2,
        smallImage: IMAGES.product2,
    },
    {
        image: IMAGES.product3,
        smallImage: IMAGES.product3,
    },
    {
        image: IMAGES.product4,
        smallImage: IMAGES.product4,
    },
]


type ProductsDetailsScreenProps = StackScreenProps<RootStackParamList, 'ProductsDetails'>;

const ProductsDetails = ({navigation} : ProductsDetailsScreenProps) => {

    // const navagation = useNavigation();

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const productSizes = ["6.5", "7", "7.5", "8", "8.5" ,"9","9.5"];

    const [activeSize, setActiveSize] = useState(productSizes[0]);

    const productColors = ["#BAA488", "#5F75C5", "#C58F5E", "#919191"];

    const [activeColor, setActiveColor] = useState(productColors[0]);

    const [currentSlide, setCurrentSlide] = useState(0);

    const [show, setshow] = useState(false)

    const dispatch = useDispatch();


    const addItemToCart = () => {

        const selectedImage = swiperimageData[currentSlide].image;

        dispatch(addToCart({
            id:"16",
            image:selectedImage,
            title:"Echo Vibe Urban Runners",
            price:"$179",
            color:false,
            hascolor:true
        } as any ));
    }

    const addItemToWishList = () => {

        const selectedImage = swiperimageData[currentSlide].image;

        dispatch(addTowishList({
            image:selectedImage,
            title:"Echo Vibe Urban Runners",
            price:"$179",
            color:false,
            hascolor:true
        } as any ));
    }

    return (
       <View style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title='Product Details'
                leftIcon='back'
                rightIcon2={'cart'}
                onPress={() => {addItemToCart(); navigation.navigate('MyCart')}}
            />
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={{height:undefined,width:'100%',aspectRatio:1/1,backgroundColor:colors.background}}>
                    <View style={{alignItems:'center'}}>
                        <Image
                            style={[{height:undefined,width:'100%',aspectRatio:1/.8,resizeMode:'contain'},Platform.OS === 'web' && {height:null}]}
                            source={swiperimageData[currentSlide].image}
                        />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                {swiperimageData.map((data:any, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => setCurrentSlide(index)}
                                            key={index}
                                            style={[{
                                                borderWidth: 2,
                                                borderColor: theme.dark ? colors.border :colors.card,
                                                height: 55,
                                                width: 55,
                                                borderRadius: 8,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }, currentSlide === index && {
                                                borderColor: '#CC0D39',
                                            }]}
                                        >
                                            <Image
                                                style={{
                                                    height: 55,
                                                    width: 50,
                                                    resizeMode:'contain'
                                                }}
                                                source={data.smallImage}
                                            />
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                    <View
                        style={{
                            //flexDirection: 'row',
                            marginTop: 10,
                            position:'absolute',
                            left:10
                        }}>
                        {productColors.map((data, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => setActiveColor(data)}
                                    key={index}
                                    style={{
                                        paddingHorizontal: 5,
                                        paddingVertical: 5,
                                        marginLeft: 4,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        //zIndex:25
                                    }}
                                >
                                    {activeColor === data &&
                                        <View
                                            style={{
                                                height: 25,
                                                width: 25,
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                borderColor: theme.dark ? COLORS.white : COLORS.primary,
                                                position: 'absolute',
                                                alignItems:'center',
                                                justifyContent:'center',
                                                zIndex:30
                                            }}
                                        >   
                                              <FontAwesome size={10} color={ COLORS.white} name="check" />
                                        </View>
                                    }
                                    <View
                                        style={{
                                            height: 18,
                                            width: 18,
                                            borderRadius: 30,
                                            backgroundColor: data,
                                        }}
                                    />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
                <View style={GlobalStyleSheet.container}>
                    <Text style={[FONTS.fontMedium,{fontSize:24,color:colors.title,marginBottom:10}]}>Echo Vibe Urban Runners</Text>
                    <View>
                        <Text style={[FONTS.fontMedium,{fontSize:16,color:colors.title}]}>Items Size:</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 10
                            }}
                        >
                            {productSizes.map((data, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => setActiveSize(data)}
                                        key={index}
                                        style={[{
                                            height: 40,
                                            width: 40,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginHorizontal: 4,
                                            backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)': colors.background
                                        }, activeSize === data && {
                                            backgroundColor:theme.dark ? COLORS.white : COLORS.primary,
                                            borderColor:theme.dark ? COLORS.white : COLORS.primary,
                                        }]}
                                    >
                                        <Text style={[{ ...FONTS.fontMedium, fontSize: 13, color: colors.title }, activeSize === data && { color:theme.dark ? COLORS.primary : COLORS.white }]}>{data}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                    <View style={{marginTop:15}}>
                        <Text  style={[FONTS.fontMedium,{fontSize:16,color:colors.title}]}>Description:</Text>
                        <Text style={[FONTS.fontRegular,{fontSize:15,color:colors.title,lineHeight:20,marginTop:10,opacity:.8}]}>
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View style={{borderTopWidth:1,borderTopColor:colors.border,height:88,justifyContent:'center',paddingHorizontal:15}}>
                <View style={[GlobalStyleSheet.row,{alignItems:'center',justifyContent:'space-between'}]}>
                    <Text style={[FONTS.fontMedium,{fontSize:24,color:colors.title}]}>$179</Text>
                    <View style={[GlobalStyleSheet.row,{alignItems:'center',gap:10,paddingRight:10}]}>
                        <TouchableOpacity
                            onPress={() => {setshow(!show) ;addItemToWishList()}}
                            activeOpacity={0.8} 
                            style={{
                                height:55,
                                width:55,
                                borderRadius:8,
                                backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)':colors.background,
                                alignItems:'center',
                                justifyContent:'center'
                            }}
                        >
                            <FontAwesome size={16} color={show ? colors.title : '#C6B4B8'} name="heart" />
                            {/* <LikeBtn
                                onPress={inWishlist().includes() ? removeItemFromWishList : addItemToWishList()}
                                //id={}
                                inWishlist={inWishlist}
                            /> */}
                        </TouchableOpacity>
                        <View>
                            <Button
                                size={'lg'}
                                title='Add to Cart'
                                color={theme.dark ? COLORS.white :COLORS.primary}
                                text={theme.dark ? COLORS.primary : COLORS.white }
                                onPress={() => {addItemToCart(); navigation.navigate('MyCart')}}
                            />
                        </View>
                    </View>
                </View>
            </View>
       </View>
    )
}

export default ProductsDetails