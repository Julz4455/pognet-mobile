import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons'

export default Media = ({ route, navigation }) => {
  LayoutAnimation.easeInEaseOut()
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    Image.getSize(route.params.image, (w, h) => {
      const dWidth = Dimensions.get('window').width
      const dHeight = Dimensions.get('window').height
      setWidth(`100%`)
      setHeight(`${w > h ? h / dHeight * 100 : '90'}%`)
      setLoading(false)
    }, e => {
      console.error(e)
      setWidth('100%')
      setHeight('35%')
      setLoading(false)
    })
  },[])

  return (
    <View style={styles.container}>
      { isLoading ? <ActivityIndicator/> : (
          <>
            <StatusBar style="auto" />
            <Image style={{ width, height }} onError={e => console.error(e)} onLoad={() => console.log('Loaded successfully')} source={{ uri: `${route.params.image}` }}/>
          </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2f3',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
