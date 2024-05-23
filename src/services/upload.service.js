import { Project } from "../models/project.model.js";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESSKEYID,
    secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY,
  },
});

//@desc     Post project images
//@route    POST /api/upload/:id
//@access   Private/Admin
export const uploadProductImage = async (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const getObjectParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: req.file.originalname,
  };
  
  const project = await Project.findById(req.params.id);
  const command = new PutObjectCommand(params);
  const getCommand = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
  try {
    await s3.send(command);
  } catch (error) {
    console.error(error);
  }
  if (project) {
    if (project.images) {
      project.images = project.images.concat(url);
    }
    await project.save();
    res.status(201).json({ message: "Image uploaded successfully" });
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
};
