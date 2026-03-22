const ImageKit = require('imagekit');
const dotenv = require('dotenv');

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


async function uploadBuffer(buffer, fileName, options = {}) {
  if (!buffer) throw new Error('No file buffer provided');

  const responseFields = Array.isArray(options.responseFields)
    ? options.responseFields.join(',')
    : options.responseFields;

  return imagekit.upload({
    file: buffer,
    fileName: fileName || `upload-${Date.now()}`,
    useUniqueFileName: true,
    folder: options.folder,
    tags: options.tags,

    responseFields,
  });
}

async function deleteFile(fileId) {
  if (!fileId) throw new Error("No file id provided");
  return imagekit.deleteFile(fileId);
}

module.exports = {
  imagekit,
  uploadBuffer,
  deleteFile,
};
