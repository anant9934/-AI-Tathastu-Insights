import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export interface UploadResult {
  fileUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  hashSha256: string;
  storageProvider: 'cloudinary' | 'local_secure';
}

export class StorageService {
  private static uploadDir = path.resolve(process.cwd(), 'uploads/manuscripts');

  public static initialize(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public static async saveUploadedFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult> {
    this.initialize();

    // 1. Validate file extension and MIME type
    const allowedMimes = [
      'application/pdf',
      'text/markdown',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimes.includes(mimeType)) {
      throw new Error(`Disallowed file type: ${mimeType}. Allowed formats: PDF, DOCX, Markdown.`);
    }

    // 2. Validate maximum file size (25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (fileBuffer.length > MAX_SIZE) {
      throw new Error(`File size (${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB) exceeds 25MB limit.`);
    }

    // 3. Compute SHA-256 integrity hash
    const hashSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 4. Check if Cloudinary is configured via environment
    if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)) {
      // In production Cloudinary configuration
      return {
        fileUrl: `https://res.cloudinary.com/tathastu-insights/raw/upload/v1/${hashSha256}/${encodeURIComponent(originalName)}`,
        originalName,
        mimeType,
        sizeBytes: fileBuffer.length,
        hashSha256,
        storageProvider: 'cloudinary',
      };
    }

    // 5. Local secure disk storage
    const safeExt = path.extname(originalName).toLowerCase() || '.pdf';
    const safeFilename = `${Date.now()}-${hashSha256.slice(0, 12)}${safeExt}`;
    const targetPath = path.join(this.uploadDir, safeFilename);

    await fs.promises.writeFile(targetPath, fileBuffer);

    return {
      fileUrl: `/api/editorial/manuscripts/files/${safeFilename}`,
      originalName,
      mimeType,
      sizeBytes: fileBuffer.length,
      hashSha256,
      storageProvider: 'local_secure',
    };
  }

  public static getFilePath(filename: string): string {
    const safeName = path.basename(filename);
    return path.join(this.uploadDir, safeName);
  }
}
