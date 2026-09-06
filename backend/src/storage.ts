/**
 * Storage Abstraction Layer
 * Handles safe file upload validation (size, MIME type, safe file references),
 * data URL encoding, and cloud storage abstraction.
 */

export interface IStoredFile {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string; // Data URL or cloud object URL
  uploadedAt: string;
}

// Max 5 MB per document/photo
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

/**
 * Validates file properties (MIME type and size limit)
 */
export function validateFileProperties(
  mimeType: string,
  sizeBytes: number
): { valid: boolean; error?: string } {
  const normalizedMime = mimeType.toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.includes(normalizedMime)) {
    return {
      valid: false,
      error: `Invalid file format "${mimeType}". Allowed formats: JPG, PNG, WEBP, PDF.`,
    };
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMB} MB) exceeds maximum allowed limit of 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes original filename to prevent path traversal or unsafe characters
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

/**
 * Process a file payload (e.g. data URL or base64) into a safe stored file reference
 */
export function processUploadedFile(
  fileName: string,
  dataUrlOrBase64: string,
  declaredMimeType?: string
): IStoredFile {
  let mimeType = declaredMimeType || "application/octet-stream";
  let payload = dataUrlOrBase64;

  if (dataUrlOrBase64.startsWith("data:")) {
    const match = dataUrlOrBase64.match(/^data:([^;]+);base64,/);
    if (match) {
      mimeType = match[1];
    }
  }

  // Calculate approximate byte size from base64 string
  const base64Content = payload.includes(",") ? payload.split(",")[1] : payload;
  const sizeBytes = Math.round((base64Content.length * 3) / 4);

  const validation = validateFileProperties(mimeType, sizeBytes);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const safeName = sanitizeFileName(fileName || "document");

  return {
    originalName: safeName,
    mimeType,
    sizeBytes,
    url: payload,
    uploadedAt: new Date().toISOString(),
  };
}
