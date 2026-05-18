import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS } from "../../constants/theme";

type HelpTopic = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

const HELP_TOPICS: HelpTopic[] = [
  {
    icon: "cart-outline",
    title: "Orders & Delivery",
    description: "Track orders, delivery times, missing items",
  },
  {
    icon: "card-outline",
    title: "Payments & Refunds",
    description: "Payment methods, failed payments, refund status",
  },
  {
    icon: "person-outline",
    title: "Account & Profile",
    description: "Login issues, update details, delete account",
  },
  {
    icon: "gift-outline",
    title: "Offers & Coupons",
    description: "Promo codes, cashback, loyalty points",
  },
];

const FAQS: FAQItem[] = [
  {
    question: "How do I track my order?",
    answer:
      "Go to My Orders from your account page, tap on the order you want to track, and select Track Order to see real-time updates.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be cancelled within 5 minutes of placing them. Go to My Orders, select the order, and tap Cancel Order. Modifications are not supported after placement.",
  },
  {
    question: "When will I get my refund?",
    answer:
      "Refunds are processed within 5–7 business days after we confirm the return or cancellation. The amount will be credited back to your original payment method.",
  },
  {
    question: "What if an item is missing from my order?",
    answer:
      "Contact our support team within 24 hours of delivery with your order ID and photos. We will arrange a replacement or refund promptly.",
  },
  {
    question: "How do I change my delivery address?",
    answer:
      "You can update your delivery address from Saved Addresses in your account. Address changes on active orders are not possible.",
  },
];

const Help = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Help" leftIcon="back" titleRight />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[GlobalStyleSheet.container, { paddingTop: 20 }]}>

          {/* HELP TOPICS GRID */}
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Help Topics</Text>
          <View style={styles.topicsGrid}>
            {HELP_TOPICS.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.topicCard,
                  { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : "#F7F5FF" },
                ]}
                activeOpacity={0.75}
                onPress={() => navigation.navigate("Support")}
              >
                <View style={styles.topicIconWrap}>
                  <Ionicons name={topic.icon} size={24} color="#1E123D" />
                </View>
                <Text style={[styles.topicTitle, { color: colors.title }]}>{topic.title}</Text>
                <Text style={[styles.topicDesc, { color: colors.text }]}>{topic.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ ACCORDION */}
          <Text style={[styles.sectionTitle, { color: colors.title, marginTop: 28 }]}>
            Frequently Asked Questions
          </Text>

          {FAQS.map((item, index) => {
            const isOpen = expandedIndex === index;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.faqItem,
                  {
                    backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : "#fff",
                    borderColor: isOpen ? "#1E123D" : (theme.dark ? "rgba(255,255,255,0.08)" : "#EEE"),
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => toggle(index)}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.title, flex: 1, paddingRight: 8 }]}>
                    {item.question}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={isOpen ? "#1E123D" : colors.text}
                  />
                </View>
                {isOpen && (
                  <Text style={[styles.faqAnswer, { color: colors.text }]}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            );
          })}

          {/* CONTACT BANNER */}
          <View style={styles.contactBanner}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>Still need help?</Text>
              <Text style={styles.contactSubtitle}>Our support team is available 24/7</Text>
            </View>
            <TouchableOpacity
              style={styles.contactBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Support")}
            >
              <Text style={styles.contactBtnText}>Contact Us</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Lato",
    fontWeight: "700",
    marginBottom: 14,
  },

  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  topicCard: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  topicIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(30,18,61,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  topicTitle: {
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "700",
    marginTop: 4,
  },

  topicDesc: {
    fontSize: 12,
    fontFamily: "Lato",
    lineHeight: 17,
  },

  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  faqQuestion: {
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "600",
    lineHeight: 20,
  },

  faqAnswer: {
    fontSize: 13,
    fontFamily: "Lato",
    lineHeight: 19,
    marginTop: 10,
  },

  contactBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#1E123D",
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
  },

  contactTitle: {
    fontSize: 15,
    fontFamily: "Lato",
    fontWeight: "700",
    color: "#fff",
  },

  contactSubtitle: {
    fontSize: 12,
    fontFamily: "Lato",
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  contactBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  contactBtnText: {
    fontSize: 13,
    fontFamily: "Lato",
    fontWeight: "600",
    color: "#fff",
  },
});
