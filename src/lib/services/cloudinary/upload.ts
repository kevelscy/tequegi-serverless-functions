// import { cloudinary } from './config'

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImg = async (image: File) => {
  const uploadedImage = await cloudinary.uploader.upload(image,
  {
    upload_preset: 'product',
    allowed_formats: ['png', 'jpg', 'jpeg', 'webp']

  },
  (error, result) => {
    console.log('uploadImg result', result)
    console.log('uploadImg error', error)
  })

  return {
    uploadedImage: uploadedImage || null
  }
}