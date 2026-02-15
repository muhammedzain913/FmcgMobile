import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BottomSheetHeaderProps {
  title: string;
  onClose: () => void;
  closeText?: string;
}

const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({
  title,
  onClose,
  closeText = "Close",
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
      >
        <Text style={styles.closeText}>{closeText}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  closeButton: {
    position: "relative",
    paddingTop: 16,
  },
  closeText: {
    fontFamily: "Lato-Medium",
    fontSize: 14,
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  title: {
    fontFamily: "Lato-SemiBold",
    fontSize: 15,
    lineHeight: 20,
  },
});

export default BottomSheetHeader;
