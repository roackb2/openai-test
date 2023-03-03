const path = require('path')
const { open } = require('sqlite')
const { print } = require('./utils')

const STORAGE_PATH = path.join(__dirname, '../../storage/chat.db')

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL
  )
`

class Storage {
  constructor() {

  }

  async connect() {
    this.db = await open(STORAGE_PATH)
    await this.db.exec(CREATE_TABLE)
  }

  async insertMessage(key, role, content) {
    if (!this.db) {
      print('No db connection')
      return
    }
    await this.db.run('INSERT INTO message (key, role, content) VALUES (?, ?, ?)', [key, role, content])
  }

  async getMessages(key) {
    if (!this.db) {
      print('No db connection')
      return
    }
    const messages = await this.db.all('SELECT * FROM message WHERE key = ? ORDER BY id ASC', [key])
    return messages
  }
}

const storage = new Storage()

module.exports = {
  storage
}