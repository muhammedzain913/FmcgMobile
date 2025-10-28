import { View, Text,  ScrollView, Image, TouchableOpacity ,Platform} from 'react-native'
import React from 'react'
import Header from '../../layout/Header'
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';


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

const imageData = [
    {
        image:IMAGES.item14,
        title: "Woman",
        count: '44',
        background:'#FDEBD5',
        color:'#BE9D74'
    },
    {
        image:IMAGES.item15,
        title: "Man",
        count: '84',
        background:'#F6E0C5',
        color:'#A77231'
    },
    {
        image:IMAGES.item16,
        title: "Child",
        count: '30',
        background:'#E1EFFB',
        color:'#89A8C3'
    },
    {
        image:IMAGES.item17,
        title: "Fashion",
        count: '40',
        background:'#FCEBE1',
        color:'#CEA990'
    },
]


type CategoryScreenProps = StackScreenProps<RootStackParamList, 'Category'>;

const Category = ({navigation} : CategoryScreenProps) => {

  const theme = useTheme();
  const { colors } : {colors : any} = theme;

  return (
    <View style={{backgroundColor:colors.card,flex:1}}>
        <Header
          title='Category'
          leftIcon='back'
          rightIcon1={'search'}
        />
        <ScrollView contentContainerStyle={{flexGrow:1}}>
          <View style={[GlobalStyleSheet.container,{paddingTop:10}]}>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                  <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>Top Brands</Text>
                  <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title,textDecorationLine:'underline'}]}>View All</Text>
              </View>
              <View style={{marginHorizontal:-15}}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{flexGrow:1,paddingHorizontal:15}}
                    showsHorizontalScrollIndicator={false}
                  >
                      {brandData.map((data:any,index) => {
                          return(
                            <TouchableOpacity activeOpacity={0.8}  key={index} style={{alignItems:'center',marginRight:20}}>
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
              <View style={{marginTop:20}}>
                  <Text style={[FONTS.fontSemiBold,{fontSize:18,color:colors.title}]}>New Arrival</Text>
                  <View style={{ marginHorizontal: -15,paddingTop:10,paddingBottom:10 }}>
                      <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingHorizontal: 15 }}
                      >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
                              {ArrivalData.map((data:any, index) => {
                                  return (
                                      <TouchableOpacity
                                          key={index}
                                          style={{
                                              backgroundColor: data.active ? colors.title :theme.dark ? 'rgba(255,255,255,0.10)': colors.background,
                                              height: 38,
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              borderRadius: 8,
                                              //borderColor: theme.dark ? COLORS.white : colors.borderColor,
                                              //marginTop: 10,
                                              paddingHorizontal: 20,
                                              paddingVertical: 5
                                          }}>
                                          <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: data.active ?theme.dark ? COLORS.primary : colors.card : colors.title }}>{data.title}</Text>
                                      </TouchableOpacity>
                                  )
                              })}
                          </View>
                      </ScrollView>
                </View>
              </View>
              <View style={{paddingTop:15}}>
                  <Text style={[FONTS.fontSemiBold,{fontSize:18,color:colors.title,marginBottom:10}]}>Discover latest collection </Text>
                  <View style={GlobalStyleSheet.row}>
                      {imageData.map((data:any,index) => {
                          return(
                              <TouchableOpacity
                                    onPress={() => navigation.navigate('Products')} 
                                    activeOpacity={0.8} 
                                    key={index} 
                                    style={[GlobalStyleSheet.col50, { marginBottom: 20, }]}
                                >
                                  <View style={{backgroundColor:data.background ,height:undefined,width:'100%',aspectRatio:1/1.2,borderRadius:8}}>  
                                      <Image
                                        style={[{height:undefined,width:'100%',aspectRatio:1/1},Platform.OS === 'web' && {height:null}]}
                                        source={data.image}
                                      />
                                      <View style={{ backgroundColor:data.color, height:40, width:'100%', borderRadius: 8, alignItems: 'center', justifyContent: 'center',position:'absolute',bottom:0,}}>
                                          <Text style={{ ...FONTS.fontSemiBold, fontSize: 16, color: COLORS.white }}>{data.title}<Text style={{ ...FONTS.fontRegular, fontSize: 12 }}> ({data.count} Items)</Text></Text>
                                      </View>
                                  </View>
                              </TouchableOpacity>
                          )
                      })}
                  </View>
              </View>
          </View>
        </ScrollView>
    </View>
  )
}

export default Category