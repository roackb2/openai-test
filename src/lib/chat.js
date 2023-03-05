const { openai } = require('./core')
const {
  readInput,
  readLineAsync,
  handleErr,
  debug,
  print
} = require('./utils')
const { storage } = require('./storage')
const pick = require('lodash/pick')

const genMsg = (role, content) => ({ role, content })

class Assistant {
  constructor(options, instruction) {
    this.instruction = instruction
    this.messages = []
    this.key = options.key
    this.persistent = this.key !== 'none'
    this.input = options.input
  }

  async processMessage(role, content) {
    this.messages.push(genMsg(role, content))
    if (this.persistent) {
      storage.insertMessage(this.key, role, content)
    }
  }

  async processSystemMessage(systemMsg) {
    await this.processMessage("system", systemMsg)
  }

  async processUserMsg() {
    const userMsg = await readLineAsync("You: ")
    if (userMsg === '.editor') {
      let input = ''
      let editorMsg = ''
      print('type .exit to exit editor')
      while (true) {
        input = await readLineAsync('')
        if (input === '.exit') break
        editorMsg += input
      }
      print('exit editor mode')
      await this.processMessage("user", editorMsg)
      return
    }
    print('\n')
    await this.processMessage("user", userMsg)
  }

  async processAssistantMsg(assistantMsg) {
    print(`Assistant: ${assistantMsg}\n`)
    await this.processMessage("assistant", assistantMsg)
  }

  prepareMessages () {
    return this.messages.map(m => pick(m, ['role', 'content']))
  }

  async initChat() {
    if (this.persistent) {
      await storage.connect()
      const prevMsgs = await storage.getMessages(this.key)
      if (prevMsgs.length === 0) {
        await this.processSystemMessage(this.instruction)
      } else {
        this.messages = prevMsgs
      }
    } else {
      await this.processSystemMessage(this.instruction)
    }
  }

  async getAssistantResponse() {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: this.prepareMessages()
    })
    debug(response.data.choices)

    const assistantMsg = response.data.choices[0].message.content
    return assistantMsg
  }

  async chatLoop() {
    try {
      while (true) {
        await this.processUserMsg()
        const assistantMsg = await this.getAssistantResponse()
        await this.processAssistantMsg(assistantMsg)
      }
    } catch (err) {
      handleErr(err)
    }
  }

  async chat() {
    await this.initChat()
    print('type .editor to enter editor mode\n')
    await this.chatLoop()
  }

  async scriptedChat() {
    await this.initChat()
    const content = readInput(this.input)
    await this.processMessage('user', content)
    const assistantMsg = await this.getAssistantResponse()
    await this.processAssistantMsg(assistantMsg)
    await this.chatLoop()
  }
}

const initAssistant = options => {
  const instruction = `You are a considerate personal assistant to your owner named ${process.env.USERNAME}. ` + (process.env.INSTRUCTION || '')
  return new Assistant(options, instruction)
}

const chat = (options) => {
  const assistant = initAssistant(options)
  assistant.chat()
}

const scriptedChat = (options) => {
  const assistant = initAssistant(options)
  assistant.scriptedChat()
}

module.exports = {
  chat,
  scriptedChat
}