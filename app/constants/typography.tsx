import { TextStyle } from "react-native";

export const Typography: Record<string, TextStyle> = {
  titleMedium: {
    fontFamily: "Lato-Medium",
    fontSize: 13,
    lineHeight: 32,
    letterSpacing: -0.48, // -3%
  },
  headerText : {
    fontFamily : 'Lato-Bold',
     fontSize: 16, // override if needed
  }
  
};
