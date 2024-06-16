import { Image } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import Words from './pages/Words';


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
