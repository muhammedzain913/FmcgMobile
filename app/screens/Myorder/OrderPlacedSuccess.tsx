// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, Image } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import { StackScreenProps } from "@react-navigation/stack";
// import { RootStackParamList } from "../../navigation/RootStackParamList";

// type OrderPlacedSuccessScreenProps = StackScreenProps<
//   RootStackParamList,
//   "OrderPlacedSuccess"
// >;

// const OrderPlacedSuccess = ({ navigation }: OrderPlacedSuccessScreenProps) => {
//   // Auto-navigate to Home after 4 seconds

//   return (
//     <SafeAreaView style={styles.container} edges={[]}>
//       <StatusBar style="dark" />

//       <View style={styles.container}>
//         {/* Base gradient */}
//         <LinearGradient
//           colors={["#E7E2FF", "#FFF1D6", "#DFF4FF"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={StyleSheet.absoluteFill}
//         />

//         {/* Purple soft blob */}
//         <LinearGradient
//           colors={[
//             "rgba(180,255,200,0.35)",
//             "rgba(180,255,200,0.2)",
//             "rgba(180,255,200,0.05)",
//             "rgba(180,255,200,0)",
//           ]}
//           locations={[0, 0.3, 0.55, 0.75, 1]}
//           style={styles.purpleBlob}
//           start={{ x: 0.3, y: 0.3 }}
//           end={{ x: 1, y: 1 }}
//         />

//         {/* Yellow soft blob */}
//         <LinearGradient
//           colors={[
//             "rgba(255,220,150,0.35)",
//             "rgba(255,220,150,0.2)",
//             "rgba(255,220,150,0.05)",
//             "rgba(255,220,150,0)",
//           ]}
//           style={styles.yellowBlob}
//         />

//         {/* Green soft blob */}
//         <LinearGradient
//           colors={[
//             "rgba(180,255,200,0.35)",
//             "rgba(180,255,200,0.2)",
//             "rgba(180,255,200,0.05)",
//             "rgba(180,255,200,0)",
//           ]}
//           style={styles.greenBlob}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default OrderPlacedSuccess;

// const styles = StyleSheet.create({
//   gradient: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   iconContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 40,
//   },
//   successIcon: {
//     width: 99,
//     height: 99,
//     borderRadius: 24, // Rounded square (squircle) with soft corners
//     justifyContent: "center",
//     alignItems: "center",
//     // 3D shadow effect
//     shadowColor: "#4CAF50",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   checkmark: {
//     fontSize: 60,
//     color: "#FFFFFF",
//     fontWeight: "bold",
//     fontFamily: "Lato-Bold",
//   },
//   textContainer: {
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#000000",
//     textAlign: "center",
//     marginBottom: 12,
//     fontFamily: "Lato-Bold",
//     letterSpacing: -0.3,
//   },
//   subtitle: {
//     fontSize: 16,
//     fontWeight: "400",
//     color: "#666666",
//     textAlign: "center",
//     fontFamily: "Lato-Regular",
//     lineHeight: 22,
//   },

//   container: {
//     flex: 1,
//   },

//   purpleBlob: {
//     position: "absolute",
//     width: 700,
//     height: 700,
//     top: -250,
//     right: -250,
//     borderRadius: 700,
//     opacity: 0.7,
//   },

//   yellowBlob: {
//     position: "absolute",
//     width: 450,
//     height: 450,
//     top: 100,
//     left: -200,
//     borderRadius: 500,
//     opacity: 0.6,
//     transform: [{ scale: 1.2 }],
//   },

//   greenBlob: {
//     position: "absolute",
//     width: 500,
//     height: 500,
//     bottom: -150,
//     right: -200,
//     borderRadius: 500,
//     opacity: 0.6,
//     transform: [{ scale: 1.2 }],
//   },
// });

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const SoftBlob = ({ color, style }: { color: string; style: any }) => {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("DrawerNavigation", {
        screen: "BottomNavigation",
        params: {
          screen: "Home",
        },
      });
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={style}>
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <Stop offset="40%" stopColor={color} stopOpacity="0.2" />
            <Stop offset="70%" stopColor={color} stopOpacity="0.07" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
};

const OrderPlacedSuccess = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Background Base Color */}
      <View style={styles.baseBackground} />

      {/* Soft Blobs */}
      <SoftBlob color="#8C78FF" style={styles.purpleBlob} />

      <SoftBlob color="#FFDCA0" style={styles.yellowBlob} />

      <SoftBlob color="#B4FFC8" style={styles.greenBlob} />

      {/* Optional subtle noise overlay to remove banding completely */}
      <View style={styles.noiseOverlay} />

      {/* Content Example */}
      <View style={styles.content}>
        <Image
          style={{ width: 120, height: 120 }}
          source={require("../../assets/images/icons/ordersuccess.png")}
        />
        <Text style={styles.title}>Order Successfully Placed!</Text>
        <Text style={styles.subtitle}>Thank you for shopping from us.</Text>
      </View>
    </SafeAreaView>
  );
};

export default OrderPlacedSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F9",
  },

  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F6F5F9",
  },

  purpleBlob: {
    position: "absolute",
    width: 900,
    height: 900,
    top: -350,
    right: -350,
  },

  yellowBlob: {
    position: "absolute",
    width: 800,
    height: 800,
    top: 100,
    left: -300,
  },

  greenBlob: {
    position: "absolute",
    width: 900,
    height: 900,
    bottom: -350,
    right: -300,
  },

  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.02)",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },

  title: {
    fontSize: 24,
    fontFamily: "Lato-Bold",
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: "#666",
    textAlign: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
});
