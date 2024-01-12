import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi} from 'openai';


dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.TOKEN
});

const openai = new OpenAIApi(config);

router.route('/').get((req, res) => {
  console.log(process.env.TOKEN);
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
  const { prompt } = req.body;
  try {
    const resp = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt}
        ]  
    })           
        
    res.status(200).json({message: resp.data.choices[0].message.content})
  } catch(e) {
      res.status(400).json({message: e.message})
  }
})

export default router;