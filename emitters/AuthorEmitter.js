import EventEmitter from 'events'

export let author

export default class AuthorEmitter extends EventEmitter {
  setAuthor(auth) {
    author = auth
  }
  getAuthor() {
    return author
  }
}

AuthorEmitter.shared = new AuthorEmitter()
