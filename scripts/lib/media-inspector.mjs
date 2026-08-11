import { spawnSync } from "node:child_process";

import ffmpegPath from "ffmpeg-static";

function readBoxSize(bytes, offset, end) {
  if (offset + 8 > end) return null;
  let size = bytes.readUInt32BE(offset);
  let headerSize = 8;
  if (size === 1) {
    if (offset + 16 > end) return null;
    size = Number(bytes.readBigUInt64BE(offset + 8));
    headerSize = 16;
  } else if (size === 0) {
    size = end - offset;
  }
  if (!Number.isSafeInteger(size) || size < headerSize || offset + size > end) return null;
  return { size, headerSize, type: bytes.toString("ascii", offset + 4, offset + 8) };
}

function childBoxes(bytes, start, end) {
  const boxes = [];
  for (let offset = start; offset + 8 <= end;) {
    const box = readBoxSize(bytes, offset, end);
    if (!box) break;
    boxes.push({ ...box, offset, payloadOffset: offset + box.headerSize, end: offset + box.size });
    offset += box.size;
  }
  return boxes;
}

function mediaDuration(bytes) {
  const moov = childBoxes(bytes, 0, bytes.length).find((box) => box.type === "moov");
  if (!moov) return null;
  for (const trak of childBoxes(bytes, moov.payloadOffset, moov.end).filter((box) => box.type === "trak")) {
    const mdia = childBoxes(bytes, trak.payloadOffset, trak.end).find((box) => box.type === "mdia");
    if (!mdia) continue;
    const mdiaChildren = childBoxes(bytes, mdia.payloadOffset, mdia.end);
    const hdlr = mdiaChildren.find((box) => box.type === "hdlr");
    const mdhd = mdiaChildren.find((box) => box.type === "mdhd");
    if (!hdlr || !mdhd || hdlr.payloadOffset + 12 > hdlr.end) continue;
    if (bytes.toString("ascii", hdlr.payloadOffset + 8, hdlr.payloadOffset + 12) !== "vide") continue;

    const version = bytes[mdhd.payloadOffset];
    const timescaleOffset = mdhd.payloadOffset + (version === 1 ? 20 : 12);
    const durationOffset = mdhd.payloadOffset + (version === 1 ? 24 : 16);
    const requiredBytes = version === 1 ? 8 : 4;
    if (durationOffset + requiredBytes > mdhd.end) continue;
    const timescale = bytes.readUInt32BE(timescaleOffset);
    const duration = version === 1
      ? Number(bytes.readBigUInt64BE(durationOffset))
      : bytes.readUInt32BE(durationOffset);
    if (timescale > 0 && Number.isSafeInteger(duration)) {
      return Number((duration / timescale).toFixed(6));
    }
  }
  return null;
}

function parseColorDetails(raw = "") {
  const details = raw.split(",").map((part) => part.trim());
  const color = details.find((part) => part.includes("/") || /^bt\d/.test(part));
  if (!color) return {};
  if (!color.includes("/")) {
    return { colorSpace: color, colorTransfer: color, colorPrimaries: color };
  }
  const [colorSpace, colorPrimaries, colorTransfer] = color.split("/");
  return {
    colorSpace: colorSpace === "unknown" ? undefined : colorSpace,
    colorTransfer: colorTransfer === "unknown" ? undefined : colorTransfer,
    colorPrimaries: colorPrimaries === "unknown" ? undefined : colorPrimaries,
  };
}

function parseVideoStream(line) {
  const match = line.match(
    /: Video:\s*([^,\s]+)(?:\s*\([^)]*\))*\s*,\s*([^,\s(]+)(?:\(([^)]*)\))?,\s*(\d+)x(\d+)/,
  );
  if (!match) throw new Error(`Unable to parse project-owned FFmpeg video stream: ${line.trim()}`);
  return {
    codecName: match[1],
    pixelFormat: match[2],
    width: Number(match[4]),
    height: Number(match[5]),
    ...parseColorDetails(match[3]),
  };
}

export function parseFfmpegInputDiagnostics(inputDiagnostics) {
  const streamLines = (inputDiagnostics.match(/^\s*Stream #0:[^\n]+$/gm) || [])
    .filter((line) => /: (?:Video|Audio|Subtitle|Data|Attachment):/.test(line));
  const videoLine = streamLines.find((line) => line.includes(": Video:"));
  if (!videoLine) throw new Error("No decodable image or video stream in FFmpeg diagnostics");
  const metadataKeys = [...inputDiagnostics.matchAll(/^\s+([\w -]+)\s*:/gm)]
    .map((match) => match[1].trim().toLowerCase());
  return {
    streamCount: streamLines.length,
    audioStreamCount: streamLines.filter((line) => line.includes(": Audio:")).length,
    video: parseVideoStream(videoLine),
    metadataKeys,
  };
}

export function inspectMediaSync(filePath, bytes) {
  const result = spawnSync(ffmpegPath, [
    "-hide_banner",
    "-i", filePath,
    "-map", "0",
    "-c", "copy",
    "-f", "null",
    "-",
  ], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Project-owned FFmpeg could not inspect ${filePath}: ${result.stderr.trim()}`);
  }

  const inputDiagnostics = result.stderr.split(/^Output #0/m)[0];
  let parsed;
  try {
    parsed = parseFfmpegInputDiagnostics(inputDiagnostics);
  } catch (error) {
    throw new Error(`${error.message}: ${filePath}`);
  }

  return {
    duration: mediaDuration(bytes),
    ...parsed,
  };
}
