const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const main = async () => {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Hello world",
  });
  console.log(completion.data.choices[0].text);
}

const run = async () => {
  try {
    await main()
    process.exit(0)
  } catch (err) {
    console.err(err)
    process.exit(1)
  }
}

run()