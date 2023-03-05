const fs = require('fs')
const path = require('path')
const { createInterface } = require("readline")
const INPUT_DIR =  path.join(__dirname, '../../input')
const OUTPUT_DIR =  path.join(__dirname, '../../output')
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

const readInput = (fileName) => fs.readFileSync(path.join(INPUT_DIR, fileName), 'utf8')

const print = (msg) => console.log(msg)

module.exports = {
  INPUT_DIR,
  OUTPUT_DIR,
  readInput,
  readLineAsync,
  handleErr,
  debug,
  print
}