export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mimeType } = req.body || {};
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
          {
            type: 'text',
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
      }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    return res.status(502).json({ error: 'Claude API error', detail: errText });
  }

  const data = await response.json();
  const raw = (data.content?.[0]?.text || '').trim();

  try {
    const cleaned = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
    return res.json(JSON.parse(cleaned));
  } catch {
    return res.status(400).json({ error: 'Parse error', raw });
  }
}
