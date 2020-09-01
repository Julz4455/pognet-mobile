import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Alert,
  Easing
} from 'react-native'
import Animated from 'react-native-reanimated'
import BottomSheet from 'reanimated-bottom-sheet'
import ZoomImage from '../screens/ZoomImage'
import { Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import AuthorEmitter from '../emitters/AuthorEmitter'

export default Item = ({item}) => {
  const navigation = useNavigation()
  const [isLoading, setLoading] = useState(true)
  const [author, setAuthor] = useState([])
  const [board, setBoard] = useState([])

  const sheetRef = React.useRef(null);

  useEffect(() => {
    try {
      fetch(`http://192.168.1.249/api/user/${item._author}`)
        .then(res => res.json())
        .then(json => setAuthor(json))
        .catch(err => {
          setAuthor([{ username: 'No Internet Connection', photo: null }])
          console.error(err)
        })
      fetch(`http://192.168.1.249/api/board/${item._board}`)
        .then(res => res.json())
        .then(json => setBoard(json))
        .catch(err => {
          setBoard([{ displayName: 'No_Internet' }])
          console.error(err)
        })
        .finally(_ => setLoading(false))
    } catch(e) {
      console.log(e)
      return;
    }
  }, [])

  LayoutAnimation.easeInEaseOut()
  return (
    <View>
      { isLoading ? <ActivityIndicator/> : (
          <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.board}>p!{board.displayName}</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => AuthorEmitter.shared.emit('authorModal', author)}>
              <Text style={styles.author}>{author.username}</Text>
            </TouchableWithoutFeedback>
            { item.hasImage ? (
                <View style={styles.mediaContainer}>
                  <ZoomImage
                    source={{ uri: `http://192.168.1.249/${item.image}` }}
                    imgStyle={{ width: '100%', height: 230, borderRadius: 8, marginVertical: 5, marginTop: 15 }}
                    enableScaling={false}
                    easingFunc={Easing.cubic}
                    rebounceDuration={1000}
                    post={item}
                    author={author}
                    board={board}
                  />
                  <Text>{item.body}</Text>
                </View>
              ) : (
                <View style={{ marginTop: 5 }}>

                  <Text>{item.body}</Text>
                </View>
              )
            }
          </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 15,
    borderRadius: 8,
    shadowColor: '#444',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 20
  },
  author: {
    fontWeight: '600',
    fontSize: 14
  },
  board: {
    fontWeight: '600',
    fontSize: 16
  }
})
