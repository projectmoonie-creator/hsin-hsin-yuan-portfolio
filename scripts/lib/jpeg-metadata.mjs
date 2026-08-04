const PRIVATE_METADATA_MARKERS = new Set([0xe1, 0xed, 0xfe]);

function isStandaloneMarker(marker) {
  return marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9);
}

function jpegError(message) {
  return new Error(`Hero asset must be a valid JPEG: ${message}`);
}

function processJpeg(input, { stripPrivateMetadata }) {
  const bytes = Buffer.from(input);
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw jpegError("missing SOI marker");
  }

  const chunks = [bytes.subarray(0, 2)];
  const privateMarkers = [];
  let offset = 2;
  let sawEnd = false;

  while (offset < bytes.length) {
    const markerStart = offset;
    if (bytes[offset] !== 0xff) throw jpegError(`expected marker at byte ${offset}`);
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) throw jpegError("truncated marker");
    const marker = bytes[offset];
    const markerEnd = offset + 1;

    if (marker === 0xd9) {
      chunks.push(bytes.subarray(markerStart, markerEnd));
      const trailing = bytes.subarray(markerEnd);
      if (trailing.some((value) => value !== 0)) {
        throw jpegError("unexpected payload after EOI marker");
      }
      if (trailing.length) chunks.push(trailing);
      sawEnd = true;
      offset = bytes.length;
      break;
    }

    if (isStandaloneMarker(marker)) {
      chunks.push(bytes.subarray(markerStart, markerEnd));
      offset = markerEnd;
      continue;
    }

    if (markerEnd + 2 > bytes.length) throw jpegError("truncated segment length");
    const segmentLength = bytes.readUInt16BE(markerEnd);
    if (segmentLength < 2) throw jpegError("invalid segment length");
    const segmentEnd = markerEnd + segmentLength;
    if (segmentEnd > bytes.length) throw jpegError("truncated segment payload");

    const isPrivate = PRIVATE_METADATA_MARKERS.has(marker);
    if (isPrivate) privateMarkers.push(marker);
    if (!stripPrivateMetadata || !isPrivate) {
      chunks.push(bytes.subarray(markerStart, segmentEnd));
    }
    offset = segmentEnd;

    if (marker !== 0xda) continue;

    const scanStart = offset;
    while (offset < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      let markerOffset = offset + 1;
      while (markerOffset < bytes.length && bytes[markerOffset] === 0xff) markerOffset += 1;
      if (markerOffset >= bytes.length) throw jpegError("truncated scan marker");
      const scanMarker = bytes[markerOffset];
      if (scanMarker === 0x00 || (scanMarker >= 0xd0 && scanMarker <= 0xd7)) {
        offset = markerOffset + 1;
        continue;
      }
      chunks.push(bytes.subarray(scanStart, offset));
      break;
    }
  }

  if (!sawEnd) throw jpegError("missing EOI marker");
  return { bytes: Buffer.concat(chunks), privateMarkers };
}

export function stripJpegMetadata(input) {
  return processJpeg(input, { stripPrivateMetadata: true }).bytes;
}

export function assertPublicJpegMetadataSafe(input) {
  const { privateMarkers } = processJpeg(input, { stripPrivateMetadata: false });
  if (privateMarkers.length) {
    throw new Error("Hero asset contains private JPEG metadata");
  }
}
