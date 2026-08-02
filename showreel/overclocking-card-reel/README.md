# Overclocking Card Reel

Approved silent reel for the uniform Overclocking card in the portfolio Archive.

- Duration: 10 seconds
- Canvas: 1280 x 720
- Frame rate: 30 fps
- Source audio: removed
- Poster: green-frame and chain-drive assembly at `00:29:46`, extracted from
  the user-provided 720p master
- Website outputs:
  - `public/assets/showreel/overclocking-card-reel.mp4`
  - `public/assets/showreel/overclocking-card-reel-poster.webp`

Working source masters, selects, renders, and snapshots remain under ignored
project paths. After delivery verification, the original Downloads folder is
relocated to `assets/source-clips/originals/`.

## Source and runtime notes

- All 15 user-provided Overclocking files are archived under
  `assets/source-clips/originals/`; no video files remain in the former
  Downloads source folder.
- The six timed `<video>` elements intentionally live at the composition root.
  HyperFrames 0.7.88 did not rebase nested sub-composition video time at a
  non-zero host start; root-owned media follows the documented host-media
  pattern and has been verified by runtime state plus midpoint snapshots.
