const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: "dakhblh3a",  
  api_key: "138714524966558",  
  api_secret: "NvDNb6KlPcp-BxAAF9z8WPFhE14",  
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const formattedPath = path.resolve(localFilePath).replace(/\\/g, "/"); 

    const result = await cloudinary.uploader.upload(formattedPath, {
      resource_type: "image", 
    });

    // Remove file after upload
    fs.unlinkSync(formattedPath);
    

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // Cleanup in case of failure
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

module.exports = uploadOnCloudinary;
