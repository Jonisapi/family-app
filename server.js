import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
app.use(cors())
app.use(express.json())

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post('/api/nutrition/suggest', async (req, res) => {
  try {
    const food = (req.body?.food || '').trim()
    if (!food) return res.status(400).json({ error: 'food is required' })

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_output_tokens: 120,
      input: [
        {
          role: 'system',
          content:
            'Return only JSON with keys: sugar_per_100g, calories_per_100g, confidence. No extra text.',
        },
        {
          role: 'user',
          content: `Food: ${food}. Estimate typical nutrition values per 100g.`,
        },
      ],
    })

    const text = response.output_text?.trim() || '{}'
    const data = JSON.parse(text)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'suggestion_failed' })
  }
})

app.listen(8787, () => {
  console.log('API listening on http://localhost:8787')
})