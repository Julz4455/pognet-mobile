import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Alert,
  Easing,
  RefreshControl,
  FlatList
} from 'react-native'
import AuthorEmitter from '../emitters/AuthorEmitter'
// import { Emitter } from 'react-native-particles'
import Item from '../subviews/Item'
import { useNavigation } from '@react-navigation/native'
const util = require('util')
const getAuthor = util.promisify(AuthorEmitter.shared.getAuthor)

export default ProfileSheet = () => {
  const [isLoading, setLoading] = useState(true)
  const [author, setAuthor] = useState([])
  const [posts, setPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      fetch(`http://192.168.1.249/api/posts/user/${author.username}`)
        .then(res => res.json())
        .then(json => setPosts(json))
        .catch(err => {
          setPosts([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
          console.error(err)
        })
        .finally(_ => {
          wait(800).then(_ => {
            setRefreshing(false)
          })
        })
    } catch(e) {
      setPosts([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
      console.error(err)
      return;
    }
  }, [])

  useEffect(() => {
    try {
      getAuthor().then(a => {
        console.log(a)
        setAuthor(a)
        fetch(`http://192.168.1.249/api/posts/user/${a.username}`)
          .then(_ => _.json())
          .then(data => setPosts(data))
          .catch(e => {
            setPosts([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
            console.error(e)
          })
          .finally(_ => setLoading(false))
      })
      .catch(e => {
        setPosts([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
        console.error(e)
      })
    } catch(e) {
      setPosts([{ title: 'Couldn\'t load posts.', body: 'Please connect to internet and try again.', hasImage: false, hasVideo: false, tags: ['no', 'connection'], nsfw: false, votes: '10000'}])
      console.error(e)
    }
  }, [])
  LayoutAnimation.easeInEaseOut()
  return (
    <View style={styles.container}>
      { isLoading ? <ActivityIndicator/> : (
        <>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: `http://192.168.1.249/${author.photo}` }} style={styles.pfp}/>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...styles.username, color: author._admin ? '#F15152' : '#000' }}>{author.username}</Text>
              <Text style={styles.scores}>{author._postCount} Post{author._postCount > 1 ? 's' : ''}</Text>
            </View>
          </View>
          <Text style={styles.bio}>{String(author.bio).length > 127 ? String(author.bio).substring(0, 127).trim()+'...' : String(author.bio)}</Text>
          <Text style={{...styles.joined, marginTop: 5 + String(author.bio).length > 127 ? 0 : 40}}>Joined <Text style={styles.joinDate}>{author._epoch}.</Text>{author._admin ? ' They\'re also an admin!' : ''}</Text>

        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    height: 450,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  pfp: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 30,
    fontWeight: '700',
    marginLeft: 12.5,
    marginTop: -6.5,
  },
  bio: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 92.5,
    marginTop: -46.5,
    width: '70%',
    overflow: 'scroll',
    textAlign: 'justify'
  },
  scores: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: '35%',
    marginTop: 5
  },
  admin: {
    fontSize: 14,
    fontWeight: '600',
  },
  joined: {
    marginTop: 5,
    fontWeight: '400',
  },
  joinDate: {
    fontWeight: '800'
  }
})

// {author._admin ? (
//   <>
//     <Emitter
//       numberOfParticles={10}
//       emissionRate={5}
//       interval={5}
//       particleLife={1000}
//       direction={-90}
//       gravity={-0.3}
//       spread={33}
//       fromPosition={{ x: 180, y: 15 }}
//       infiniteLoop={true}
//     >
//       <View style={{ width: 5, height: 5, backgroundColor: '#F15152', borderRadius: 2.5 }}/>
//     </Emitter>
//     <Emitter
//       numberOfParticles={10}
//       emissionRate={5}
//       interval={15}
//       particleLife={1000}
//       direction={-90}
//       gravity={-0.3}
//       spread={33}
//       fromPosition={{ x: 180, y: 15 }}
//       infiniteLoop={true}
//     >
//       <View style={{ width: 5, height: 5, backgroundColor: '#21FA90', borderRadius: 2.5 }}/>
//     </Emitter>
//     <Emitter
//       numberOfParticles={10}
//       emissionRate={5}
//       interval={20}
//       particleLife={1000}
//       direction={-90}
//       gravity={-0.3}
//       spread={33}
//       fromPosition={{ x: 180, y: 15 }}
//       infiniteLoop={true}
//     >
//       <View style={{ width: 5, height: 5, backgroundColor: '#FFBA0B', borderRadius: 2.5 }}/>
//     </Emitter>
//   </>
// ) : (<></>)}
