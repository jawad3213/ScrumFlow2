# 💎 ZERO-HALLUCINATION DESIGN SPECIFICATION
> **INSTRUCTIONS**: This is the "Source of Truth" for the AI. Fill in the [`VALUES`] inside brackets. If a section is left vague, the AI will default to "Standard Modern SaaS" practices.
> **RULE**: Do NOT remove sections. Only fill them in.

---

## 1. COLOR DNA (The Physics of Light) 🎨
**Rule**: Provide HEX or HSL values. Avoid vague terms like "Blue".

### Core Palette
*   **Background (Canvas)**: [`HEX_VALUE`] (e.g., #09090b)
*   **Surface (Cards/Panels)**: [`HEX_VALUE`] (e.g., #18181b)
*   **Surface Highlight (Hover)**: [`HEX_VALUE`] (e.g., #27272a)
*   **Foreground (Main Text)**: [`HEX_VALUE`] (e.g., #fafafa)
*   **Muted Foreground (Subtext)**: [`HEX_VALUE`] (e.g., #a1a1aa)

### Brand Identity
*   **Primary (Action/Brand)**: [`HEX_VALUE`] (e.g., #6366f1 Indigo)
*   **Primary Glow/Shadow**: [`HEX_VALUE + OPACITY`] (e.g., rgba(99, 102, 241, 0.5))
*   **Secondary (Accents)**: [`HEX_VALUE`]
*   **Tertiary (Optional)**: [`HEX_VALUE`]

### Gradients (If applicable)
*   **Gradient Direction**: [`DEGREE`] (e.g., to bottom right)
*   **Stop 1 (Start)**: [`HEX_VALUE`]
*   **Stop 2 (End)**: [`HEX_VALUE`]
*   **Noise Texture Overlay**: [`YES/NO`] (Do you want a grain texture over gradients?)

### Semantic Status
*   **Success**: [`HEX_VALUE`] (e.g., #22c55e)
*   **Error/Destructive**: [`HEX_VALUE`] (e.g., #ef4444)
*   **Warning**: [`HEX_VALUE`] (e.g., #eab308)
*   **Info**: [`HEX_VALUE`] (e.g., #3b82f6)

---

## 2. TYPOGRAPHY ARCHITECTURE (The Voice) 🗣️
**Rule**: Specify the exact Google Font or System Font stack and weights.

### Font Families
*   **Headings (Display)**: [`FONT_NAME`] (e.g., Outfit, Space Grotesk)
*   **Body (UI/Reading)**: [`FONT_NAME`] (e.g., Inter, DM Sans)
*   **Code/Technical**: [`FONT_NAME`] (e.g., JetBrains Mono)

### Weights & Hierarchy
*   **H1 (Page Title)**: [`SIZE_PX`] / [`WEIGHT`] (e.g., 32px / 700 Bold)
*   **H2 (Section Request)**: [`SIZE_PX`] / [`WEIGHT`] (e.g., 24px / 600 SemiBold)
*   **H3 (Card Title)**: [`SIZE_PX`] / [`WEIGHT`] (e.g., 18px / 500 Medium)
*   **Body Text**: [`SIZE_PX`] / [`WEIGHT`] (e.g., 16px / 400 Regular)
*   **Small/Caption**: [`SIZE_PX`] / [`WEIGHT`] (e.g., 14px / 400)

### Optical Rules
*   **Letter Spacing (Headings)**: [`VALUE`] (e.g., -0.02em)
*   **Line Height (Body)**: [`VALUE`] (e.g., 1.5 or 1.6)
*   **Text Transform**: [`Uppercase/None`] (Should tiny labels be uppercase?)

---

## 3. GEOMETRY & SHAPE (The Feel) 📐

### Border Radius (Corner Roundness)
*   **Buttons (Standard)**: [`VALUE`] (e.g., 8px)
*   **Buttons (Small/Tag)**: [`VALUE`] (e.g., 4px)
*   **Cards/Panels**: [`VALUE`] (e.g., 16px)
*   **Modal/Dialogs**: [`VALUE`] (e.g., 20px)
*   **Inputs/Selects**: [`VALUE`] (e.g., 8px)

### Borders & Strokes
*   **Border Width**: [`PIXELS`] (e.g., 1px)
*   **Border Color (Inactive)**: [`HEX/RGBA`] (e.g., white/10)
*   **Border Color (Focus/Active)**: [`HEX/RGBA`] (e.g., primary/50)
*   **Border Style**: [`Solid/Dashed/None`]

---

## 4. DEPTH & GLASSMORPHISM (The Dimension) 🔮

### Shadows (Elevation)
*   **Level 1 (Subtle)**: [`CSS_BOX_SHADOW`] (e.g., 0 4px 6px -1px rgba(0, 0, 0, 0.1))
*   **Level 2 (Dropdowns)**: [`CSS_BOX_SHADOW`]
*   **Level 3 (Modals/Floating)**: [`CSS_BOX_SHADOW`]
*   **Inner Shadow (Inset)**: [`YES/NO`] (Used for indented inputs?)

### Glass Effect (Backdrop Blur)
*   **Intensity**: [`PIXELS`] (e.g., backdrop-blur-md = 12px, backdrop-blur-xl = 24px)
*   **Material Tint**: [`RGBA`] (e.g., bg-black/40)
*   **Saturation Boost**: [`YES/NO`] (backdrop-saturate-150 for "vibrant" glass?)

---

## 5. ANIMATION PHYSICS (The Movement) ⚡
**Rule**: Define the "personality" of the motion.

### Timing
*   **Fast (Micro-interactions)**: [`MS`] (e.g., 150ms)
*   **Normal (Page Transitions)**: [`MS`] (e.g., 400ms)
*   **Slow (Backgrounds)**: [`MS`] (e.g., 2000ms+)

### Easing (The Curve)
*   **Type**: [`NAME`] (e.g., 'Spring', 'Ease-Out', 'Linear')
*   **Spring Stiffness**: [`High/Low`] (e.g., stiff = snappy, low = bouncy)

### Interactions & Triggers
*   **Hover Scale**: [`FACTOR`] (e.g., 1.02)
*   **Active Click**: [`FACTOR`] (e.g., 0.98)
*   **Scroll Reveal**: [`YES/NO`] (Should elements fade in as you scroll down?)
*   **Stagger Delay**: [`value`] (e.g., 0.1s between list items)

---

## 6. COMPONENT SPECIFICS (The Logic) 🧩
**This section prevents layout hallucinations.**

### Buttons
*   **Padding (Horizontal)**: [`PX`] (e.g., px-4)
*   **Padding (Vertical)**: [`PX`] (e.g., py-2)
*   **Icon Position**: [`Left/Right/Only`]
*   **Gap between Icon & Text**: [`PX`] (e.g., 8px)

### Inputs & Forms
*   **Label Position**: [`Top/Inside/Left`]
*   **Error Style**: [`Text Below/Border Red/Icon Right`]
*   **Placeholder Color**: [`HEX`] (e.g., gray-500)

### Tables / Privacy Data
*   **Row Height**: [`Compact/Relaxed`]
*   **Separator Lines**: [`Horizontal Only/Grid/None`]
*   **Header Style**: [`Uppercase Subtle/Bold/Colored bg`]

### Modals & Dialogs
*   **Overlay Color**: [`RGBA`] (e.g., black/80)
*   **Entrance Direction**: [`Fade/Scale Up/Slide Up`]
*   **Exit Direction**: [`Same as Entrance/Fade Out`]

---

## 7. LAYOUT & GRID (The Skeleton) 🏗️

### Spacing System
*   **Base Spacing Unit**: [`PX`] (usually 4px)
*   **Page Side Padding**: [`Mobile PX`] / [`Desktop PX`] (e.g., 16px / 64px)
*   **Section Gap**: [`Vertical Spacing`] (e.g., 80px space between content sections)

### Breakpoints
*   **Mobile Max**: [`PX`] (e.g., <640px)
*   **Tablet Max**: [`PX`] (e.g., <1024px)
*   **Desktop Container Max**: [`PX`] (e.g., max-w-7xl)

---

## 8. ICONOGRAPHY (The Symbols) 💠

*   **Library Choice**: [`Lucide/HeroIcons/Phosphor`]
*   **Stroke Width**: [`PX`] (e.g., 1.5px or 2px)
*   **Corner Style**: [`Round/Square`]
*   **Active State**: [`Fill/Color Change`] (Does the icon fill with color when active?)

---

## 9. ANTI-PATTERNS (The "Do Not Use" List) 🛑
**Rule**: Explicitly forbid things you hate.

1.  [`EXAMPLE: Do not use gradient text on buttons`]
2.  [`EXAMPLE: Do not use rounded corners larger than 12px`]
3.  [`EXAMPLE: Do not use drop shadows on text elements`]
4.  [`EXAMPLE: No bouncing animations`]
5.  [`EXAMPLE: Never use default browser alerts`]
6.  [`EXAMPLE: Avoid pure black (#000000) for backgrounds`]
