import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  LayoutAnimation,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Alert,
  Easing
} from 'react-native'
import AuthorEmitter from '../emitters/AuthorEmitter'
import { Emitter } from 'react-native-particles'
import { useNavigation } from '@react-navigation/native'

export default ProfileSheet = () => {
  const [isLoading, setLoading] = useState(true)
  const [author, setAuthor] = useState([])

  useEffect(() => {
    setAuthor(AuthorEmitter.shared.getAuthor())
    setLoading(false)
  }, [])
  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    height: 450,
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
