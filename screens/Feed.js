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
import Item from '../subviews/Item'
import Constants from 'expo-constants'


const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export default Feed = () => {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      fetch('http://192.168.1.249/api/posts/all')
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error(err))
        .finally(_ => {
          wait(500).then(_ => {
            setRefreshing(false)
          })
        })
    } catch(e) {
      console.log(e)
      return;
    }
  }, [])

  useEffect(() => {
    try {
      fetch('http://192.168.1.249/api/posts/all')
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error(err))
        .finally(_ => setLoading(false))
    } catch(e) {
      console.log(e)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2f3',
    paddingHorizontal: 15,
    paddingTop: Constants.statusBarHeight
  },
})
