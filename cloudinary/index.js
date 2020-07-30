const crypto = require('crypto');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'wiltandshadow',
  api_key: '385515688559952',
  api_secret: process.env.CLOUDINARY_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'emily-blog',
  allowedFormats: ['jpeg', 'jpg', 'png'],
  filename: function (req, file, cb) {
    let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');
    let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
    uniqFileName += buf;
    cb(undefined, uniqFileName );
  }
});

const parser = multer({ storage: storage });

module.exports = {
  cloudinary,
  storage,
  parser
};