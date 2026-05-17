export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mimeType } = req.body || {};
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_AI_API_KEY not configured' });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
            {
              text: `Analyze this image (Google Maps screenshot, Instagram, travel blog, etc.) and extract the main location.
Return ONLY a valid JSON object, no markdown, no explanation:
{
  "name": "place name in English",
  "nameTH": "place name in Thai (translate if needed)",
  "city": "neighborhood or district name",
  "address": "full address if visible",
  "lat": latitude as number (estimate from known geography if not shown),
  "lng": longitude as number (estimate from known geography if not shown),
  "category": "tourist_attraction|restaurant|hotel|transport|shopping|nature|activity",
  "emoji": "single most fitting emoji for this place type",
  "openClose": "opening hours if visible e.g. 09:00-17:00, or empty string",
  "cost": "admission cost if visible e.g. Free or 2200¥, or empty string"
}
If you cannot identify a location from this image, return: {"error": "Cannot identify location"}`
            }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 700 }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    return res.status(502).json({ error: 'Gemini API error', detail: errText });
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
