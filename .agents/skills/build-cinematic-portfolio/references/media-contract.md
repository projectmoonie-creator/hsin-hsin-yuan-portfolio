# Replaceable Media Contract

Use a JSON manifest for global media and structured frontmatter for work media.

```json
{
  "hero": {
    "background": "/assets/portfolio/portrait.jpg",
    "foregroundCutout": "/assets/portfolio/portrait-cutout.webp",
    "abstractLayer": "/assets/portfolio/abstract.jpg",
    "alternatePortraits": [],
    "desktopFocalPoint": "50% 50%",
    "mobileFocalPoint": "42% 50%",
    "alt": { "en": "Creator at work", "zh": "創作者工作現場" },
    "treatment": "portrait-carrier"
  }
}
```

- `background`: required local public path.
- `foregroundCutout`: transparent local image. It is required when `treatment` is `portrait-carrier` or another layered-person treatment; only non-layered treatments may leave it empty.
- `abstractLayer`: required scene image for treatments that choreograph depth behind the person.
- `alternatePortraits`: array of optional portraits for explicit scene changes; an empty array is valid.
- `desktopFocalPoint` and `mobileFocalPoint`: required `X% Y%`, consumed by `object-position`.
- `alt`: required in every public site language.
- `treatment`: stable presentation token, never an asset filename.

Work media uses `posterImage`, `posterAlt`, `focalPoint`, and optional `supportingImages`. Project-specific scene modes may add named `primary` and `supporting` roles. Keep remote public images link-first and do not rehost without rights.

For a real-person foreground layer:

- preserve identity and provenance; never silently substitute a synthetic person;
- use PNG or WebP with a verified alpha channel and inspect edges against light and dark fields;
- keep the person asset independent from the background so frame morphs do not clip it;
- provide a readable fallback composition for narrow screens and reduced motion;
- change treatment before leaving a required foreground role empty.

Replacement workflow:

1. Confirm rights and crop safety.
2. Copy the asset under `public/assets/portfolio/` with a descriptive lowercase filename.
3. Change only the manifest/frontmatter path, focal points, and alt text. A normal replacement must not require CSS or component edits.
4. Run the validator, tests, build, and matched desktop/mobile screenshots.
5. Delete an old asset only after confirming no active source references it.
