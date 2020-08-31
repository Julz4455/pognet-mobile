const EventEmitter = require('events')

let author

class AuthorEmitter extends EventEmitter {
  setAuthor(auth) {
    author = auth
  }
  getAuthor() {
    return author
  }
}

AuthorEmitter.shared = new AuthorEmitter()

module.exports = AuthorEmitter
