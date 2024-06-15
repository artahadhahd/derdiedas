import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from './pages/Home';
import Words from './pages/Words';
import AsyncStorage from '@react-native-async-storage/async-storage';


// const Stack = createNativeStackNavigator();


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{tabBarActiveBackgroundColor: '#eee', headerShown: false}}>
        <Tab.Screen options={
          {
            tabBarIcon: ({focused, color, size}) => {
              return <Image source={require('./assets/dumbbell.png')} style={{width: size, height: size}} />
            },
          }
        } name="Train" component={Home} />

        <Tab.Screen options={
          {
            tabBarIcon: ({focused, color, size}) => {
              return <Image source={require('./assets/book.png')} style={{width: size, height: size}} />
            }
          }
        } name="Words" component={Words} />

      </Tab.Navigator>
    </NavigationContainer>
  )
}



// export default function App() {
//   return (
//     // <View style={styles.container}>
//     //   <Text>Open up App.tsx to start working on your app!</Text>
//     //   <StatusBar style="auto" />
//     // </View>
//     <>
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="words" component={Words}/>
//           <Stack.Screen name="Home" component={Home}/>
//         </Stack.Navigator>
//       </NavigationContainer>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
