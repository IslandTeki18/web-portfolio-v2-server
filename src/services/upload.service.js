import AWS from "aws-sdk"
import { Project } from "../models/project.model.js";

//@desc     Post project images
//@route    POST /api/upload/:id
//@access   Private/Admin
export const uploadProductImage = async (req, res) => {
  const imageUrls = req.files.map((file) => file.location);
  const project = await Project.findById(req.params.id);
  if (project) {
    project.images = imageUrls;
    await project.save();
    res.status(201).json({ message: "Image uploaded successfully" });
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
}