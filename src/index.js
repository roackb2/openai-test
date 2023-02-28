const { openai } = require('./lib/core')
const { createImage, editImage } = require('./lib/image')

const main = async () => {
  // const completion = await openai.createCompletion({
  //   model: "text-davinci-002",
  //   prompt: "Hello world",
  // });
  // console.log(completion.data.choices[0].text);
  // await editImage('fienna_1.png')
  console.log(process.argv)
  await createImage(process.argv[2])
}

const run = async () => {
  try {
    await main()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()