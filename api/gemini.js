import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS, MAX_INPUT_CHARS } from '../src/utils/constants.js'

// ── Load .env manually in local dev (Vite middleware doesn't inject env) ───────
function loadEnvIfNeeded() {
  if (process.env.GEMINI_API_KEY) return // already set (Vercel / CI)
  try {
    const envPath = resolve(process.cwd(), '.env')
    const raw = readFileSync(envPath, 'utf-8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // In production (Vercel) .env file won't exist — that's fine
  }
}

const rateLimit = new Map()


function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimit.get(ip) || { count: 0, start: now }
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(ip, { count: 1, start: now })
    return false
  }
  if (entry.count >= RATE_LIMIT_MAX) return true
  rateLimit.set(ip, { ...entry, count: entry.count + 1 })
  return false
}

export default async function handler(req, res) {
  try {
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
        error: 'Too many requests. Please wait a minute.'
      })
    }

    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' })
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Request body missing' })
    }

    const { userInput } = body

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'userInput is required' })
    }

    const sanitized = userInput
      .replace(/<[^>]*>/g, '')
      .trim()
      .slice(0, MAX_INPUT_CHARS)

    loadEnvIfNeeded()
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured. Add GEMINI_API_KEY to Vercel env vars.'
      })
    }

    const prompt = `You are a carbon footprint coach. Respond in EXACTLY this format:

🌍 Your Daily Footprint
[One sentence with total CO₂ estimate in kg]

🔥 Top Emission Sources
1. [Source]: [kg CO₂]
2. [Source]: [kg CO₂]

💡 Two Tips to Reduce Your Impact
1. [Specific actionable tip]
2. [Specific actionable tip]

Be concise but complete. Never cut a sentence short.
Complete all 3 sections fully. Be encouraging and friendly.
User's day: ${sanitized}`

    const models = [
      'gemini-3.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ]

    let lastError = null

    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7
              }
            })
          }
        )

        const responseText = await geminiRes.text()

        if (!geminiRes.ok) {
          let errMsg = `Model ${model} returned ${geminiRes.status}`
          try {
            const errData = JSON.parse(responseText)
            errMsg = errData?.error?.message || errMsg
          } catch {}
          lastError = errMsg
          continue
        }

        let data
        try {
          data = JSON.parse(responseText)
        } catch {
          lastError = 'Invalid JSON from Gemini'
          continue
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (!text) {
          lastError = 'Empty response from model'
          continue
        }

        return res.status(200).json({ 
          result: text,
          model: model
        })

      } catch (modelErr) {
        lastError = modelErr.message
        continue
      }
    }

    return res.status(503).json({
      error: lastError || 'All Gemini models unavailable. Try again later.'
    })

  } catch (outerErr) {
    return res.status(500).json({
      error: 'Internal server error. Please try again.'
    })
  }
}
