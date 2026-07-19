# Cinematic Portfolio Scene System — Second-Pass Design

## Status

This document corrects the implementation of the already approved direction: A for the overall editorial site and B for the person. It does not reopen the creative choice. The first pass deployed the new information architecture but retained the old visual and interaction system, so it failed the approved design in practice.

## Root Cause Of The Failed Pass

- The new CSS was appended as a small override after the old black, acid-green, uppercase system.
- The selected B portrait treatment never rendered because `hero.foreground` was empty.
- The only new hero motion was a few viewport units of parallax. The old marquee, ambient shader, pointer glow, work stack, and contact treatment remained active.
- The Figma generator continued to emit the old hero, tokens, and compact cards.
- Tests asserted that several old visual fingerprints must remain present.

This is a design-system failure, not a Vercel, cache, or routing failure.

## Approaches Considered

1. **Retrofitted editorial skin — rejected.** Keep the old components and change spacing, backgrounds, and borders. This is the failed first pass and cannot create a distinct result.
2. **Pure editorial filmstrip — rejected.** Replace the cards with quiet image-and-copy chapters but omit a persistent portrait. This would satisfy A but lose the most important part of B and the reference choreography.
3. **Portrait carrier scene — selected.** Let a real foreground portrait carry the viewer from a black opening frame into a light editorial field while content changes behind it, then hand off to a dark work theatre. This fulfills A and B without copying the reference product UI.

## Subject, Audience, And Page Job

The subject is Hsin-Hsin Yuan as a documentary director, writer, producer, and cross-cultural story partner. The primary audience is an international producer, cultural institution, artist, or technology team deciding whether to start a conversation. The homepage has one job: establish a memorable directing point of view, show three credible works, and make contact easy.

## Visual System

### Palette

- `Stage` `#050807` — opening and work theatre.
- `Fog` `#DDDCD7` — primary light scene.
- `Paper` `#F6F4EE` — reading and contact surfaces.
- `Signal coral` `#F0645A` — documentary/directing scene glow.
- `Signal cobalt` `#4867D9` — cross-cultural scene glow.
- `Signal moss` `#4D9259` — editorial-systems scene glow.

Acid green is removed from the active site. Signal colors appear in blurred fields and active scene controls, not as persistent text decoration.

### Type

- Display and interface: `Helvetica Neue`, `Arial`, and the local sans-serif fallback stack, using mixed case and restrained weight.
- Editorial accent: `Iowan Old Style`, `Baskerville`, or `Times New Roman` italic, limited to one meaningful phrase per major scene.
- Chinese: `PingFang TC`, `Noto Serif TC`, and system fallbacks, preserving the same sans/serif role split.
- Utility metadata: the sans stack at small sizes with ordinary case. No global uppercase or exaggerated tracking.

### Signature

The signature is the **portrait carrier**: a portrait begins inside a black rounded frame, separates from it as the page becomes light, remains anchored while three areas of practice change behind it, and then releases before the work theatre. No other section gets an equally elaborate effect.

## Scene Architecture

### 1. Opening / Portrait Carrier

Use a `240–300svh` scroll scene with a sticky viewport and five explicit layers:

1. stage color and blurred signal field;
2. replaceable abstract/background media;
3. the rounded opening frame with showreel media;
4. a real foreground portrait asset;
5. editorial name, role, navigation, and controls.

Progress phases:

- **0–25%:** black opening stage; the media frame expands from a compact portal; name and positioning enter from opposite edges.
- **25–48%:** the frame shrinks and lifts as the background becomes Fog; the portrait remains bottom-centre and visibly separates from the frame.
- **48–78%:** practice modes activate in sequence; the signal field, short copy, and two floating project stills change while the portrait remains stable.
- **78–100%:** portrait and mode rail recede; the dark work theatre rises from below.

The mode rail represents real professional practice, not decorative product modes:

- Documentary direction
- Cross-cultural story
- Editorial systems

The rail is both scroll-driven and keyboard/click operable. Changing a mode changes the active copy, signal color, and supporting stills.

### 2. Work Theatre

Replace the old screening marquee and work cards with one dark sticky theatre containing three work scenes. Each scene has one dominant image, optional supporting stills, concise role and proof, and one action. The composition changes inside a fixed viewport; the page does not auto-scroll horizontally.

Desktop uses a `300svh` theatre with scene-state transitions. Mobile uses three ordinary stacked chapters with no sticky trap. Missing media produces a deliberate text-led frame, never the old gradient placeholder.

### 3. Practice, History, And Contact

After the theatre, return to Paper for a compact practice statement and selected history. Use open rows and typographic hierarchy, not pill clouds or card grids. Contact is a quiet editorial form with visible labels and a single dark action, not a glass panel or glow effect. Footer returns to Stage and ends with a short role line rather than decorative scenery copied from the reference.

## Media Contract

Expand named media roles while preserving data-only replacement:

```json
{
  "hero": {
    "background": "/assets/portfolio/hero-stage.jpg",
    "foregroundCutout": "/assets/portfolio/hero-foreground.webp",
    "abstractLayer": "/assets/portfolio/hero-abstract.jpg",
    "alternatePortraits": [],
    "desktopFocalPoint": "50% 50%",
    "mobileFocalPoint": "50% 45%",
    "alt": { "en": "…", "zh": "…" },
    "treatment": "portrait-carrier"
  }
}
```

If `treatment` is `portrait-carrier`, `foregroundCutout` is required. A missing cutout is a validation failure, not a successful fallback. Other treatments may allow it to be empty. Project scenes use named `hero`, `supporting`, focal points, and alt text; ordinary replacement never requires CSS edits.

## Interaction And Accessibility

- Use native CSS transforms and a small requestAnimationFrame state controller; no WebGL or remote runtime dependency.
- Map scroll progress to named scene states and bounded interpolations. Do not revive ambient pointer glow, autoplay marquee, wheel interception, or multiple simultaneous effects.
- Initial HTML remains readable without JavaScript.
- `prefers-reduced-motion` displays the final composed hero, static mode content, and stacked work chapters.
- Mobile removes sticky scenes and keeps navigation, showreel, work links, and contact visible.
- All mode controls use real buttons with focus states and updated `aria-pressed`.

## Figma And Generator Alignment

Rebuild the active Figma export from the new tokens and scene compositions. The generator must not retain the old dark/acid palette, left-image/right-copy hero, compact card geometry, or moving strip. Generated desktop and mobile views must visually match the live architecture.

## Acceptance Gates

- A side-by-side screenshot must not be plausibly mistaken for the production old site.
- No active acid-green token, ambient shader, pointer edge glow, screening marquee, old `work-panel`, glass contact card, or legacy hero title composition remains.
- The B portrait layer is present in generated HTML and the manifest path resolves to a real asset.
- Scroll changes composition or scene state, not just element position by a few pixels.
- Desktop, mobile, no-JavaScript, and reduced-motion paths remain readable and functional.
- Tests and the media validator fail if a portrait-carrier scene has no foreground asset.
- The reusable skill includes a legacy-fingerprint audit and a before/after visual gate.

## Non-Goals

- No literal flower, product toolbar, PHOTON/LUMA treatment, device mockup, cloud, or grass copy from the reference.
- No new claims, analytics, CMS, remote font dependency, or production-domain replacement in this pass.
- No AI-generated substitute portrait. A derived cutout may only remove the background from an approved source image without changing identity.
