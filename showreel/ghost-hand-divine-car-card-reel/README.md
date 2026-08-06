# Ghost Hand Divine Car Card Reel

Repo-configured Archive slideshow authoring package. HyperFrames is pinned to `0.7.94`; public output remains a silent 1280×720 H.264 MP4 and a metadata-safe 1280×720 WebP poster.

The six originals are producer-approved local source material and remain in the ignored `assets/source-stills/originals/` directory. Only normalized, metadata-stripped authoring WebPs under `assets/stills/` may be committed.

```bash
npm run media:slideshow -- --config showreel/ghost-hand-divine-car-card-reel/slideshow.json
npm run media:slideshow -- --config showreel/ghost-hand-divine-car-card-reel/slideshow.json --source-dir <approved-source-directory> --authoring-only
npm run media:slideshow -- --config showreel/ghost-hand-divine-car-card-reel/slideshow.json --source-dir <approved-source-directory> --write
```

Stable public targets:

- `/assets/showreel/ghost-hand-divine-car-card-reel-poster.webp`
- `/assets/showreel/ghost-hand-divine-car-card-reel.mp4`

To replace a still later, update one frame entry in `slideshow.json`, place the matching original in the ignored directory, then rerun the guarded command. Do not edit generated `index.html` by hand.
