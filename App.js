import * as React from 'react'
import FeedStack from './screens/Feed'
import { View, Text, DevSettings } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import AuthorEmitter from './emitters/AuthorEmitter'

const Tab = createBottomTabNavigator()

Settings = () => {
  return (
    <View style={{ padding: 24, backgroundColor: '#f5f2f3' }}>
      <Text>Hello, X!</Text>
    </View>
  )
}

export default App = () => {
  React.useEffect(() => {
    AuthorEmitter.shared.removeAllListeners('authorModal')
  }, [])
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if(route.name == 'Feed') {
              iconName = 'ios-albums'
            } else if(route.name == 'Settings') {
              iconName = 'ios-cog'
              size += 5
            }

            size += 7.5
            return <Ionicons name={iconName} size={size} color={color} />
          },
        })}
        tabBarOptions={{
          activeTintColor: '#F15152',
          inactiveTintColor: 'gray',
          showLabel: false
        }}>
        <Tab.Screen name="Feed" component={FeedStack} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
