import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  Button
} from 'react-native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import Item from '../subviews/Item'
import Constants from 'expo-constants'
import ProfileSheet from '../screens/ProfileSheet'
import { Ionicons } from '@expo/vector-icons'
import RBSheet from "react-native-raw-bottom-sheet";
import AuthorEmitter from '../emitters/AuthorEmitter'
import { getInset } from 'react-native-safe-area-view'

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
          wait(800).then(_ => {
            setRefreshing(false)
          })
        })
    } catch(e) {
      setData([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
      console.error(err)
      return;
    }
  }, [])

  const sheetRef = React.useRef(null);

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
    // console.log(sheetRef.current)
  }, [sheetRef])

  AuthorEmitter.shared.on('authorModal', author => {
    AuthorEmitter.shared.setAuthor(author)
    if(sheetRef.current != null)
      sheetRef.current.open()
  })

  LayoutAnimation.easeInEaseOut()
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          showsHorizontalScrollIndicator={false}
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
      <RBSheet
        ref={sheetRef}
        height={500}
        openDuration={200}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
            backgroundColor: 'transparent'
          },
          draggableIcon: {
            backgroundColor: 'white',
            opacity: 0.8,
            width: 60
          }
        }}>
          <ProfileSheet/>
      </RBSheet>
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
        // cardOverlayEnabled: true,
        // headerStatusBarHeight:
        //   navigation.dangerouslyGetState().routes.indexOf(route) > 0
        //     ? 0
        //     : undefined,
        // ...TransitionPresets.ModalPresentationIOS,
      })}
      // mode="modal"
    >
      <Stack.Screen name="Feed" component={Feed} />
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
