import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { AuditService } from './auditService';

export interface UploadResult {
  fileUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  hashSha256: string;
  storageProvider: 'cloudinary' | 'local_secure';
  width?: number;
  height?: number;
  durationSeconds?: number;
  publicId?: string;
  createdAt: string;
}

export interface CloudinaryDiagnostic {
  configured: boolean;
  cloudName?: string;
  apiKeyPresent: boolean;
  apiSecretPresent: boolean;
  canUpload: boolean;
  message: string;
}

export class StorageService {
  private static uploadBaseDir = path.resolve(process.cwd(), 'uploads');
  private static manuscriptsDir = path.resolve(process.cwd(), 'uploads/manuscripts');
  private static mediaDir = path.resolve(process.cwd(), 'uploads/media');

  public static initialize(): void {
    if (!fs.existsSync(this.uploadBaseDir)) fs.mkdirSync(this.uploadBaseDir, { recursive: true });
    if (!fs.existsSync(this.manuscriptsDir)) fs.mkdirSync(this.manuscriptsDir, { recursive: true });
    if (!fs.existsSync(this.mediaDir)) fs.mkdirSync(this.mediaDir, { recursive: true });
  }

  /**
   * Diagnostic check of Cloudinary environment credentials
   */
  public static async testCloudinaryConnection(): Promise<CloudinaryDiagnostic> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const apiKeyPresent = !!apiKey && !apiKey.includes('YOUR_');
    const apiSecretPresent = !!apiSecret && !apiSecret.includes('YOUR_');
    const cloudNamePresent = !!cloudName && !cloudName.includes('YOUR_') && cloudName !== 'replace_me';

    const configured = cloudNamePresent && apiKeyPresent && apiSecretPresent;

