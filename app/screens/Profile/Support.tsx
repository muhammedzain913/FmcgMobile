import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  TextInput,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS } from "../../constants/theme";

type ContactOption = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  action: () => void;
  color: string;
  bg: string;
};

const Support = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const contactOptions: ContactOption[] = [
    {
      icon: "call-outline",
      label: "Call Us",
      value: "+91 80001 00001",
      color: "#2E7D32",
      bg: "#E8F5E9",
      action: () => Linking.openURL("tel:+918000100001"),
    },
    {
      icon: "mail-outline",
      label: "Email Us",
      value: "support@sooper.in",
      color: "#1565C0",
      bg: "#E3F2FD",
      action: () => Linking.openURL("mailto:support@sooper.in"),
    },
    {
      icon: "logo-whatsapp",
      label: "WhatsApp",
      value: "+91 80001 00001",
      color: "#2E7D32",
      bg: "#E8F5E9",
      action: () => Linking.openURL("whatsapp://send?phone=918000100001"),
    },
    {
      icon: "chatbubble-outline",
      label: "Live Chat",
      value: "Chat with an agent",
      color: "#6A1B9A",
      bg: "#F3E5F5",
      action: () => navigation.navigate("Chat"),
    },
  ];

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert("Empty Message", "Please write your message before submitting.");
      return;
    }
    setSubmitted(true);
    setMessage("");
  };

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Support" leftIcon="back" titleRight />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[GlobalStyleSheet.container, { paddingTop: 20 }]}>

          {/* HERO BANNER */}
          <View style={styles.heroBanner}>
            <View style={styles.heroIcon}>
              <Ionicons name="headset-outline" size={36} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>We're here to help</Text>
            <Text style={styles.heroSubtitle}>
              Our support team is available{"\n"}Monday – Sunday, 8 AM – 10 PM
            </Text>
          </View>

          {/* CONTACT OPTIONS */}
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Contact Us</Text>
          <View style={styles.contactGrid}>
            {contactOptions.map((opt, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactCard,
                  { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : "#fff" },
                ]}
                activeOpacity={0.75}
                onPress={opt.action}
              >
                <View style={[styles.contactIconWrap, { backgroundColor: theme.dark ? "rgba(255,255,255,0.1)" : opt.bg }]}>
                  <Ionicons name={opt.icon} size={22} color={theme.dark ? "#fff" : opt.color} />
                </View>
                <Text style={[styles.contactLabel, { color: colors.title }]}>{opt.label}</Text>
                <Text style={[styles.contactValue, { color: colors.text }]} numberOfLines={1}>
                  {opt.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SEND A MESSAGE */}
          <Text style={[styles.sectionTitle, { color: colors.title, marginTop: 28 }]}>
            Send a Message
          </Text>

          {submitted ? (
            <View style={[styles.successBox, { backgroundColor: theme.dark ? "rgba(46,125,50,0.2)" : "#E8F5E9" }]}>
              <Ionicons name="checkmark-circle" size={40} color="#2E7D32" />
              <Text style={[styles.successTitle, { color: colors.title }]}>Message Sent!</Text>
              <Text style={[styles.successSubtitle, { color: colors.text }]}>
                We've received your message and will get back to you within 24 hours.
              </Text>
              <TouchableOpacity
                style={styles.newMessageBtn}
                onPress={() => setSubmitted(false)}
              >
                <Text style={styles.newMessageBtnText}>Send Another</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.messageCard,
                { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : "#fff" },
              ]}
            >
              <TextInput
                style={[
                  styles.messageInput,
                  {
                    color: colors.title,
                    borderColor: theme.dark ? "rgba(255,255,255,0.12)" : "#EEE",
                    backgroundColor: theme.dark ? "rgba(255,255,255,0.04)" : "#FAFAFA",
                  },
                ]}
                placeholder="Describe your issue or question..."
                placeholderTextColor={colors.text}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />

              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.85}
                onPress={handleSubmit}
              >
                <Ionicons name="send-outline" size={16} color="#fff" />
                <Text style={styles.submitBtnText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* QUICK LINKS */}
          <Text style={[styles.sectionTitle, { color: colors.title, marginTop: 28 }]}>
            Quick Links
          </Text>
          {[
            { icon: "help-circle-outline" as const, label: "FAQs", route: "Questions" },
            { icon: "document-text-outline" as const, label: "Terms & Conditions", route: null },
            { icon: "shield-checkmark-outline" as const, label: "Privacy Policy", route: null },
          ].map((link, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickLink,
                { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : "#fff" },
              ]}
              activeOpacity={0.75}
              onPress={() => link.route && navigation.navigate(link.route as any)}
            >
              <Ionicons name={link.icon} size={20} color="#1E123D" />
              <Text style={[styles.quickLinkText, { color: colors.title }]}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ))}

        </View>
      </ScrollView>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  heroBanner: {
    backgroundColor: "#1E123D",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
    gap: 10,
  },

  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  heroTitle: {
    fontSize: 20,
    fontFamily: "Lato",
    fontWeight: "700",
    color: "#fff",
  },

  heroSubtitle: {
    fontSize: 13,
    fontFamily: "Lato",
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 19,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Lato",
    fontWeight: "700",
    marginBottom: 14,
  },

  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  contactCard: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  contactLabel: {
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "700",
  },

  contactValue: {
    fontSize: 11,
    fontFamily: "Lato",
    textAlign: "center",
  },

  messageCard: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  messageInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: "Lato",
    minHeight: 120,
  },

  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1E123D",
    borderRadius: 12,
    paddingVertical: 14,
  },

  submitBtnText: {
    fontSize: 15,
    fontFamily: "Lato",
    fontWeight: "700",
    color: "#fff",
  },

  successBox: {
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 10,
  },

  successTitle: {
    fontSize: 18,
    fontFamily: "Lato",
    fontWeight: "700",
  },

  successSubtitle: {
    fontSize: 13,
    fontFamily: "Lato",
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 260,
  },

  newMessageBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#1E123D",
  },

  newMessageBtnText: {
    fontSize: 13,
    fontFamily: "Lato",
    fontWeight: "600",
    color: "#1E123D",
  },

  quickLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  quickLinkText: {
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "500",
  },
});
