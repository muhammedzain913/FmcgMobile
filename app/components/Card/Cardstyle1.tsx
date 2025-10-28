import React from 'react'
import { View, Text ,Image,TouchableOpacity} from 'react-native'
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import LikeBtn from '../LikeBtn';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromwishList } from '../../redux/reducer/wishListReducer';

type Props = {
    id ?: string,
    title : string;
    color : any;
    price : string;
    image ?: any;
    offer : string;
    hascolor?:any;
    onPress ?: (e : any) => void,
    onPress1 ?: (e : any) => void,
    onPress2 ?: (e : any) => void,
}

const Cardstyle1 = ({id,title,price,image,offer,color,hascolor,onPress,onPress1,onPress2}:Props) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const navagation = useNavigation();

    const dispatch = useDispatch();

    const wishList = useSelector((state:any) => state.wishList.wishList);

    const inWishlist = () => {
        var temp = [] as any;
        wishList.forEach((data:any) => {
            temp.push(data.id);
        });
        return temp;
    }

    const removeItemFromWishList = () => {
        dispatch(removeFromwishList(id as any));
    }

  return (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress} 
    >
        <View style={{height:undefined,width:'100%',aspectRatio:1/1.1,backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)':colors.background,borderRadius:8,alignItems:'center',justifyContent:'center'}}>
            <Image
                style={{ height: undefined, width: '100%', aspectRatio: 1 / 1.1,resizeMode:'contain'}}
                source={image}
            />
        </View>
        {hascolor ?
            null
        :
            <View style={{
                width:80,
                borderBottomLeftRadius:30,
                borderTopLeftRadius:30,
                backgroundColor:color ? COLORS.danger :colors.title,
                alignItems:'center',
                justifyContent:'center',
                position:'absolute',
                paddingHorizontal:10,
                paddingVertical:5,
                top:26,
                left:-10,
                transform: [{rotate: '-90deg'}]
                }}
            >
                <Text style={[FONTS.fontMedium,{fontSize:12,color:theme.dark ? COLORS.title :colors.card,}]}>{offer}</Text>
            </View>

        }
        <View style={{position:'absolute',right:-5,top:-5}}>
            <LikeBtn
                onPress={inWishlist().includes(id) ? removeItemFromWishList : onPress1}
                id={id}
                inWishlist={inWishlist}
            />
        </View>
        <Text  style={[FONTS.fontMedium,{fontSize:14,color:colors.title,marginTop:10,paddingRight:30}]}>{title}</Text>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <Text style={[FONTS.fontSemiBold,{fontSize:18,color:colors.title}]}>{price}</Text>
            <TouchableOpacity
                onPress={onPress2} 
                activeOpacity={0.6} 
                style={{
                    height:28,
                    width:28,
                    borderRadius:8,
                    backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)' :colors.background,
                    alignItems:'center',
                    justifyContent:'center'
                }}
            >
                <Feather name='arrow-right' size={16} color={colors.title}/>
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
  )
}

export default Cardstyle1