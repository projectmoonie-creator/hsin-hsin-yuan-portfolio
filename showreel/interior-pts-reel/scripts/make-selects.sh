#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
scout_dir="$project_dir/assets/source-clips/scout"
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

  printf '%s\n' "Created $shot.mp4"
}

make_select "shot-01" "Gz9HV2XtXzM" "0" "1"
make_select "shot-02" "-64_T9ms6kM" "0" "1"
make_select "shot-03" "Gz9HV2XtXzM" "135" "1.2"
make_select "shot-04" "d5icTKIbL9E" "0" "2.2"
make_select "shot-05" "Gz9HV2XtXzM" "43" "2"
make_select "shot-06" "-64_T9ms6kM" "13" "2.2"
make_select "shot-07" "0zkXVU3m7Jc" "42" "2.2"
make_select "shot-08" "wiG0h7wofnw" "24" "2.2"
make_select "shot-09" "me4KutyUoT4" "42" "2.2"
make_select "shot-10" "d5icTKIbL9E" "19" "2"
make_select "shot-11" "me4KutyUoT4" "72" "2.2"
make_select "shot-12" "me4KutyUoT4" "88" "2.2"
make_select "shot-13" "wiG0h7wofnw" "12" "2.4"
make_select "shot-14" "d5icTKIbL9E" "53" "2.2"
make_select "shot-15" "d5icTKIbL9E" "64" "2.2"
make_select "shot-16" "me4KutyUoT4" "103" "2.1"
make_select "shot-17" "me4KutyUoT4" "119" "2.2"
make_select "shot-18" "me4KutyUoT4" "162" "2"
make_select "shot-19" "me4KutyUoT4" "284" "1.8"
make_select "shot-20" "Gz9HV2XtXzM" "60" "2"
make_select "shot-21" "2PRDDx8gxBc" "115" "1.7"
make_select "shot-22" "2PRDDx8gxBc" "205" "1.7"
make_select "shot-23" "q4TMcoOpzKA" "145" "1.7"
make_select "shot-24" "wPHF2ve2WhE" "330" "1.7"
make_select "shot-25" "wPHF2ve2WhE" "267" "1.7"
make_select "shot-26" "2PRDDx8gxBc" "507" "1.5"
