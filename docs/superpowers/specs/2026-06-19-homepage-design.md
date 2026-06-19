# Homepage — Cinematic Landing Page

**Date:** 2026-06-19  
**File:** `index.html` (replaces current redirect)

## What We're Building

A full-screen cinematic homepage for the Japan Trip 2026 web app, inspired by milli.global. Currently `index.html` just redirects to `japan_trip_2026.html`; this replaces it with a proper landing page.

## Sections

### 1. Hero (100vh, fullscreen)
- Black background
- Kanji 「日本」as ghost watermark, slow pulse animation
- Eyebrow: "JAPAN TRIP 2026" — pink, letter-spaced, fade in at 0.3s
- Title: "JAPAN" — huge bold Manrope 900, slides up from below at 0.5s
- Year: "2 0 2 6" — spaced letters, fades up at 0.8s
- Pink accent line grows in at 1.4s
- Date line: "9 October · Autumn Edition" fades in at 1.6s
- Scroll indicator (animated arrow) at bottom, appears at 2s

### 2. Ticker Tape
- Full-width pink (#ff6b9d) strip, 24px tall
- Scrolling marquee: "✦ Japan Trip 2026 ✦ 9 October 2026 ✦ Countdown Begins"
- Black text on pink background

### 3. Live Countdown
- Target: 9 October 2026 00:00:00 JST (UTC+9)
- Shows: DD : HH : MM : SS — updates every second
- "Until we land in Tokyo" label above
- "Friday · 9 October 2026" label below

### 4. Navigation Grid (3×2)
- 6 minimal icon+label cards on dark background
- Itinerary → japan_trip_2026.html
- Lodging → lodging.html
- Dining → dining.html
- Transport → transportation.html
- Budget → budget.html
- Packing → packing.html
- Hover: bottom border line slides in (pink)

## Tech
- Pure HTML/CSS/JS, no new dependencies
- Font: Manrope (Google Fonts — already used in project)
- Colors: background #000/#09090b, primary #ff6b9d, text #fff
- Countdown timezone: JST (UTC+9)
