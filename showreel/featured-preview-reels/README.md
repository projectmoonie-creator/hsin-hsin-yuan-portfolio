# Featured preview reels

These public derivatives preserve each approved edit: complete source timelines for the first three reels and the approved eight-cut timeline for Top Gear. The source roots are supplied only through session environment variables; the commands below intentionally record no external-volume path.

## Approved sources

| Source variable | Approved basename | Source SHA-256 | Source duration | Source dimensions |
| --- | --- | --- | ---: | ---: |
| `SLOW_STEPS_SOURCE_DIR` | `Slow Steps 30s系列網路平台宣傳片完成檔.mp4` | `0def72570da58eeb51af84b07d4cd880b666a3b8718702f7236af468b07f55ba` | 30.03 s | 1920×1080 |
| `TECH_DREAMERS_SOURCE_DIR` | `Promo Tech Dreamers Series 日期版 0705.mp4` | `5a1eff80776aed305a0144f135ff9d433374f647fe0feca7a2e72ba708beeb0e` | 30.03 s | 1920×1080 |
| `MY_ART_MY_VOICE_SOURCE_DIR` | `My art  my voice  0214 預告完成檔.mp4` | `d7ab1b3c7e4a70b479af7ab28801a9c41993576502aaca87fa7032adef1e1bdd` | 100.033267 s | 1920×1080 |
| `TOP_GEAR_SOURCE_DIR` | `巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4` | `4ba65130c3c172ffff40851ee83e05db494be261b1e50527576f5b9fcda2c955` | 3195.042540 s | 1920×1080 |

The approved Top Gear source probe reports H.264 1920×1080 yuv420p BT.709 video and AAC audio. Its rights status is `user-supplied-local-source`; only the silent derivative is published.

Verify the resolved session sources before encoding:

```sh
SLOW_STEPS_SOURCE="${SLOW_STEPS_SOURCE_DIR}/Slow Steps 30s系列網路平台宣傳片完成檔.mp4"
TECH_DREAMERS_SOURCE="${TECH_DREAMERS_SOURCE_DIR}/Promo Tech Dreamers Series 日期版 0705.mp4"
MY_ART_MY_VOICE_SOURCE="${MY_ART_MY_VOICE_SOURCE_DIR}/My art  my voice  0214 預告完成檔.mp4"
TOP_GEAR_SOURCE="${TOP_GEAR_SOURCE_DIR}/巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4"

shasum -a 256 "$SLOW_STEPS_SOURCE" "$TECH_DREAMERS_SOURCE" "$MY_ART_MY_VOICE_SOURCE" "$TOP_GEAR_SOURCE"
```

## Reproducible encodes

Run from the repository root after setting the source-directory variables above:

```sh
ffmpeg -hide_banner -i "$SLOW_STEPS_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/slow-steps-card-reel.mp4
ffmpeg -hide_banner -i "$TECH_DREAMERS_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/tech-dreamers-card-reel.mp4
ffmpeg -hide_banner -i "$MY_ART_MY_VOICE_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/my-art-my-voice-card-reel.mp4
```

### Top Gear eight-cut assembly

The final edit uses these source ranges in editorial order: `52–55.5`, `221.5–225`, `576–580`, `957.60–960.60`, `1678–1682`, `2014–2018`, `2399.28–2403.28`, and `2035–2039` seconds. The fourth and seventh ranges are the corrected selections that exclude brief embedded source-shot flashes.

Run from the repository root after setting `TOP_GEAR_SOURCE_DIR` and resolving `TOP_GEAR_SOURCE` above:

```sh
ffmpeg -hide_banner -i "$TOP_GEAR_SOURCE" \
  -filter_complex "[0:v]trim=start=52:end=55.5,setpts=PTS-STARTPTS[v0];[0:v]trim=start=221.5:end=225,setpts=PTS-STARTPTS[v1];[0:v]trim=start=576:end=580,setpts=PTS-STARTPTS[v2];[0:v]trim=start=957.60:end=960.60,setpts=PTS-STARTPTS[v3];[0:v]trim=start=1678:end=1682,setpts=PTS-STARTPTS[v4];[0:v]trim=start=2014:end=2018,setpts=PTS-STARTPTS[v5];[0:v]trim=start=2399.28:end=2403.28,setpts=PTS-STARTPTS[v6];[0:v]trim=start=2035:end=2039,setpts=PTS-STARTPTS[v7];[v0][v1][v2][v3][v4][v5][v6][v7]concat=n=8:v=1:a=0,scale=1280:720:flags=lanczos,fps=25,format=yuv420p[v]" \
  -map "[v]" \
  -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k \
  -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -movflags +faststart -an -y \
  public/assets/showreel/top-gear-china-uk-special-card-reel.mp4
```

## Output evidence

`ffprobe` reports one video stream and no audio streams for every output.

| Public output | Duration | Size | SHA-256 | Video metadata |
| --- | ---: | ---: | --- | --- |
| `public/assets/showreel/slow-steps-card-reel.mp4` | 30.030000 s | 7,427,742 bytes | `6061dceb6e583a5fc20d695b6cb555f4e02a80970b41bda8ec787acb3f3f1174` | H.264, 1280×720, yuv420p, BT.709 space/transfer/primaries, video-only |
| `public/assets/showreel/tech-dreamers-card-reel.mp4` | 30.030000 s | 6,441,958 bytes | `4c6c1070902b9d6dd8b170c8021c3bca303a9e2c9a1abca05a7911264f23835c` | H.264, 1280×720, yuv420p, BT.709 space/transfer/primaries, video-only |
| `public/assets/showreel/my-art-my-voice-card-reel.mp4` | 100.033267 s | 32,662,721 bytes | `f5e79c8e8e13b62b337b75190f25b7d034d6059e297f8044da56d6e00a682e93` | H.264, 1280×720, yuv420p, BT.709 space/transfer/primaries, video-only |
| `public/assets/showreel/top-gear-china-uk-special-card-reel.mp4` | 29.960000 s | 8,651,457 bytes | `4d57e75a81e2ebf0e398a08b57c8e99ddcb0973bc1562db8036221b9a014db72` | H.264 High, 1280×720, yuv420p, progressive, BT.709 space/transfer/primaries, 25 fps, 749 frames, video-only |

The Top Gear output has `moov` before `mdat` for faststart delivery, and its full video-stream decode completed successfully with no errors. The derivatives were registered as `video_001`, `video_002`, `video_003`, and `video_004` using the current `media-use` resolver. The generated `.media/` ledger is ignored by `showreel/**/.media/` and must not be committed.

External source paths are session-only evidence and must not be committed. The public derivatives are video-only motion thumbnails; existing work posters and external watch destinations remain canonical.
