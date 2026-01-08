const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDataUri(dataUri, options = {}) {
  return cloudinary.uploader.upload(dataUri, options);
}

async function destroy(publicId, options = {}) {
  if (!publicId) return { result: 'no_public_id' };
  return cloudinary.uploader.destroy(publicId, options);
}

module.exports = {
  uploadDataUri,
  destroy,
  cloudinary,
};
