import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi} from 'openai';

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: "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",
  // organization: 'org-vbrU3hTXlECrSX54n8HyVWrD',
});

const openai = new OpenAIApi(config);

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" })
})

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    const image = response.data.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" })
  }
})

router.route('/chat').post(async (req, res) => {
  try {
    const { prompt } = req.body;
console.log(prompt);
    const resP = await openai.listEngines()
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0,
    });
    console.log(response.data);
    if(response.data.choices[0].text) {
      res.json({
      message: response.data.choices[0].text
    })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" })
  }
})

export default router;