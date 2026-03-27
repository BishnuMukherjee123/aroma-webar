# Design System Specification: The Sensory Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Sommelier"**

This design system rejects the "utilitarian grid" in favor of a high-end editorial experience. We are not just building a menu; we are creating a digital atmosphere that complements the olfactory and visual experience of fine dining. 

To break the "template" look, we utilize **Intentional Asymmetry**. Overlapping elements—such as an AR dish preview partially obscuring a headline—and dramatic shifts in typography scale (pairing `display-lg` with `label-sm`) create a sense of curated luxury. The goal is "Technological Invisibility": the UI should feel like a whisper, allowing the 3D food assets to be the hero.

---

### 2. Colors & Tonal Depth
Our palette is rooted in the earth and the hearth. We use `surface` (#131313) not as a flat black, but as a deep, infinite canvas.

*   **Primary Accent (`primary` #FFE2AB / `primary_container` #FFBF00):** This is our "Liquid Gold." Use it sparingly for high-intent actions or to highlight "Chef’s Recommendations."
*   **Secondary Accent (`secondary` #FFB59C / `secondary_container` #B73A00):** This terracotta tone triggers appetite. Use it for price tags or nutritional badges.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Use background shifts (e.g., a `surface_container_low` card on a `surface` background) to define boundaries.
*   **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of smoked glass.
    *   *Base:* `surface` (#131313)
    *   *Section:* `surface_container_low` (#1C1B1B)
    *   *Hero Cards:* `surface_container_high` (#2A2A2A)
*   **The Glass & Gradient Rule:** For mobile AR overlays, use Glassmorphism. Apply `surface_container` with a 60% opacity and a `20px` backdrop-blur. For CTAs, apply a subtle linear gradient from `primary_container` (#FFBF00) to `primary_fixed_dim` (#FBBC00) at a 135-degree angle to provide a "metallic" sheen.

---

### 3. Typography
We pair the geometric precision of **Plus Jakarta Sans** for headlines with the highly legible **Inter** for functional data.

| Level | Token | Font | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Plus Jakarta Sans | 3.5rem | Bold, -2% tracking. The "Hero" statement. |
| **Headline**| `headline-md`| Plus Jakarta Sans | 1.75rem | Medium. Used for dish categories. |
| **Title**   | `title-lg`   | Inter | 1.375rem | Semi-bold. Specific dish names. |
| **Body**    | `body-md`    | Inter | 0.875rem | Regular. Descriptions and ingredients. |
| **Label**   | `label-sm`   | Inter | 0.6875rem | All-caps, +5% tracking. Metadata (e.g., CALORIES). |

**Editorial Contrast:** Always pair a `display-lg` title with a `label-sm` category tag nearby. This high-contrast pairing is the hallmark of premium editorial design.

---

### 4. Elevation & Depth
In this system, light doesn't come from a "drop shadow"—it comes from the surface itself.

*   **Tonal Layering:** Avoid shadows for static cards. Instead, use the **Layering Principle**: place a `surface_container_highest` element inside a `surface_container_low` area to create "natural" lift.
*   **Ambient Shadows:** For floating "Add to Cart" buttons, use a shadow: `color: rgba(0,0,0,0.4)`, `blur: 32px`, `y-offset: 12px`. The shadow should be tinted with `surface_tint` at 4% to feel integrated into the dark environment.
*   **The "Ghost Border" Fallback:** If a container sits on an identically colored image, use a `1px` border of `outline_variant` (#504532) at **20% opacity**. It should be felt, not seen.
*   **Roundedness Scale:** Everything is "Smooth."
    *   `lg` (2rem): Primary Menu Cards.
    *   `md` (1.5rem): Buttons and Input Fields.
    *   `full`: Selection chips and "close" icons.

---

### 5. Components

#### Buttons
*   **Primary:** `primary_container` background with `on_primary_container` text. Large `md` corner radius. 
*   **Secondary:** Ghost style. `outline` border (20% opacity) with `primary` text.
*   **Haptic Feedback:** All buttons must feel "heavy." Use a subtle scale-down (0.98x) on press.

#### Cards & Lists
*   **The "No-Divider" Rule:** Never use a horizontal line to separate menu items. Use `spacing-6` (2rem) of vertical white space or a slight background shift to `surface_container_lowest`.
*   **AR Preview Card:** A `surface_variant` container with a `30%` opacity, utilizing `backdrop-filter: blur(12px)`. The 3D model should "break the bounds" of the card, spilling over the top edge.

#### Input Fields (Admin Dashboard)
*   For the light-themed dashboard, use `surface_bright`. 
*   **States:** On focus, the border doesn't just change color; the background shifts to `primary_fixed` at 10% opacity to "glow."

#### Selection Chips
*   Unselected: `surface_container_highest`.
*   Selected: `primary_container` with a high-contrast `on_primary_container` label. No borders.

---

### 6. Do’s and Don’ts

*   **DO:** Use asymmetrical padding. A card might have `spacing-8` on the left and `spacing-4` on the right to create a sense of motion.
*   **DO:** Use the `tertiary_container` (#04DCFF) for technical AR instructions (e.g., "Scan Table"). It separates "Appetite" colors from "Utility" colors.
*   **DON’T:** Use pure #000000. It kills the depth of the 3D food models. Always stick to the `surface` tokens.
*   **DON’T:** Use standard "Close" icons in boxes. Use a floating `full` radius circle with a `surface_container_high` background.
*   **DO:** Prioritize whitespace. If a screen feels "busy," double the spacing using `spacing-12` or `spacing-16`. High-end brands are defined by the space they *don't* use.