```markdown
# Design System Specification: The Zen Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Ryokan."** 

We are moving away from the cluttered, grid-locked density of standard travel apps. Instead, we embrace a high-end editorial experience that mirrors the Japanese aesthetic of *Ma* (negative space). This system is not just a tool; it is a calm, curated journey. We break the "template" look by utilizing intentional asymmetry—where images might bleed off-canvas while text remains strictly inset—and high-contrast typography scales that prioritize legibility and breathability over information density. The result is a UI that feels organic, organized, and deeply premium.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Paper and Ink" philosophy. We use `surface` and `neutral` tones to simulate high-quality stationery, with `primary` (#ac2a5d) and `tertiary` (#705d00) acting as delicate stamps or silk-thread accents.

### The "No-Line" Rule
**Borders are strictly prohibited for sectioning.** To define a new content area, you must use a background color shift. For example, a travel itinerary card (`surface-container-lowest`) should sit on a background of `surface-container-low`. The boundary is felt through the change in tone, not seen through a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of fine washi paper. 
- **Base Layer:** `surface` (#f9f9f9)
- **Secondary Sections:** `surface-container` (#eeeeee)
- **Floating Interactive Elements:** `surface-container-lowest` (#ffffff)
- **Overlay/Action Layers:** `surface-container-highest` (#e2e2e2)

### The Glass & Gradient Rule
To provide "soul" to the minimalist aesthetic:
- **Glassmorphism:** Use `surface-container-lowest` at 70% opacity with a `backdrop-blur` of 20px for top navigation bars and floating action menus.
- **Signature Gradients:** For primary Call-to-Actions (CTAs), use a subtle linear gradient from `primary` (#ac2a5d) to `primary_container` (#ff6b9d). This creates a soft, glowing depth that mimics a cherry blossom petal.

---

## 3. Typography
The typography is the architecture of this system. We use a sophisticated mix of **Manrope** for structural headings and **Public Sans** for a contemporary, utilitarian body feel.

*   **Display (Manrope):** Use `display-lg` (3.5rem) for hero destination names. The tight tracking and large scale create an authoritative, editorial "magazine" feel.
*   **Headlines (Manrope):** `headline-md` (1.75rem) should be used for section titles (e.g., "Day 1: Kyoto").
*   **Body (Public Sans):** `body-lg` (1rem) is the workhorse. Ensure a line-height of 1.6 to maintain the "calm" brand pillar.
*   **Labels (Inter):** `label-md` (0.75rem) in all-caps with 0.05rem letter-spacing should be used for metadata like "4 MINS WALK" or "BUDGET."

The hierarchy relies on extreme scale contrast—pairing a very large Display header with a very small, spaced-out Label—to create a signature premium look.

---

## 4. Elevation & Depth
We eschew traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A card in `surface-container-lowest` (pure white) placed on a `surface-container-low` background creates a natural, soft lift.
*   **Ambient Shadows:** If an element must float (like a "Book Now" FAB), use a shadow with a blur of `32px`, an opacity of `6%`, and a color derived from `on-surface` (#1a1c1c). This mimics natural diffused sunlight.
*   **The Ghost Border:** If accessibility requires a container edge (e.g., in a high-glare environment), use the `outline-variant` token at **15% opacity**. Never use 100% opaque lines.
*   **Negative Depth:** Use `surface-dim` (#dadada) for inset elements like search bars to create a "carved" effect into the paper-like UI.

---

## 5. Components

### Buttons
*   **Primary:** A rounded-full (`9999px`) pill using the signature gradient (`primary` to `primary_container`). Text is `on-primary` (#ffffff).
*   **Secondary:** `surface-container-high` background with `primary` text. No border.
*   **Tertiary:** Transparent background with `primary` text and an underline offset by `spacing-1`.

### Cards & Lists
*   **The Content Block:** Cards must use `rounded-xl` (1.5rem). 
*   **Anti-Divider Rule:** Forbid 1px horizontal dividers. Separate list items using `spacing-4` (1.4rem) of vertical white space or by alternating background tones between `surface-container-low` and `surface-container-lowest`.

### Input Fields
*   **Style:** Minimalist underline or soft-filled. Use `surface-container` with a `rounded-md` (0.75rem) top-only corner radius. 
*   **Focus State:** Transition the background to `surface-container-highest` and add a subtle `primary` glow (20% opacity).

### Specialized Travel Components
*   **The Timeline Rail:** Use a vertical `tertiary` (#705d00) line at 10% opacity to connect itinerary stops. The "dots" should be `primary` circles with a `surface` outer ring.
*   **Immersive Hero:** A full-bleed image container with a `surface` gradient overlay at the bottom to ensure `display-lg` typography remains legible.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., more padding on the left than the right) for editorial layouts.
*   **Do** use `spacing-12` (4rem) or `spacing-16` (5.5rem) between major sections to let the design breathe.
*   **Do** utilize `primary_container` (#ff6b9d) for soft, high-lighted moments like "Current Day" or "Selected Date."

### Don't
*   **Don't** use black (#000000). Use `on-surface` (#1a1c1c) for text to maintain a softer, premium contrast.
*   **Don't** use standard `rounded-sm`. The system's "calm" nature requires `md` (0.75rem) or higher for almost all containers.
*   **Don't** cram information. If a screen feels full, move content to a "Surface-Container-Highest" nested modal or a new page.
*   **Don't** use heavy icons. Use thin-stroke (1px or 1.5px) icons to match the light-weight typography.

---

## 7. Spacing Scale Reference
*   **Micro (0.5 - 1.5):** For internal component spacing (e.g., Icon to Text).
*   **Modular (2 - 4):** For content grouping within a card.
*   **Macro (8 - 24):** For section-to-section breathing room. **Always lean toward the higher end of the scale to preserve the "Zen" identity.**```