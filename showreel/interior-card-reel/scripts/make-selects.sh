#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
scout_dir="$project_dir/../interior-pts-reel/assets/source-clips/scout"
selects_dir="$project_dir/assets/source-clips/selects"

mkdir -p "$selects_dir"

make_select() {
  local shot="$1"
  local source_id="$2"
  local source_start="$3"
  local duration="$4"

  ffmpeg \
    -hide_banner \
    -loglevel error \
    -y \
    -ss "$source_start" \
    -i "$scout_dir/$source_id.mp4" \
    -t "$duration" \
    -an \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,fps=30" \
    -c:v libx264 \
    -preset veryfast \
    -crf 20 \
    -pix_fmt yuv420p \
    -g 30 \
    -keyint_min 30 \
    -sc_threshold 0 \
    -movflags +faststart \
    "$selects_dir/$shot.mp4"
}

make_select "shot-01" "Gz9HV2XtXzM" "0" "1.2"
make_select "shot-02" "Gz9HV2XtXzM" "135" "1.4"
make_select "shot-03" "d5icTKIbL9E" "0" "1.4"
make_select "shot-04" "wiG0h7wofnw" "24" "1.5"
make_select "shot-05" "me4KutyUoT4" "42" "1.5"
make_select "shot-06" "me4KutyUoT4" "88" "1.4"
make_select "shot-07" "d5icTKIbL9E" "53" "1.4"
make_select "shot-08" "d5icTKIbL9E" "64" "1.5"
make_select "shot-09" "me4KutyUoT4" "103" "1.4"
make_select "shot-10" "me4KutyUoT4" "162" "1.3"
