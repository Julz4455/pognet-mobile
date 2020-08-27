import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, ActivityIndicator, Image } from 'react-native'

export default Item = ({item}) => {
  const [isLoading, setLoading] = useState(true)
  const [author, setAuthor] = useState([])
  const [board, setBoard] = useState([])

  useEffect(() => {
    try {
      fetch(`http://192.168.1.249/api/user/${item._author}`)
        .then(res => res.json())
        .then(json => setAuthor(json))
        .catch(err => console.error(err))
      fetch(`http://192.168.1.249/api/board/${item._board}`)
        .then(res => res.json())
        .then(json => setBoard(json))
        .catch(err => console.error(err))
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
            <Text style={styles.author}>{author.username}</Text>
            { item.hasImage ? (
                <View style={styles.imageContainer}>
                  <Image style={{ width: '100%', height: 100 }} onError={e => console.error(e)} onLoad={() => console.log('Loaded successfully')} source={{ uri: `http://192.168.1.248/${item.image}` }}/>
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
    elevation: 1
  },
  title: {
    fontWeight: '700',
    fontSize: 18
  },
  author: {
    fontWeight: '600',
    fontSize: 12
  },
  board: {
    fontWeight: '600',
    fontSize: 16
  }
})
