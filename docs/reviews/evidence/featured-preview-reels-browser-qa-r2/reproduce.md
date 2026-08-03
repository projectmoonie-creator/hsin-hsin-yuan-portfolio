# Reproduce Featured preview reels browser QA r2

Run every command from the repository root. The examples use only
repository-relative paths and task-specific shell variables.

## Deterministic gates

```sh
npm test
npm run audit:design-contract
npm run build
npm run figma:export
git diff --check
```

Verify exact Figma fingerprints and no generated Figma diff:

```sh
shasum -a 256 \
  figma-export/01-desktop-home.svg \
  figma-export/02-desktop-works-logos.svg \
  figma-export/03-mobile-home.svg \
  figma-export/README.md
git diff --exit-code -- figma-export
```

## Media metadata, hashes, and full decode

The exact reproducible ffmpeg encoding recipe is maintained in
`showreel/featured-preview-reels/README.md`.

```sh
for reel in \
  public/assets/showreel/slow-steps-card-reel.mp4 \
  public/assets/showreel/tech-dreamers-card-reel.mp4 \
  public/assets/showreel/my-art-my-voice-card-reel.mp4; do
  ffprobe -v error \
    -show_entries format=duration,size:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries \
    -of json "$reel"
  ffmpeg -v error -i "$reel" -f null -
done
shasum -a 256 \
  public/assets/showreel/slow-steps-card-reel.mp4 \
  public/assets/showreel/tech-dreamers-card-reel.mp4 \
  public/assets/showreel/my-art-my-voice-card-reel.mp4
```

## Local server and sanitized browser harness

Confirm the normal project port is free, start the repository server, and
leave it running in this terminal:

```sh
lsof -nP -iTCP:4173 -sTCP:LISTEN
npm run serve
```

In a second terminal at the repository root, run syntax/help, classifier, and
browser QA. Set the baseline only when repeating the historical authentication
attempt; omit it for local-only QA.

```sh
qa_package='docs/reviews/evidence/featured-preview-reels-browser-qa-r2'
qa_output_dir='qa-evidence/featured-preview-reels-browser-qa-r2'
PYTHONDONTWRITEBYTECODE=1 python3 -c 'from pathlib import Path; [compile(path.read_text(encoding="utf-8"), str(path), "exec") for path in map(Path, __import__("sys").argv[1:])]' "$qa_package/qa_harness.py" "$qa_package/baseline_classifier.py" "$qa_package/baseline_classifier_self_test.py"
PYTHONDONTWRITEBYTECODE=1 python3 "$qa_package/qa_harness.py" --help
PYTHONDONTWRITEBYTECODE=1 python3 "$qa_package/baseline_classifier_self_test.py"
PYTHONDONTWRITEBYTECODE=1 python3 "$qa_package/qa_harness.py" \
  --repo-root . \
  --base-url http://127.0.0.1:4173 \
  --baseline-url https://hsin-hsin-yuan-portfolio-preview-5s4u5ncf6.vercel.app \
  --evidence-dir "$qa_output_dir"
```

The harness fails closed if the baseline DOM is missing without preserved SSO
evidence, or if a reachable baseline lacks a complete matched comparison. Its
saved JSON removes query strings, cookies, headers, form values, and absolute
filesystem paths. Optional `--screenshots` output remains local/session
evidence and must not be added to this package.

Stop the server with Ctrl-C, then verify shutdown:

```sh
lsof -nP -iTCP:4173 -sTCP:LISTEN
```

Exit `1` with no output means no listener remains.

## Manifest, status, and privacy

```sh
qa_package='docs/reviews/evidence/featured-preview-reels-browser-qa-r2'
(cd "$qa_package" && shasum -a 256 -c evidence-manifest.sha256)
git status --short
git diff --check
private_home='/''Users/'
private_volume='/''Volumes/'
remote_attachment_root='/tmp/''codex-remote-attachments'
if git grep -n -I -E "${private_home}|${private_volume}|${remote_attachment_root}"; then
  exit 1
fi
```

The expected worktree exception is the protected user-owned untracked review;
ignored `dist/` may exist. Do not deploy, push, merge, or submit Contact as part
of this reproduction.