    return {
      configured,
      cloudName: cloudName || undefined,
      apiKeyPresent,
      apiSecretPresent,
      canUpload: configured,
      message: configured
        ? `Cloudinary storage target active: https://res.cloudinary.com/${cloudName}`
        : 'Cloudinary environment variables not configured with authenticated credentials. Utilizing local persistent disk storage with cryptographic SHA256 integrity.',
    };
  }

  /**
   * Generate official Cloudinary SHA1 signature
   * signature = SHA1(sorted_params + api_secret)
   */
  private static generateCloudinarySignature(params: Record<string, string | number>, apiSecret: string): string {
    const sortedKeys = Object.keys(params).sort();
    const toSign = sortedKeys.map((key) => `${key}=${params[key]}`).join('&') + apiSecret;
    return crypto.createHash('sha1').update(toSign).digest('hex');
  }

  /**
   * Upload file with strict type and size validation
   */
  public static async saveUploadedFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    category: 'manuscript' | 'media' = 'manuscript'
  ): Promise<UploadResult> {
    this.initialize();

    // 1. Strict File Type Validation Whitelist
    const allowedManuscriptMimes = [
      'application/pdf',
      'text/markdown',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedMediaMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/avif',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/m4a',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];

    const allowedMimes = category === 'manuscript' ? allowedManuscriptMimes : allowedMediaMimes;

    if (!allowedMimes.includes(mimeType)) {
      throw new Error(
        `Disallowed file type: ${mimeType}. Allowed formats for ${category}: ${allowedMimes.join(', ')}.`
      );
    }

    // 2. Strict Upload Size Limits
    const isAudioVideo = mimeType.startsWith('video/') || mimeType.startsWith('audio/');
    const MAX_SIZE = isAudioVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024; // 50MB audio/video, 15MB docs/images

    if (fileBuffer.length > MAX_SIZE) {
      const maxMb = (MAX_SIZE / (1024 * 1024)).toFixed(0);
      const actualMb = (fileBuffer.length / (1024 * 1024)).toFixed(1);
      throw new Error(`File size (${actualMb}MB) exceeds the maximum allowed limit of ${maxMb}MB.`);
    }

    // 3. Compute SHA-256 integrity hash
    const hashSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const now = new Date().toISOString();

    // 4. Authenticated Cloudinary Upload Integration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const hasCloudinary =
      cloudName &&
      apiKey &&
      apiSecret &&
      !apiKey.includes('YOUR_') &&
      !apiSecret.includes('YOUR_');

    if (hasCloudinary) {
      const resourceType = mimeType.startsWith('video/')
        ? 'video'
        : mimeType.startsWith('image/')
        ? 'image'
        : 'raw';

      const timestamp = Math.floor(Date.now() / 1000);
      const publicId = `tathastu/${category}/${hashSha256.slice(0, 16)}`;

      const signature = this.generateCloudinarySignature(
        { public_id: publicId, timestamp },
        apiSecret
      );

      try {
        const formData = new FormData();
        const base64Data = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        formData.append('file', base64Data);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('public_id', publicId);
        formData.append('signature', signature);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          await AuditService.log({
            action: 'media:cloudinary_uploaded',
            resourceType: 'media_asset',
            resourceId: publicId,
            details: { url: json.secure_url, format: json.format, sizeBytes: fileBuffer.length },
          });

          return {
            fileUrl: json.secure_url,
            originalName,
            mimeType,
            sizeBytes: fileBuffer.length,
            hashSha256,
            storageProvider: 'cloudinary',
            publicId: json.public_id,
            width: json.width,
            height: json.height,
            durationSeconds: json.duration,
            createdAt: now,
          };
        } else {
          const errText = await res.text();
          console.warn(`[StorageService] Cloudinary API returned ${res.status}: ${errText}. Falling back to persistent disk store.`);
        }
      } catch (err: any) {
        console.warn(`[StorageService] Cloudinary upload error: ${err.message}. Falling back to persistent disk store.`);
      }
    }

    // 5. Persistent Local Disk Storage
    const targetDir = category === 'manuscript' ? this.manuscriptsDir : this.mediaDir;
    const safeExt = path.extname(originalName).toLowerCase() || (mimeType.startsWith('image/') ? '.png' : '.bin');
    const safeFilename = `${Date.now()}-${hashSha256.slice(0, 16)}${safeExt}`;
    const targetPath = path.join(targetDir, safeFilename);

    await fs.promises.writeFile(targetPath, fileBuffer);

    const publicUrl =
      category === 'manuscript'
        ? `/api/editorial/manuscripts/files/${safeFilename}`
        : `/uploads/media/${safeFilename}`;

    await AuditService.log({
      action: 'media:disk_saved',
      resourceType: 'media_asset',
      resourceId: safeFilename,
      details: { path: targetPath, mimeType, sizeBytes: fileBuffer.length },
    });

    return {
      fileUrl: publicUrl,
      originalName,
      mimeType,
      sizeBytes: fileBuffer.length,
      hashSha256,
      storageProvider: 'local_secure',
      publicId: safeFilename,
      createdAt: now,
    };
  }

  /**
   * Delete uploaded file
   */
  public static async deleteUploadedFile(fileUrl: string): Promise<boolean> {
    try {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (fileUrl.startsWith('https://res.cloudinary.com') && cloudName && apiKey && apiSecret) {
        // Parse public_id from Cloudinary URL
        const urlParts = fileUrl.split('/upload/');
        if (urlParts.length > 1) {
          const afterUpload = urlParts[1].replace(/^v\d+\//, ''); // strip version prefix
          const publicIdWithExt = afterUpload.split('.')[0]; // strip extension

          const timestamp = Math.floor(Date.now() / 1000);
          const signature = this.generateCloudinarySignature({ public_id: publicIdWithExt, timestamp }, apiSecret);

          const formData = new FormData();
          formData.append('public_id', publicIdWithExt);
          formData.append('api_key', apiKey);
          formData.append('timestamp', timestamp.toString());
          formData.append('signature', signature);

          const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
          await fetch(destroyUrl, { method: 'POST', body: formData });
          return true;
        }
      }

      const basename = path.basename(fileUrl);
      const manuscriptPath = path.join(this.manuscriptsDir, basename);
      const mediaPath = path.join(this.mediaDir, basename);

      if (fs.existsSync(manuscriptPath)) {
        await fs.promises.unlink(manuscriptPath);
        return true;
      }
      if (fs.existsSync(mediaPath)) {
        await fs.promises.unlink(mediaPath);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[StorageService] Error deleting file:', err);
      return false;
    }
  }

  public static getFilePath(filename: string, category: 'manuscript' | 'media' = 'manuscript'): string {
    const safeName = path.basename(filename);
    const targetDir = category === 'manuscript' ? this.manuscriptsDir : this.mediaDir;
    return path.join(targetDir, safeName);
  }
}
