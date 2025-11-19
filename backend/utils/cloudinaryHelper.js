import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Buffer থেকে Cloudinary তে upload করে
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadToCloudinary = (fileBuffer, folder = 'food-recipes') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Buffer কে stream এ convert করে upload
    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Cloudinary থেকে image delete করে
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Cloudinary URL থেকে public ID বের করে
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {string} - Public ID
 */
export const getPublicIdFromUrl = (imageUrl) => {
  try {
    // Example: https://res.cloudinary.com/demo/image/upload/v1234/folder/image.jpg
    // Public ID: folder/image
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};