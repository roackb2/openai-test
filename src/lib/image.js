const fs = require('fs')
const path = require('path')
const { openai } = require('./core')

const INPUT_DIR =  path.join(__dirname, '../../input')
const OUTPUT_DIR =  path.join(__dirname, '../../output')

const saveResponse = (response, fileName) => {
  console.log(response.data)
  data = response.data.data[0].b64_json;
  console.log(`data: ${data.substring(0, 100)}`)
  const outputPath = path.join(OUTPUT_DIR, fileName)
  
  const buff = new Buffer(data, 'base64');
  fs.writeFileSync(outputPath, buff)
}

const createImage = async (prompt) => {
  const response = await openai.createImage({
    prompt,
    n: 3,
    size: "1024x1024",
  });
  console.log(response.data.data.map(i => i.url))
}

const editImage = async (fileName) => {
  const imgInputPath = path.join(INPUT_DIR, fileName)
  console.log(imgInputPath)
  const file = fs.readFileSync(imgInputPath)
  console.log(`file: ${file.length}`)
  response = await openai.createImageVariation(
    fs.createReadStream(imgInputPath),
    1,
    '1024x1024',
    'b64_json'
  );
  console.log(response.data)
  saveResponse(response, fileName)
}

module.exports = {
  createImage,
  editImage
}