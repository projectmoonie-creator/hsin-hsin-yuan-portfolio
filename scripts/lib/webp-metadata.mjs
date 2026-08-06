const ALLOWED_CHUNKS = new Set(["VP8 ", "VP8L", "VP8X", "ALPH"]);
const PRIVATE_VP8X_FLAGS = 0x20 | 0x08 | 0x04 | 0x02;

function unsafe(message) {
  throw new Error(`WebP metadata safety check failed: ${message}`);
}

export function assertPublicWebpMetadataSafe(bytes) {
  if (!Buffer.isBuffer(bytes)) unsafe("input must be a Buffer");
  if (bytes.length < 12
    || bytes.toString("ascii", 0, 4) !== "RIFF"
    || bytes.toString("ascii", 8, 12) !== "WEBP") {
    unsafe("invalid RIFF WebP container");
  }
  const declaredSize = bytes.readUInt32LE(4) + 8;
  if (declaredSize !== bytes.length) unsafe("RIFF length mismatch");

  let offset = 12;
  let imageChunkCount = 0;
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) unsafe("truncated chunk header");
    const type = bytes.toString("ascii", offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const end = offset + 8 + size;
    const paddedEnd = end + (size % 2);
    if (end > bytes.length || paddedEnd > bytes.length) unsafe("truncated chunk payload");
    if (!ALLOWED_CHUNKS.has(type)) unsafe(`unclassified chunk ${JSON.stringify(type)}`);
    if (type === "VP8X") {
      if (size !== 10) unsafe("invalid VP8X chunk");
      if ((bytes[offset + 8] & PRIVATE_VP8X_FLAGS) !== 0) {
        unsafe("VP8X declares private metadata or animation");
      }
    }
    if (type === "VP8 " || type === "VP8L") imageChunkCount += 1;
    offset = paddedEnd;
  }
  if (offset !== bytes.length) unsafe("invalid chunk alignment");
  if (imageChunkCount !== 1) unsafe("expected exactly one static image chunk");
  return true;
}
