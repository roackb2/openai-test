const { openai } = require('./core')
const {
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

  async chat() {
    await this.initChat()
    try {
      while (true) {
        await this.processUserMsg()

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: this.prepareMessages()
        })
        debug(response.data.choices)

        const assistantMsg = response.data.choices[0].message.content
        await this.processAssistantMsg(assistantMsg)
      }
    } catch (err) {
      handleErr(err)
    }
  }
}

const chat = (options) => {
  const instruction = `You are a considerate personal assistant to your owner named ${process.env.USERNAME}. ` + (process.env.INSTRUCTION || '')
  const assistant = new Assistant(options, instruction)
  assistant.chat()
}

module.exports = {
  chat
}