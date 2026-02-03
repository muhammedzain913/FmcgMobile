import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView, Animated, Vibration, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface DropdownMenuProps {
  visible: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  dropdownWidth?: number;
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  handleOpen,
  handleClose,
  trigger,
  children,
  dropdownWidth = 150,
}) => {
  const triggerRef = useRef<View>(null);
  const [position, setPosition] = useState({x: 0, y: 0, width: 0});
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      slideAnim.setValue(0);
      fadeAnim.setValue(0);
      
      // Start animations when dropdown opens
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset when closing
      slideAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    if (triggerRef.current && visible) {
      // Use measureInWindow for accurate positioning relative to screen
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setPosition({
          x: x,
          y: y + height + 4, // Add 4px gap below trigger
          width: width,
        });
      });
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0], // Slide down from 10px above
  });

  const handleOpenWithFeedback = () => {
    // Add haptic feedback when opening dropdown
    if (Platform.OS === 'ios') {
      // Light impact feedback for iOS
      Vibration.vibrate(10);
    } else {
      // Short vibration for Android
      Vibration.vibrate(50);
    }
    
    // Add press animation
    Animated.sequence([
      Animated.timing(pressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    handleOpen();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handleOpenWithFeedback}>
        <View ref={triggerRef}>
          <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
            {trigger}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      {visible && (
        <Modal
          transparent={true}
          visible={visible}
          animationType="fade"
          onRequestClose={handleClose}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.menu,
                  {
                    top: position.y,
                    left: position.x,
                    width: position.width || wp("90%"),
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                  },
                ]}>
                {children}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',

  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height : 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    maxHeight: hp('50%'), // Limit max height to prevent overflow
  },
  menuOption: {
    padding: 5,
  },
});