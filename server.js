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
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 120,
      messages: [
        { role: 'system', content: 'Return only JSON with keys: sugar_per_100g, calories_per_100g, confidence. No extra text.' },
        { role: 'user', content: `Food: ${food}. Estimate typical nutrition values per 100g.` },
      ],
    })
    const text = response.choices[0].message.content?.trim() || '{}'
    const data = JSON.parse(text)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'suggestion_failed' })
  }
})

app.post('/api/meals/suggest', async (req, res) => {
  try {
    const mealType = (req.body?.mealType || '').trim()
    const maxSugar = Number(req.body?.maxSugar) || 10
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 400,
      messages: [
        { role: 'system', content: 'You are a nutrition expert. Return ONLY a JSON array. Each item: name (Hebrew), description (Hebrew), sugar_g (number), calories (number). No markdown, no extra text.' },
        { role: 'user', content: `Suggest 4 low-sugar meal ideas for: ${mealType || 'any meal'}. Max sugar per serving: ${maxSugar}g. Family-friendly.` },
      ],
    })
    const text = response.choices[0].message.content?.trim() || '[]'
    const cleaned = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(cleaned)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'meal_suggestion_failed' })
  }
})

app.listen(8787, () => console.log('API listening on http://localhost:8787'))
