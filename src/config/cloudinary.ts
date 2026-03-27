import { v2 as cloudinary} from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;




//1- create the config file
//2- multer has already been created
//3- import cloudinary and fs from "fs/promises"