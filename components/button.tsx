// import { Animated, Pressable, RegisteredStyle, StyleProp, Text, View, ViewStyle } from "react-native";

// type Props = {
//     text: string,
// };
// export default function AButton(props: {style?: StyleProp<ViewStyle>, title: string}) {
//     const animated = new Animated.Value(1);

//     const fadeIn = () => {
//         Animated.timing(animated, 
//             {
//                 toValue: 0.4,
//                 duration: 100,
//                 useNativeDriver: true
//             }
//         ).start();
//     }

//     const fadeOut = () => {
//         Animated.timing(animated, {
//           toValue: 1,
//           duration: 200,
//           useNativeDriver: true,
//         }).start();
//     };
//     return (
//         <Pressable onPressIn={fadeIn} onPressOut={fadeOut} style={props.style}>
//             <Animated.View
//              style={{
//                 opacity: animated,
//                 // backgroundColor: "red",
//                 // padding: 50,
//                 // borderRadius: 20,
//               }}>
//                 <Text>{title}</Text>
//             </Animated.View>
//         </Pressable>
//     );
// };