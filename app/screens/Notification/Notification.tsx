import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react'
import { View, Text,ScrollView,TouchableOpacity, LayoutAnimation } from 'react-native'
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeBox from '../../components/SwipeBox';
import { GlobalStyleSheet } from '../../constants/StyleSheet';


const SwipeData = [
    {
        image: IMAGES.small1,
        title: "New Arrivals Alert!",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small2,
        title: "Flash Sale Announcement",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small3,
        title: "Exclusive Discounts Inside",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small4,
        title: "Limited Stock - Act Fast!",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small5,
        title: "Get Ready to Shop",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small6,
        title: "New Arrivals Alert!",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small7,
        title: "Flash Sale Announcement",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small2,
        title: "Don't Miss Out on Savings",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small3,
        title: "Limited Stock - Act Fast!",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small4,
        title: "Get Ready to Shop",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small5,
        title: "New Arrivals Alert!",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small6,
        title: "Flash Sale Announcement",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small7,
        title: "Exclusive Discounts Inside",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small2,
        title: "Limited Stock - Act Fast!",
        date: "15 July 2023"
    },
    {
        image: IMAGES.small3,
        title: "Get Ready to Shop",
        date: "15 July 2023"
    },
]

const Notification = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [lists, setLists] = useState<any>(SwipeData);

    const deleteItem = (index:any) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        const arr = [...lists];
        arr.splice(index, 1);
        setLists(arr);
    };

    return (
        <View style={{backgroundColor:colors.card,flex:1}}>
            <Header
                title='Notifications (12)'
                leftIcon='back'
                rightIcon1={'search'}
            />
            <ScrollView contentContainerStyle={{paddingBottom:50}}>
                <View style={[GlobalStyleSheet.container,{padding:0}]}>
                    <GestureHandlerRootView style={{}}>
                            {lists.map((data:any,index:any) => {
                                return(
                                    <View
                                        key={index}
                                    >
                                        <SwipeBox data={data} colors={colors} handleDelete={() => deleteItem(index)} />
                                    </View>
                                )
                            })}
                    </GestureHandlerRootView>
                </View>
            </ScrollView>
        </View>
    )
}

export default Notification