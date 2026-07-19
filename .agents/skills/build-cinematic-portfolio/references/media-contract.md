# Replaceable Media Contract

Use a JSON manifest for global media and structured frontmatter for work media.

```json
{
  "hero": {
    "background": "/assets/portfolio/portrait.jpg",
    "foreground": "",
    "focalPoint": "50% 50%",
    "alt": { "en": "Creator at work", "zh": "創作者工作現場" },
    "treatment": "portrait-layered"
  }
}
```

- `background`: required local public path.
- `foreground`: optional transparent local image; empty string disables the layer.
- `focalPoint`: required `X% Y%`, consumed by `object-position`.
- `alt`: required in every public site language.
- `treatment`: stable presentation token, never an asset filename.

Work media uses `posterImage`, `posterAlt`, `focalPoint`, and optional `foregroundImage`. Keep remote public images link-first and do not rehost without rights.

Replacement workflow:

1. Confirm rights and crop safety.
2. Copy the asset under `public/assets/portfolio/` with a descriptive lowercase filename.
3. Change the manifest/frontmatter path, focal point, and alt text.
4. Run the validator, tests, build, and desktop/mobile screenshots.
5. Delete an old asset only after confirming no active source references it.
