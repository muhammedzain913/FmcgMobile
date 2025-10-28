import { useTheme } from '@react-navigation/native';
import React, { useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Animated} from 'react-native'
import Header from '../../layout/Header';
import { COLORS, SIZES ,FONTS} from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch } from 'react-redux';
import { addTowishList } from '../../redux/reducer/wishListReducer';


const MyorderData = [
    {
        id:"21",
        image:IMAGES.item9,
        title:'Echo Vibe Urban Runners',
        price:"$179",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Track Order'
    },
    {
        id:"22",
        image:IMAGES.item10,
        title:'Swift Glide Sprinter Soles',
        price:"$199",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Track Order'
    },
    {
        id:"23",
        image:IMAGES.item11,
        title:'Sky Burst Skyline Burst Shoes',
        price:"$149",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Track Order'
    },
    {
        id:"24",
        image:IMAGES.item12,
        title:'Zen Dash Active Flex Shoes',
        price:"$299",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Track Order'
    },
    {
        id:"25",
        image:IMAGES.item13,
        title:'Nova Stride Street Stompers',
        price:"$99",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Track Order'
    },
]

const CompletedData = [
    {
        id:"26",
        image:IMAGES.item13,
        title:'Swift Glide Sprinter Soles',
        price:"$199",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Write Review'
    },
    {
        id:"27",
        image:IMAGES.item12,
        title:'Sky Burst Skyline Burst Shoes',
        price:"$299",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Write Review'
    },
    {
        id:"28",
        image:IMAGES.item11,
        title:'Zen Dash Active Flex Shoes',
        price:"$49",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Write Review'
    },
    {
        id:"29",
        image:IMAGES.item10,
        title:'Echo Vibe Urban Runners',
        price:"$399",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Write Review'
    },
    {
        id:"30",
        image:IMAGES.item9,
        title:'Nova Stride Street Stompers',
        price:"$199",
        delevery:"FREE Delivery",
        offer:"40% OFF",
        btntitle:'Write Review'
    },
]


type MyorderScreenProps = StackScreenProps<RootStackParamList, 'Myorder'>;

const Myorder = ({navigation} : MyorderScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;
    
    const scrollRef = useRef<any>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const onPressTouch = (val:number) => {
        setCurrentIndex(val)
        scrollRef.current.scrollTo({
            x: SIZES.width * val,
            animated: true,
        });
    }

    const dispatch = useDispatch();

    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
    }


    return (
       <View style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title='My Order'
                leftIcon='back'
                titleRight
            />
           <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={GlobalStyleSheet.container}>
                    <View style={{ flexDirection: 'row', gap: 10, marginRight: 10 }}>
                        <TouchableOpacity
                            onPress={() => onPressTouch(0)}
                            style={[GlobalStyleSheet.TouchableOpacity2, { backgroundColor: currentIndex === 0 ? colors.title : colors.card, borderColor: currentIndex === 0 ? colors.title : colors.title }]}
                        >
                            <Text style={{ ...FONTS.fontRegular, fontSize: 19, color: currentIndex === 0 ?theme.dark ? COLORS.title : colors.card : colors.title }}>Ongoing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPressTouch(1)}
                            style={[GlobalStyleSheet.TouchableOpacity2, { backgroundColor: currentIndex === 1 ? colors.title : colors.card, borderColor: currentIndex === 1 ? colors.title : colors.title }]}
                        >
                            <Text style={{ ...FONTS.fontRegular, fontSize: 19, color: currentIndex === 1 ?theme.dark ? COLORS.title : colors.card  : colors.title }}>Completed</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    ref={scrollRef}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onMomentumScrollEnd={(e:any) => {
                        if (e.nativeEvent.contentOffset.x.toFixed(0) == SIZES.width.toFixed(0)) {
                            setCurrentIndex(1)
                        } else if (e.nativeEvent.contentOffset.x.toFixed(0) == 0) {
                            setCurrentIndex(0)
                        } else {
                            setCurrentIndex(0)
                        }
                    }}
                >
                    <View style={{ width: SIZES.width }}>
                        <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
                            <View style={{ marginHorizontal: -15, }}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                >
                                    {MyorderData.map((data:any, index) => {
                                        return (
                                            <Cardstyle2
                                                id={data.id}
                                                key={index}
                                                title={data.title}
                                                price={data.price}
                                                delevery={data.delevery}
                                                image={data.image}
                                                offer={data.offer}
                                                removelikebtn
                                                btntitle={data.btntitle}
                                                onPress1={() => addItemToWishList(data)}
                                                onPress={() => navigation.navigate('Trackorder')}
                                            />
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: SIZES.width }}>
                        <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
                            <View style={{ marginHorizontal: -15, }}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                >
                                    {CompletedData.map((data:any, index) => {
                                        return (
                                            <Cardstyle2
                                                id={data.id}
                                                key={index}
                                                title={data.title}
                                                price={data.price}
                                                delevery={data.delevery}
                                                image={data.image}
                                                offer={data.offer}
                                                removelikebtn
                                                btntitle={data.btntitle}
                                                onPress1={() => addItemToWishList(data)}
                                                onPress={() => navigation.navigate('Writereview')}
                                            />
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ScrollView>
       </View>
    )
}

export default Myorder