export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { day, dayName, date, activities = [] } = req.body || {};

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_AI_API_KEY not configured' });

  const schedule = activities.length
    ? activities.map(a => `  - ${a.start || '??:??'} ${a.detail} → ${a.to || a.city || ''}`).join('\n')
    : '  (ยังไม่มีกิจกรรม)';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a Japan travel expert helping plan a trip to Tokyo in October 2026.

Current Day ${day} itinerary (${dayName || ''}, ${date || ''}):
${schedule}

Suggest exactly 4 additional activities that complement this day's plan. Consider:
- Geographic proximity to existing locations
- Time gaps between existing activities
- Mix of food spots, hidden gems, photo spots, local experiences
- Only real places that exist in Japan with accurate coordinates

Return ONLY a valid JSON array (no markdown, no explanation):
[
  {
    "detail": "Activity description in Thai with emoji at start, max 50 chars",
    "city": "neighborhood/area name in English",
    "emoji": "single emoji",
    "to": "Official place name in English",
    "lat": latitude as number,
    "lng": longitude as number,
    "cost": "admission fee e.g. Free or 1000¥, or empty string",
    "openClose": "e.g. 09:00-17:00 or empty string",
    "dur": "estimated visit duration e.g. 1h or 30m",
    "why": "short reason in Thai why this fits the day, max 45 chars"
  }
]`
          }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1800 }
      })
    }
  );

  if (!response.ok) {
    return res.status(502).json({ error: 'Gemini API error' });
  }

  const data = await response.json();
  const raw = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

  try {
    const cleaned = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
    return res.json(JSON.parse(cleaned));
  } catch {
    return res.status(400).json({ error: 'Parse error', raw });
  }
}
