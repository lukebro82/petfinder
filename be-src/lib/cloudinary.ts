import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "dhyqdyzw8",
  api_key: process.env.CLOUDYKEY,
  api_secret: process.env.CLOUDYSECRET, // Click 'View API Keys' above to copy your API secret
});

export { cloudinary };
