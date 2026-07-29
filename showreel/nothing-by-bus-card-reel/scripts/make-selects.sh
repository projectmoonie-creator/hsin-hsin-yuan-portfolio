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

make_select "shot-01" "2PRDDx8gxBc" "115" "1.7"
make_select "shot-02" "2PRDDx8gxBc" "205" "1.7"
make_select "shot-03" "q4TMcoOpzKA" "145" "1.7"
make_select "shot-04" "wPHF2ve2WhE" "330" "1.7"
make_select "shot-05" "wPHF2ve2WhE" "267" "1.7"
make_select "shot-06" "2PRDDx8gxBc" "507" "1.5"
