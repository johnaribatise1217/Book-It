import cloudinary from 'cloudinary'
import { resolve } from 'path'

interface upload{
  public_id : string
  url : string
}

cloudinary.v2.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET
})

//function to upload file
const upload_file = (
  file : string,
  folder : string
) : Promise<upload> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type : "auto",
        folder : folder
      },
      (error, result : any) => {
        resolve({
          public_id : result.public_id,
          url : result.url
        })
      }
    )
  })
}

const delete_file = async (file : string) : Promise<boolean> => {
  const res = await cloudinary.v2.uploader.destroy(file)
  if(res?.result === 'ok') return true
  return false
}

export {upload_file, delete_file, cloudinary}