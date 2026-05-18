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
      <View style={styles.pill} />
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.closeText}>{closeText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  pill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.12)",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Lato-SemiBold",
    fontSize: 15,
    color: "#1E123D",
  },
  closeText: {
    fontFamily: "Lato-Medium",
    fontSize: 14,
    color: "#595959",
  },
});

export default BottomSheetHeader;
