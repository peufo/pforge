<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---

name: pforge
description: Landing page for a GitHub-powered public roadmap library — warm, technical, indie.

---

# Design System: pforge

## 1. Overview

**Creative North Star: "The Indie Workshop Window"**

A landing page that feels like peering into a busy, friendly workshop — not a corporate showroom. The design borrows from the unpolished confidence of indie maker spaces: warm surfaces, a single bold accent that owns the room, and typography that speaks with technical precision without being cold.

The system rejects generic template aesthetics. Every element should feel intentional, hand-placed, and slightly imperfect in the way that signals human craft. Density is moderate: enough breathing room to feel approachable, enough structure to feel trustworthy.

**Key Characteristics:**

- One bold color carries the visual identity (Committed strategy)
- Single geometric sans-serif family throughout
- Flat surfaces at rest; subtle motion on interaction only
- No card grids, no side-stripe borders, no gradient text
- Indie maker warmth over enterprise polish

## 2. Colors

**The Committed Rule.** One saturated hue owns 30–60% of any given screen. Its confidence is the point — not rarity, not neutrality. The accent is allowed to be loud because everything else stays quiet.

Hue family: deep warm orange-terracotta, anchoring toward the Gumroad/Product Hunt indie spectrum.

### Primary

- **[Deep Terracotta]** ([to be resolved during implementation]): The signature color. Used for CTAs, key highlights, interactive accents, and the hero's dominant visual motif.

### Neutral

- **[Warm Paper]** ([to be resolved during implementation]): Background. Slightly warm off-white, never pure `#fff`.
- **[Charcoal Ink]** ([to be resolved during implementation]): Primary text. Deep warm gray, never pure `#000`.
- **[Soft Clay]** ([to be resolved during implementation]): Secondary surfaces, borders, dividers. Light warm gray with subtle hue shift toward the primary.

## 3. Typography

**Font Direction:** Single geometric sans — technical precision with humanist warmth.

**Character:** Clean, confident, and slightly technical without being sterile. The same family carries both display and body, creating a unified voice. Weight contrast between display (bold) and body (regular/medium) provides hierarchy without introducing a second font.

### Hierarchy

- **Display** (700, [to be resolved during implementation], 1.1): Hero headlines. Short, punchy, commanding.
- **Headline** (600, [to be resolved during implementation], 1.2): Section titles.
- **Title** (500, [to be resolved during implementation], 1.3): Subsection headings, card titles.
- **Body** (400, [to be resolved during implementation], 1.6): Paragraphs, descriptions. Max line length 65–75ch.
- **Label** (500, [to be resolved during implementation], uppercase, 0.05em tracking): Buttons, badges, nav items, microcopy.

## 4. Elevation

Flat by default. Depth is conveyed through tonal layering (background shifts) rather than shadows. On interactive states (hover, focus), a subtle ambient shadow may appear — but only as a response, never at rest.

**The Flat-By-Default Rule.** Surfaces sit flat. Elevation is earned through interaction, not assumed by component type.

## 5. Components

_(Omitted in seed mode — no components exist yet. Re-run `/impeccable document` in scan mode once the first components are built.)_

## 6. Do's and Don'ts

### Do:

- **Do** let the primary color own the hero and main CTA.
- **Do** keep surfaces flat at rest; add subtle shadows only on hover/focus.
- **Do** use weight contrast (700 display vs 400 body) for hierarchy within the single font family.
- **Do** tint every neutral toward the brand hue (chroma 0.005–0.01).
- **Do** favor inline progressive disclosure over modals.

### Don't:

- **Don't** use a card grid of identical icon + heading + text blocks.
- **Don't** use gradient text, side-stripe borders, or glassmorphism.
- **Don't** use the hero-metric template (big number, small label, gradient accent).
- **Don't** use a generic blog/template WordPress aesthetic — no sidebar clutter, no stock-photo hero, no floating social widgets.
- **Don't** use dark mode as default "because it's tech."
- **Don't** animate layout properties (width, height, top, left).
- **Don't** use pure `#000` or `#fff` anywhere.
