import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";

type Props = {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  type?: string;
  numberOfLines?: any;
  icon?: any;
  inputSm?: any;
  inputLg?: any;
  inputRounded?: any;
  style?: any;
  multiline?: boolean;
  backround?: any;
  keyboardType?: any;
  variant? :any
};

const Input = ({
  placeholder,
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  type,
  numberOfLines,
  multiline,
  icon,
  inputSm,
  inputLg,
  inputRounded,
  style,
  backround,
  keyboardType,
  variant
}: Props) => {
  const [showPass, setShowPass] = useState<boolean>(true);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <View style={{gap : 5}} >
      {icon && (
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: 58,
            alignItems: "center",
            justifyContent: "center",
            borderRightWidth: 1,
            borderRightColor: colors.border,
            zIndex: 9,
          }}
        >
          {icon}
        </View>
      )}
      <Text
        style={{
          fontFamily: "Lato-Medium", // preferred if you loaded font files
          fontSize: 13,
          lineHeight: 13,
          letterSpacing: -0.39,
          color: variant === 'default' ? 'white' : variant === 'dark' ? '#FFFFFF' : 'black',
          textTransform: "uppercase",
        }}
      >
        {placeholder}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: variant === 'default' ? 'white' : variant === 'dark' ? '#291E47' : 'white',
            borderColor: colors.border,
            color: colors.title,
            fontSize: backround ? 18 : 14,
          },
          numberOfLines && {
            height: 120,
            paddingVertical: 14,
            textAlignVertical: "top",
          },
          icon && {
            paddingLeft: 70,
          },
          inputRounded && {
            borderRadius: 45,
          },
          inputSm && {
            height: 40,
          },
          inputLg && {
            height: 60,
          },
          style && {
            ...style,
          },
        ]}
        multiline={multiline ? multiline : false}
        secureTextEntry={type === "password" ? showPass : false}
        value={value}
        placeholder={'Enter Here'}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        onFocus={onFocus}
        keyboardType={keyboardType}
        onBlur={onBlur}
        numberOfLines={numberOfLines}
        placeholderTextColor={
          variant === 'dark' ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.4)"
        }
      />
      {type === "password" && (
        <TouchableOpacity
          style={[styles.passBtn, { height: backround ? 60 : 48 }]}
          onPress={() => setShowPass(!showPass)}
        >
          <Feather
            size={18}
            color={colors.title}
            name={showPass ? "eye-off" : "eye"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    ...FONTS.font,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    color: COLORS.white,
  },
  passBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  
});

export default Input;
