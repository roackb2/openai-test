const { openai } = require('./core')
const {
  readLineAsync,
  handleErr,
  debug
} = require('./utils')

const genMsg = (role, content) => ({ role, content })
const genSystemMsg = (content) => genMsg("system", content)
const genAssistantMsg = (content) => genMsg("assistant", content)
const genUserMsg = (content) => genMsg("user", content)

const messages = [
  genSystemMsg('You are a considerate personal assistant.')
]

const chat = async () => {
  try {
    let userMsg = ''
    while (true) {
      userMsg = await readLineAsync("You: ")
      messages.push(genUserMsg(userMsg))
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages
      });
    
      debug(response.data.choices)
      const assistantMsg = response.data.choices[0].message.content
      console.log(assistantMsg)
      messages.push(genAssistantMsg(assistantMsg))
      debug(messages)
    }
  } catch (error) {
    handleErr(error)
  }
}

module.exports = {
  chat
}