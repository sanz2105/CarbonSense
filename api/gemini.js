const rateLimit = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX = 5

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimit.get(ip) || { count: 0, start: now }
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, start: now })
    return false
  }
  if (entry.count >= RATE_LIMIT_MAX) return true
  rateLimit.set(ip, { ...entry, count: entry.count + 1 })
  return false
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             'unknown'

  if (isRateLimited(ip)) {
    return res.status(429).json({ 
      error: 'Too many requests. Please wait a minute before trying again.' 
    })
  }

  const { userInput } = req.body || {}

  if (!userInput || userInput.trim().length === 0) {
    return res.status(400).json({ error: 'userInput is required' })
  }

  const sanitized = userInput.replace(/<[^>]*>/g, '').trim().slice(0, 500)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'API key not configured.' 
    })
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a carbon footprint coach. The user will 
describe their daily activities. Give them:
1) A carbon footprint estimate for their day in kg CO₂
2) Their top 2 emission sources
3) Two specific actionable tips to reduce their footprint
Be concise, friendly and encouraging. Format with 3 short 
sections using emoji headers.

User's day: ${sanitized}`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.7
          }
        })
      }
    )

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}))
      return res.status(geminiRes.status).json({ 
        error: errData?.error?.message || `Gemini API error ${geminiRes.status}` 
      })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return res.status(500).json({ error: 'Empty response from Gemini' })
    }

    return res.status(200).json({ result: text })

  } catch (err) {
    return res.status(500).json({ 
      error: 'Failed to reach Gemini API.' 
    })
  }
}
