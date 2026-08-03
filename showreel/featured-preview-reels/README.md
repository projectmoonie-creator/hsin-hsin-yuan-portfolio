# Featured preview reels

These public derivatives preserve each approved source's complete timeline. The source roots are supplied only through session environment variables; the commands below intentionally record no external-volume path.

## Approved sources

| Source variable | Approved basename | Source SHA-256 | Source duration | Source dimensions |
| --- | --- | --- | ---: | ---: |
| `SLOW_STEPS_SOURCE_DIR` | `Slow Steps 30s系列網路平台宣傳片完成檔.mp4` | `0def72570da58eeb51af84b07d4cd880b666a3b8718702f7236af468b07f55ba` | 30.03 s | 1920×1080 |
| `TECH_DREAMERS_SOURCE_DIR` | `Promo Tech Dreamers Series 日期版 0705.mp4` | `5a1eff80776aed305a0144f135ff9d433374f647fe0feca7a2e72ba708beeb0e` | 30.03 s | 1920×1080 |
| `MY_ART_MY_VOICE_SOURCE_DIR` | `My art  my voice  0214 預告完成檔.mp4` | `d7ab1b3c7e4a70b479af7ab28801a9c41993576502aaca87fa7032adef1e1bdd` | 100.033267 s | 1920×1080 |

Verify the resolved session sources before encoding:

```sh
SLOW_STEPS_SOURCE="${SLOW_STEPS_SOURCE_DIR}/Slow Steps 30s系列網路平台宣傳片完成檔.mp4"
TECH_DREAMERS_SOURCE="${TECH_DREAMERS_SOURCE_DIR}/Promo Tech Dreamers Series 日期版 0705.mp4"
MY_ART_MY_VOICE_SOURCE="${MY_ART_MY_VOICE_SOURCE_DIR}/My art  my voice  0214 預告完成檔.mp4"

shasum -a 256 "$SLOW_STEPS_SOURCE" "$TECH_DREAMERS_SOURCE" "$MY_ART_MY_VOICE_SOURCE"
```

## Reproducible encodes

Run from the repository root after setting the three source-directory variables above:

```sh
ffmpeg -hide_banner -i "$SLOW_STEPS_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/slow-steps-card-reel.mp4
ffmpeg -hide_banner -i "$TECH_DREAMERS_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/tech-dreamers-card-reel.mp4
ffmpeg -hide_banner -i "$MY_ART_MY_VOICE_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/my-art-my-voice-card-reel.mp4
```

## Output evidence

`ffprobe` reports one video stream and no audio streams for every output.

| Public output | Duration | Size | SHA-256 | Video metadata |
| --- | ---: | ---: | --- | --- |
| `public/assets/showreel/slow-steps-card-reel.mp4` | 30.030000 s | 7,427,742 bytes | `6061dceb6e583a5fc20d695b6cb555f4e02a80970b41bda8ec787acb3f3f1174` | H.264, 1280×720, yuv420p, BT.709 space/transfer/primaries, video-only |
| `public/assets/showreel/tech-dreamers-card-reel.mp4` | 30.030000 s | 6,441,958 bytes | `4c6c1070902b9d6dd8b170c8021c3bca303a9e2c9a1abca05a7911264f23835c` | H.264, 1280×720, yuv420p, BT.709 space/transfer/primaries, video-only |
| `public/assets/showreel/my-art-my-voice-card-reel.mp4` | 100.033267 s | 32,662,721 bytes | `f5e79c8e8e13b62b337b75190f25b7d034d6059e297f8044da56d6e00a682e93` | H.264, 1280×720, yuv420p, BT.709 space/transfer/primaries, video-only |

The derivatives were registered as `video_001`, `video_002`, and `video_003` using the current `media-use` resolver. The generated `.media/` ledger is ignored by `showreel/**/.media/` and must not be committed.

External source paths are session-only evidence and must not be committed. The public derivatives are video-only motion thumbnails; existing work posters and external watch destinations remain canonical.
