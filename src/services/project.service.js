import asyncHandler from "express-async-handler";
import { Project } from "../models/project.model.js";
import { ProjectFeedback } from "../models/project.model.js";

//@desc     Get all project
//@route    GET /api/projects
//@access   Public
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  if (!projects) {
    res.status(404);
    throw new Error("Projects not found");
  }
  res.json(projects);
});

//@desc     Get single project by id
//@route    GET /api/projects/:id
//@access   Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  return res.json(project);
});

//@desc     Create New Project
//@route    POST /api/projects
//@access   Private/Admin
const postNewProject = asyncHandler(async (req, res) => {
  const project = new Project({
    user: req.user._id,
    title: "Project Title",
    description: "Project Description",
    type: "Project Type",
    designer: "Project Designer",
    designType: "Project Design Type",
    client: "Project Client",
    images: [],
    githubUrl: "",
    projectUrl: "",
    techStack: [],
    developerFeedback: [],
    relatedProjects: [],
    status: "Not Live",
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

//@desc     Update a Project
//@route    PUT /api/projects/:id
//@access   Private/Admin
const putProjectById = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    designer,
    designType,
    client,
    images,
    githubUrl,
    projectUrl,
    techStack,
    developerFeedback,
    relatedProjects,
    status,
  } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project Not Found.");
  }
  try {
    project.user = req.user._id;
    project.title = title || project.title;
    project.description = description || project.description;
    project.type = type || project.type;
    project.designer = designer || project.designer;
    project.designType = designType || project.designType;
    project.client = client || project.client;
    project.images = images === "" ? [] : images || project.images;
    project.githubUrl = githubUrl || project.githubUrl;
    project.projectUrl = projectUrl || project.projectUrl;
    project.techStack = techStack || project.techStack;
    project.developerFeedback = developerFeedback || project.developerFeedback;
    project.relatedProjects = relatedProjects || project.relatedProjects;
    project.status = status || project.status;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

//@desc     Delete a Project
//@route    DELETE /api/projects/:id
//@access   Private/Admin
const deleteProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.remove();
    res.json({ message: "Project Removed" });
  } else {
    res.json(404);
    throw new Error("Project not found");
  }
});

//@desc     Create a developer feedback
//@route    POST /api/projects/:id/feedback
//@access   Private/Admin
const createDeveloperFeedback = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project Not Found.");
  }
  try {
    const newFeedback = new ProjectFeedback({
      projectId: project._id,
      title: req.body.title,
      description: req.body.description,
    });
    project.developerFeedback.push(newFeedback);
    project.save();
    res.json(project);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

//@desc     Remove developer feedback
//@route    DELETE /api/projects/:id/:feedback_id
//@access   Private/Admin
const deleteDeveloperFeedback = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }
  project.developerFeedback.id(req.params.feedback_id).remove();
  project.save();
  res.send({ msg: "Feedback Removed.", project });
});

//@desc     Edit single project feedback
//@route    PUT /api/projects/:id/:feedback_id/edit
//@access   Private/Admin
const updateDeveloperFeedback = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }
  const feedbackObj = project.developerFeedback.find(
    ({ id }) => id === req.params.feedback_id
  );
  if (feedbackObj === undefined) {
    res.status(500);
    throw new Error("Feedback object not found.");
  }
  if (req.body.title === "") {
    feedbackObj.title = "";
  }
  feedbackObj.title = req.body.title || feedbackObj.title;

  if (req.body.description === "") {
    feedbackObj.description = "";
  }
  feedbackObj.description = req.body.description || feedbackObj.description;

  project.save();
  res.send({ msg: "Feedback Updated." });
});

export {
  getAllProjects,
  postNewProject,
  putProjectById,
  getProjectById,
  deleteProjectById,
  createDeveloperFeedback,
  deleteDeveloperFeedback,
  updateDeveloperFeedback,
};
