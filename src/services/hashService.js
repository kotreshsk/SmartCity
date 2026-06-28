/**
 * Generates a SHA-256 hash from image blob, coordinates, and timestamp
 * Used for tamper detection in offline queue and proof verification
 */
export const generateHash = async (imageBlob, lat, lng, timestamp) => {
  if (!crypto || !crypto.subtle) {
    console.warn("SubtleCrypto not supported in this environment");
    return "hash_not_supported";
  }

  try {
    const encoder = new TextEncoder();
    const arrayBuffer = await imageBlob.arrayBuffer();
    
    // Create a combined array of the image data and the metadata string
    const metadataString = `\${lat}:\${lng}:\${timestamp}`;
    const metadataBytes = encoder.encode(metadataString);
    
    const combinedData = new Uint8Array(arrayBuffer.byteLength + metadataBytes.byteLength);
    combinedData.set(new Uint8Array(arrayBuffer), 0);
    combinedData.set(metadataBytes, arrayBuffer.byteLength);

    const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
    
    // Convert buffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error("Error generating hash:", error);
    throw error;
  }
};
