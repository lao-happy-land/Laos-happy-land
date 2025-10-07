import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
  v2,
} from 'cloudinary';
import { Multer } from 'multer';
import bufferToStream = require('buffer-to-stream');
import path = require('path');
import { ConfigService } from '@nestjs/config';
const sharp = require('sharp');



@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImageFile(
    file: Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      bufferToStream(compressedBuffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async getFileUrl(publicId: string) {
    try {
      const result = await cloudinary.url(publicId, { secure: true });
      return result;
    } catch (error) {
      console.error('Error getting file URL from Cloudinary:', error);
      throw error;
    }
  }

  extractPublicIdFromUrl(fileUrl: string): string {
    const parts = fileUrl.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.').slice(0, -1).join('.');
    return publicId;
  }

  async uploadAndReturnImageUrl(file: Multer.File): Promise<string> {
    try {
      const result = await this.uploadImageFile(file);
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  }
}