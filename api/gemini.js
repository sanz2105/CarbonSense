export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userInput } = req.body;

  // Validate input
  if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
    return res.status(400).json({ error: 'userInput is required' });
  }

  // Cap at 500 characters
  if (userInput.length > 500) {
    return res.status(400).json({ error: 'Input too long. Max 500 characters.' });
  }

  // Strip HTML tags before sending to Gemini
  const sanitized = userInput.replace(/<[^>]*>/g, '').trim();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a carbon footprint coach. The user will describe their daily activities. Give them:
1) A carbon footprint estimate for their day in kg CO₂
2) Their top 2 emission sources
3) Two specific actionable tips to reduce their footprint
Be concise, friendly and encouraging. Format with 3 short sections using emoji headers.

User's day: ${sanitized}`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({
        error: err.error?.message || 'Gemini API error'
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'No response from Gemini' });
    }

    return res.status(200).json({ result: text });

  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
