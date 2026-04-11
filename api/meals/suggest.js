export const config = { runtime: "nodejs" }

export default async function handler(req, res) {
  const { default: OpenAI } = await import("openai")
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  try {
    const mealType = (req.body?.mealType || "").trim()
    const maxSugar = Number(req.body?.maxSugar) || 10

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 400,
      messages: [
        { role: "system", content: "You are a nutrition expert. Return ONLY a JSON array. Each item: name (Hebrew), description (Hebrew), sugar_g (number), calories (number). No markdown." },
        { role: "user", content: `Suggest 4 low-sugar meal ideas for: ${mealType || "any meal"}. Max sugar: ${maxSugar}g.` },
      ],
    })

    const text = response.choices[0].message.content?.trim() || "[]"
    const cleaned = text.replace(/```json|```/g, "").trim()
    const data = JSON.parse(cleaned)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
}
