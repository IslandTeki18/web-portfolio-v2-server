import { Project } from "../models/project.model.js";
import { ProjectFeedback } from "../models/project.model.js";
import { breakStringDownToArray } from "../utils/helperFunctions.js";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
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

async function uploadFileToS3(file, title) {
  const key = `${title}/${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  try {
    await s3.send(command);
    return { key };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

const getPresignedUrls = async (imageKeys) => {
  try {
    const presignedUrls = await Promise.all(
      imageKeys.map((key) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        });
        return getSignedUrl(s3, getCommand, { expiresIn: 900 });
      })
    );
    return presignedUrls;
  } catch (error) {
    console.error("Error getting signed URLs: ", error);
    return { error };
  }
};

//@desc     Get all project
//@route    GET /api/projects
//@access   Public
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    if (projects.length <= 0) {
      return res.status(404).json({ message: "No Projects" });
    }
    return res.json(projects);
  } catch (error) {
    console.error("Error getting projects: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get a limited of 6 projects
//@route    GET /api/projects/limited
//@access   Public
const getLimitedProjects = async (_, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 }).limit(6);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No Projects" });
    }

    for (var i = 0; i < projects.length; i++) {
      if (projects[i].images !== undefined) {
        console.log(projects[i].title);

        // Get the image keys from s3 for the project
        const command = new ListObjectsV2Command({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Prefix: projects[i].title,
        });
        const { Contents = [] } = await s3.send(command);
        const imageKeys = Contents.map(({ Key }) => Key);

        // Get the presigned URLs for the images
        const presignedUrls = await getPresignedUrls(imageKeys);
        projects[i].images = presignedUrls;
      }
      // console.log(projects[i].images);
    }
    return res.status(200).json(projects);
    // return res.status(200).json(updatedProjects);
  } catch (error) {
    console.error("Error getting limited projects: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get single project by id
//@route    GET /api/projects/:id
//@access   Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found!" });
    }
    if (project.images) {
      const signedUrls = [];
      for (let image of project.images) {
        const getObjectParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: image,
        };
        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 60 });

        signedUrls.push(url);
      }
      project.images = signedUrls;
      await project.save();
    }
    return res.json(project);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting project", error: error.message });
  }
};

//@desc     Create New Project
//@route    POST /api/projects
//@access   Private/Admin
const postNewProject = async (req, res) => {
  try {
    const {
      title,
      description,
      projectType,
      applicationType,
      status,
      isPublic,
      trelloUrl,
      githubUrl,
      projectUrl,
      budget,
      designer,
      client,
      techStack,
      tags,
    } = req.body;

    // Handle file uploads
    const uploadedFiles = req.files;
    let imageUrls = [];

    if (uploadedFiles && uploadedFiles.length > 0) {
      // Upload each file to S3 and collect the URLs
      imageUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const { key } = await uploadFileToS3(file, title);
          return key;
        })
      );
    }

    const project = new Project({
      user: req.user._id,
      title,
      description,
      projectType,
      applicationType,
      status,
      isPublic,
      trelloUrl,
      githubUrl,
      projectUrl,
      budget,
      designer,
      client,
      techStack: techStack === "" ? [] : breakStringDownToArray(techStack),
      tags: tags === "" ? [] : breakStringDownToArray(tags),
      images: imageUrls,
    });

    const createdProject = await project.save();
    return res.status(201).json(createdProject);
  } catch (error) {
    console.error("Error creating project: ", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//@desc     Update a Project
//@route    PUT /api/projects/:id
//@access   Private/Admin
const putProjectById = async (req, res) => {
  try {
    const {
      title,
      description,
      projectType,
      applicationType,
      designer,
      designType,
      budget,
      client,
      images,
      tags,
      techStack,
      trelloUrl,
      githubUrl,
      projectUrl,
      developerFeedback,
      relatedProjects,
      status,
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project Not Found." });
    }

    project.user = req.user._id;
    project.title = title || project.title;
    project.description = description || project.description;
    project.projectType = projectType || project.projectType;
    project.applicationType = applicationType || project.applicationType;
    project.designer = designer || project.designer;
    project.designType = designType || project.designType;
    project.budget = budget || project.budget;
    project.client = client || project.client;
    project.trelloUrl = trelloUrl;
    project.githubUrl = githubUrl;
    project.projectUrl = projectUrl;
    project.developerFeedback = developerFeedback || project.developerFeedback;
    project.relatedProjects = relatedProjects || project.relatedProjects;
    project.status = status || project.status;

    project.tags =
      tags === "" ? [] : breakStringDownToArray(tags) || project.tags;
    project.techStack =
      techStack === ""
        ? []
        : breakStringDownToArray(techStack) || project.techStack;

    await project.save();

    return res.json(project);
  } catch (error) {
    console.error("Error updating project: ", error);
    return res.status(500).json({
      message: "Internal server error when updating project",
      error: error.message,
    });
  }
};
//@desc     Remove Project Image
//@route    DELETE /api/projects/:id
//@access   Private/Admin
const deleteProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found." });
    }
    project.images = [];
    await project.save();
  } catch (error) {
    console.error("Error deleting project image: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Delete a Project
//@route    DELETE /api/projects/:id
//@access   Private/Admin
const deleteProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found." });
    }
    await project.remove();

    return res.json({ message: "Project Removed" });
  } catch (error) {
    console.error("Error removing project: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Create a developer feedback
//@route    POST /api/projects/:id/feedback
//@access   Private/Admin
const createDeveloperFeedback = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found." });
    }
    const newFeedback = new ProjectFeedback({
      projectId: project._id,
      title: req.body.title,
      description: req.body.description,
    });

    project.developerFeedback.push(newFeedback);
    await project.save();

    return res.json(project);
  } catch (error) {
    console.error("Error creating developer feedback: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Remove developer feedback
//@route    DELETE /api/projects/:id/:feedback_id
//@access   Private/Admin
const deleteDeveloperFeedback = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project Not Found." });
    }

    await project.developerFeedback.id(req.params.feedback_id).remove();
    await project.save();

    return res.send({ message: "Feedback Removed.", project });
  } catch (error) {
    console.error("Error removing developer feedback: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Edit single project feedback
//@route    PUT /api/projects/:id/:feedback_id/edit
//@access   Private/Admin
const updateDeveloperFeedback = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project Not Found." });
    }

    const feedbackObj = project.developerFeedback.find(
      ({ id }) => id === req.params.feedback_id
    );
    if (!feedbackObj) {
      return res.status(404).json({ message: "Feedback Object Not Found." });
    }

    if (req.body.title === "") {
      feedbackObj.title = "";
    }
    feedbackObj.title = req.body.title || feedbackObj.title;

    if (req.body.description === "") {
      feedbackObj.description = "";
    }
    feedbackObj.description = req.body.description || feedbackObj.description;

    await project.save();

    return res.status(200).json({ message: "Feedback Updated." });
  } catch (error) {
    console.error("Error updating developer feedback: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Create a related project object
//@route    POST /api/projects/:id/related
//@access   Private/Admin
const createRelatedProjectObj = async (req, res) => {
  try {
    const { title, projectType, link, tags } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found." });
    }
    let newRelatedObj = {
      title,
      projectType,
      link,
      tags,
    };
    project.relatedProjects.push(newRelatedObj);
    await project.save();

    return res
      .status(200)
      .json({ message: "Related Project Created.", project });
  } catch (error) {
    console.error("Error creating related project object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Delete a related project object
//@route    DELETE /api/projects/:id/:relatedProjectId/remove
//@access   Private/Admin
const deleteRelatedProjectObj = async (req, res) => {
  try {
    const { id, relatedProjectId } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    await project.relatedProjects.id(relatedProjectId).remove();
    await project.save();

    return res
      .status(200)
      .json({ message: "Related Project Removed", project });
  } catch (error) {
    console.error("Error delete a related project object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Updates a Related Project Object
//@route    PUT /api/projects/:id/:relatedProjectId/update
//@access   Private/Admin
const updateRelatedProjectObj = async (req, res) => {
  try {
    const { id, relatedProjectId } = req.params;
    const { title, projectType, link, tags } = req.body;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found." });
    }
    const relatedProject = await project.relatedProjects.id(relatedProjectId);
    if (title) relatedProject.title = title || relatedProject.title;
    if (projectType)
      relatedProject.projectType = projectType || relatedProject.projectType;
    if (link) relatedProject.link = link || relatedProject.link;
    if (tags) relatedProject.tags = tags || relatedProject.tags;

    await project.save();

    return res
      .status(200)
      .json({ message: "Related Project Object Updated!", relatedProject });
  } catch (error) {
    console.error("Error udpating a related project object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getAllProjects,
  getLimitedProjects,
  postNewProject,
  putProjectById,
  getProjectById,
  deleteProjectImage,
  deleteProjectById,
  createDeveloperFeedback,
  deleteDeveloperFeedback,
  updateDeveloperFeedback,
  createRelatedProjectObj,
  deleteRelatedProjectObj,
  updateRelatedProjectObj,
};
