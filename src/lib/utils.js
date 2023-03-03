const { createInterface } = require("readline")
const readline = createInterface({
    input: process.stdin,
    output: process.stdout
})
const readLineAsync = msg => {
  return new Promise(resolve => {
    readline.question(msg, userRes => {
      resolve(userRes)
    })
  })
}

const handleErr = (error) => {
  if (error.response) {
    console.log(error.response.status)
    console.log(error.response.data)
  } else {
    console.log(error.message)
  }
}


const debug = (msg) => {
  if (process.env.DEBUG !== 'true') return
  console.debug(msg)
}

const print = (msg) => console.log(msg)

module.exports = {
  readLineAsync,
  handleErr,
  debug,
  print
}