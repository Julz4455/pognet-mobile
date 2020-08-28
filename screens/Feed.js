import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  LayoutAnimation
} from 'react-native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Media from './Media'
import Item from '../subviews/Item'
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons'


const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

Feed = () => {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      fetch('http://192.168.1.249/api/posts/all')
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => {
          setData([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
          console.error(err)
        })
        .finally(_ => {
          wait(500).then(_ => {
            setRefreshing(false)
          })
        })
    } catch(e) {
      setData([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
      console.error(err)
      return;
    }
  }, [])

  useEffect(() => {
    try {
      fetch('http://192.168.1.249/api/posts/all')
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => {
          setData([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
          console.error(err)
        })
        .finally(_ => setLoading(false))
    } catch(e) {
      setData([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
      console.error(err)
      return;
    }
  }, [])
  LayoutAnimation.easeInEaseOut()
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing}
            onRefresh={onRefresh}/>
          }
          data={data}
          keyExtractor={({ _id }, index) => _id}
          renderItem={({ item }) => {
            return (
              <Item item={item}/>
            )
          }}
        />
      )}
    </View>
  )
}

const Stack = createStackNavigator()

export default FeedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight:
          navigation.dangerouslyGetState().routes.indexOf(route) > 0
            ? 0
            : undefined,
        ...TransitionPresets.ModalPresentationIOS,
      })}
      mode="modal"
    >
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="Media" component={Media} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2f3',
    paddingHorizontal: 15,
    paddingTop: Constants.statusBarHeight
  },
})
