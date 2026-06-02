---
name: Satomi Cyber-Premium
colors:
  surface: '#131317'
  surface-dim: '#131317'
  surface-bright: '#39393d'
  surface-container-lowest: '#0e0e12'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#2a292e'
  surface-container-highest: '#353439'
  on-surface: '#e5e1e7'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e1e7'
  inverse-on-surface: '#303034'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ecb2ff'
  on-secondary: '#520071'
  secondary-container: '#cf5cff'
  on-secondary-container: '#480063'
  tertiary: '#faf4ff'
  on-tertiary: '#322b4f'
  tertiary-container: '#ddd4ff'
  on-tertiary-container: '#615a81'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f8d8ff'
  secondary-fixed-dim: '#ecb2ff'
  on-secondary-fixed: '#320047'
  on-secondary-fixed-variant: '#74009f'
  tertiary-fixed: '#e6deff'
  tertiary-fixed-dim: '#cac1ed'
  on-tertiary-fixed: '#1d1639'
  on-tertiary-fixed-variant: '#484267'
  background: '#131317'
  on-background: '#e5e1e7'
  surface-variant: '#353439'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

This design system embodies a "Cyber-Premium" aesthetic, specifically tailored for a high-end AI Fintech experience. It merges the precision of institutional finance with the energetic, forward-looking pulse of cyberpunk culture.

The visual narrative is built on **Glassmorphism** and **Retro-Futurism**. We use deep, obsidian-like backgrounds to provide a canvas for vibrant, high-contrast light elements. The emotional response should be one of "powerful intelligence"—the UI feels fast, hyper-modern, and technically superior. 

Key stylistic pillars:
- **Luminosity:** Use of long-exposure light trails and neon glows to guide the eye toward primary actions.
- **Translucency:** UI surfaces utilize frosted glass effects to maintain a sense of depth and layered hierarchy.
- **Precision:** While the colors are bold, the layout and typography remain strictly disciplined and professional.

## Colors

The palette is anchored in a true-dark environment. We avoid pure blacks in favor of deep indigo-tinted neutrals to maintain a sophisticated depth.

- **Primary (Electric Cyan):** Used for critical calls to action, active states, and data visualizations. It represents the "energy" of the AI.
- **Secondary (Neon Magenta):** Used for accents, secondary highlights, and breaking the monotony of the cyan. It adds a "cyber" edge.
- **Surface (Deep Indigo):** The base container color. It provides a softer contrast than pure black, allowing glass effects to pop.
- **Background (Obsidian):** The foundation of the entire UI, ensuring maximum contrast for light-emitting elements.

**Gradients:**
Utilize a primary-to-secondary linear gradient (45 degrees) for high-impact surfaces. Border gradients should be used sparingly on cards to simulate "light leakage" from the edges.

## Typography

Typography balances approachable geometry with technical precision. 

- **Headlines:** We use **Plus Jakarta Sans** for its modern, friendly yet professional curves. Large display headings should occasionally use a primary-to-secondary gradient fill to emphasize premium AI features.
- **Body:** **Manrope** provides exceptional readability for dense financial data and AI-generated text, maintaining a neutral, trustworthy tone.
- **Technical/Labels:** **JetBrains Mono** is used for small labels, status indicators, and numerical data. This monospaced font reinforces the "fintech" and "developer-grade" nature of the product.

**Color Application:** 
Primary Cyan should be reserved for link text and high-priority data points. Secondary Magenta is used for decorative subheaders.

## Layout & Spacing

The layout follows a **Fluid Grid** system with generous safe areas to allow the background glows and light trails room to breathe.

- **Grid Model:** A 12-column grid for desktop with 24px gutters. Elements should be grouped into cards that span 4, 6, or 12 columns.
- **Density:** We prefer a "Spacious" density. High-value AI insights need significant whitespace (margins) to prevent the UI from feeling cluttered.
- **Breakpoints:**
  - **Mobile (<768px):** 4-column grid. Margins shrink to 16px. Typography scales down (use `-mobile` variants).
  - **Tablet (768px - 1024px):** 8-column grid. 32px margins.
  - **Desktop (>1024px):** 12-column grid. Fixed 1280px max-width container centered on the screen.

## Elevation & Depth

Depth is achieved through **Luminous Layers** rather than traditional shadows.

- **Base Level:** The Obsidian background (`#050508`).
- **Mid Level (Cards):** Semi-transparent Deep Indigo surfaces with a 12px backdrop blur. These should have a subtle 1px border (`rgba(255, 255, 255, 0.1)`).
- **Top Level (Modals/Popovers):** Higher transparency glass with a distinct Primary-to-Secondary gradient border (1.5px thickness).
- **Glows:** Use `box-shadow` with high blur radii (30px+) and low opacity (0.2 - 0.4) using the Primary Cyan color to make active elements appear as if they are emitting light onto the surface below.

## Shapes

The shape language is **Refined-Rounded**. We avoid the extreme "pill" shapes of casual apps, opting instead for a 0.5rem (8px) base radius that communicates stability.

- **Standard Elements (Inputs, Buttons):** 8px radius.
- **Large Elements (Cards, Containers):** 16px (rounded-lg) to 24px (rounded-xl) radius.
- **Accent Elements:** Icons or small status tags may use a 4px (soft) radius to feel sharper and more "engineered."

## Components

### Buttons
- **Primary:** Solid Primary Cyan background with Black text. On hover, apply a Cyan outer glow.
- **Secondary:** Transparent background with a 2px Primary-to-Secondary gradient border. White text.
- **Ghost:** No background, Cyan text, subtle Magenta glow on hover.

### Cards
- Always use the glassmorphism effect: `backdrop-filter: blur(12px)`.
- Borders should be subtle, but highlighted with a "light streak" (a brighter segment of the border) on the top-left corner.

### Input Fields
- Dark background (`rgba(0,0,0,0.3)`) with a 1px border.
- On focus, the border transitions to Primary Cyan with a subtle inner glow.
- Labels use **JetBrains Mono** in all-caps.

### Chips & Tags
- Use high-saturation backgrounds at 20% opacity with a 100% opacity text color (e.g., Cyan text on a dark Cyan-tinted chip).

### Data Visualizations
- Lines and bars should utilize the long-exposure light trail effect—using gradients that fade into transparency to imply movement.