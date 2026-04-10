import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })
  
  try {
    const food = (req.body?.food || "").trim()
    if (!food) return res.status(400).json({ error: "food is required" })

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 120,
      messages: [
        { role: "system", content: "Return only JSON with keys: sugar_per_100g, calories_per_100g, confidence. No extra text." },
        { role: "user", content: `Food: ${food}. Estimate typical nutrition values per 100g.` },
      ],
    })

    const text = response.choices[0].message.content?.trim() || "{}"
    const data = JSON.parse(text)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "suggestion_failed" })
  }
}
