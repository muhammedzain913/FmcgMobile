import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';

const QuestionsAccordion = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections:any) => {
        setActiveSections(
            sections.includes(undefined) ? [] : sections
        );
    };

    const SECTIONS = [
        {
            title: 'What are the delivery timings?',
            content: 'We deliver groceries 7 days a week from 8 AM to 10 PM. Express delivery slots are available in select areas and can be chosen at checkout. Same-day delivery is available for orders placed before 6 PM.',
        },
        {
            title: 'Is there a minimum order amount?',
            content: 'Yes, the minimum order amount is ₹199. Orders above ₹499 qualify for free delivery. A small delivery fee applies for orders below the free-delivery threshold based on your location.',
        },
        {
            title: 'How do I track my order?',
            content: 'Once your order is confirmed, go to My Orders in your account and tap Track Order. You will see real-time updates from packing to dispatch to delivery at your doorstep.',
        },
        {
            title: 'What if an item I ordered is out of stock?',
            content: 'If an item goes out of stock after you place your order, we will notify you via the app and issue a full refund for that item to your original payment method within 2–3 business days.',
        },
        {
            title: 'Can I cancel or modify my order?',
            content: 'You can cancel your order within 5 minutes of placing it from the My Orders screen. Modifications such as quantity changes are not supported after the order is confirmed. For urgent issues, please contact Support.',
        },
        {
            title: 'Are the products fresh and quality-checked?',
            content: 'Yes! All fruits, vegetables, dairy, and perishables are sourced daily from trusted suppliers and are quality-checked before packing. We guarantee fresh products or a full replacement.',
        },
        {
            title: 'How do I apply a coupon or promo code?',
            content: 'On the checkout screen, tap Apply Coupon and enter your code. Valid discounts will be applied automatically to your order total. Only one coupon can be used per order.',
        },
    ];

    const AccordionHeader = (item:any, _:any, isActive:any) => {

        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 15
            }}>
                <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.title, flex: 1 }]}>{item.title}</Text>
                <Feather name={isActive ? "chevron-up" : "chevron-down"} size={18} color={colors.title} />
            </View>
        )
    }

    const AccordionBody = (item:any, _:any, isActive:any) => {
        return (
            <View style={{
                borderTopWidth: 1,
                borderTopColor: colors.border,
                paddingVertical: 10,
                paddingHorizontal: 15
            }}>

                <Text style={[FONTS.fontSm, { color: colors.text, lineHeight: 20 }]}>{item.content}</Text>
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                duration={300}
                sectionContainerStyle={{
                    // borderWidth: 1,
                    // borderColor: theme.dark ? COLORS.white : colors.borderColor,
                    marginBottom: 15,
                    //paddingHorizontal: 20,
                    borderRadius: 10,
                    backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)':colors.background
                }}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
}

export default QuestionsAccordion