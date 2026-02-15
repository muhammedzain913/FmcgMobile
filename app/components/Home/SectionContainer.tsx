import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";

interface SectionContainerProps {
  children: ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ children }) => {
  return (
    <View style={[GlobalStyleSheet.container, styles.container ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});

export default SectionContainer;
