import React from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ImageStyle,
} from "react-native";

export type GroceryGifLoaderProps = {
  visible: boolean;
  /** Override asset; defaults to groceryanimation1.gif */
  source?: ImageSourcePropType;
  backdropStyle?: StyleProp<ViewStyle>;
  gifStyle?: StyleProp<ImageStyle>;
};

const DEFAULT_GIF = require("../../assets/images/icons/groceryanimation1.gif");

/**
 * Full-screen loading overlay with a centered GIF.
 * Reusable: pass a different `source` when you need another animation.
 */
const GroceryGifLoader: React.FC<GroceryGifLoaderProps> = ({
  visible,
  source = DEFAULT_GIF,
  backdropStyle,
  gifStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={[styles.backdrop, backdropStyle]} pointerEvents="box-none">
        <Image
          source={source}
          style={[styles.gif, gifStyle]}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: 200,
    height: 200,
  },
});

export default GroceryGifLoader;
