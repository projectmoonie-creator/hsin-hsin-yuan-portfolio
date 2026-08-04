const COMMENT_MARKER = 0xfe;

function isApplicationMarker(marker) {
  return marker >= 0xe0 && marker <= 0xef;
}

function isJfifApp0(bytes, marker, payloadStart, segmentEnd, sawJfifApp0) {
  if (marker !== 0xe0) return false;
  if (sawJfifApp0 || segmentEnd - payloadStart < 14) return false;
  if (bytes[payloadStart] !== 0x4a
    || bytes[payloadStart + 1] !== 0x46
    || bytes[payloadStart + 2] !== 0x49
    || bytes[payloadStart + 3] !== 0x46
    || bytes[payloadStart + 4] !== 0x00) return false;

  const versionMajor = bytes[payloadStart + 5];
  const versionMinor = bytes[payloadStart + 6];
  const densityUnits = bytes[payloadStart + 7];
  const xDensity = bytes.readUInt16BE(payloadStart + 8);
  const yDensity = bytes.readUInt16BE(payloadStart + 10);
  const thumbnailWidth = bytes[payloadStart + 12];
  const thumbnailHeight = bytes[payloadStart + 13];
  const expectedPayloadLength = 14 + (3 * thumbnailWidth * thumbnailHeight);

  return versionMajor === 1
    && versionMinor <= 2
    && densityUnits <= 2
    && xDensity > 0
    && yDensity > 0
    && segmentEnd - payloadStart === expectedPayloadLength;
}

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
  let sawJfifApp0 = false;

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

    const payloadStart = markerEnd + 2;
    const approvedJfif = isJfifApp0(
      bytes,
      marker,
      payloadStart,
      segmentEnd,
      sawJfifApp0,
    );
    if (approvedJfif) sawJfifApp0 = true;
    const isPrivate = marker === COMMENT_MARKER
      || (isApplicationMarker(marker) && !approvedJfif);
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
