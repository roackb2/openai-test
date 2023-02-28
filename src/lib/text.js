const { openai } = require('./core')

const textCompletion = async (prompt) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
  });
  console.log(completion.data.choices[0].text);
}

module.exports = {
  textCompletion
}