#!/bin/sh
set -eu

reel_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
source_master="$reel_root/assets/source-clips/originals/overclocking_2013_eng_0218_v1 (720p).mp4"
select_dir="$reel_root/assets/source-clips/selects"
public_dir="$reel_root/../../public/assets/showreel"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required to prepare the Overclocking reel." >&2
  exit 1
fi

if [ ! -f "$source_master" ]; then
  echo "Archived source master is missing: $source_master" >&2
  exit 1
fi

mkdir -p "$select_dir" "$public_dir"

make_select() {
  select_name="$1"
  source_start="$2"
  select_frames="$3"

  ffmpeg -loglevel error \
    -ss "$source_start" \
    -i "$source_master" \
    -map 0:v:0 \
    -an \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,fps=30,setsar=1" \
    -c:v libx264 \
    -preset slow \
    -crf 18 \
    -pix_fmt yuv420p \
    -g 30 \
    -keyint_min 30 \
    -sc_threshold 0 \
    -movflags +faststart \
    -frames:v "$select_frames" \
    -y "$select_dir/$select_name.mp4"
}

make_select "01-mechanism" "00:04:56" "54"
make_select "02-build" "00:15:50" "53"
make_select "03-propeller" "00:24:04" "54"
make_select "04-assembly" "00:29:44" "53"
make_select "05-water-test" "00:36:28" "60"
make_select "06-bottle-detail" "00:39:56" "50"

ffmpeg -loglevel error \
  -ss "00:29:46" \
  -i "$source_master" \
  -frames:v 1 \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,setsar=1" \
  -c:v libwebp \
  -q:v 82 \
  -y "$public_dir/overclocking-card-reel-poster.webp"

echo "Prepared six silent selects and the Overclocking card poster."
