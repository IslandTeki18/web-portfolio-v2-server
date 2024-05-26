import { Project } from "../models/project.model.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

function randomImageName() {
  let randomNumberString = "";
  for (let i = 0; i < 16; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
    randomNumberString += randomDigit.toString();
  }
  return randomNumberString;
}

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
  const imageName = randomImageName();
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const project = await Project.findById(req.params.id);
  // Send to AWS S3
  const command = new PutObjectCommand(params);
  await s3.send(command);

  if (project) {
    project.images = [imageName];
    await project.save();
    res.status(201).json(project);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
};
