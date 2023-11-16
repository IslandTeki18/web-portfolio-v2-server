import { Project } from "../models/project.model.js";
import { ProjectFeedback } from "../models/project.model.js";

//@desc     Get all project
//@route    GET /api/projects
//@access   Public
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    if (!projects) {
      return res.status(404).json({ message: "No Projects" });
    }
    return res.json(projects);
  } catch (error) {
    console.error("Error getting projects: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get a limited of 6 projects
//@route    GET /api/projects
//@access   Public
const getLimitedProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 }).limit(6);
    if (!projects) {
      return res.status(404).json({ message: "No Projects" });
    }
    return res.status(200).json(projects);
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
    return res.json(project);
  } catch (error) {
    console.error("Error getting specific project: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Create New Project
//@route    POST /api/projects
//@access   Private/Admin
const postNewProject = async (req, res) => {
  try {
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
      trelloUrl: "",
      tags: [],
      techStack: [],
      developerFeedback: [],
      relatedProjects: [],
      status: "Not Live",
    });

    const createdProject = await project.save();
    return res.status(201).json(createdProject);
  } catch (error) {
    console.error("Error creating project: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
      type,
      designer,
      designType,
      client,
      images,
      tags,
      trelloUrl,
      githubUrl,
      projectUrl,
      techStack,
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
    project.type = type || project.type;
    project.designer = designer || project.designer;
    project.designType = designType || project.designType;
    project.client = client || project.client;
    project.images = images === "" ? [] : images || project.images;
    project.tags = tags || project.tags;
    project.trelloUrl = trelloUrl || trelloUrl;
    project.githubUrl = githubUrl || project.githubUrl;
    project.projectUrl = projectUrl || project.projectUrl;
    project.techStack = techStack || project.techStack;
    project.developerFeedback = developerFeedback || project.developerFeedback;
    project.relatedProjects = relatedProjects || project.relatedProjects;
    project.status = status || project.status;

    await project.save();

    return res.json(project);
  } catch (error) {
    console.error("Error updating project: ", error);
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
    project.save();

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

    project.developerFeedback.id(req.params.feedback_id).remove();
    project.save();

    return res.send({ msg: "Feedback Removed.", project });
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
      res.status(404).json({ message: "Project Not Found." });
    }

    const feedbackObj = project.developerFeedback.find(
      ({ id }) => id === req.params.feedback_id
    );
    if (!feedbackObj) {
      res.status(404).json({ message: "Feedback Object Not Found." });
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

    return res.send({ msg: "Feedback Updated." });
  } catch (error) {
    console.error("Error updating developer feedback: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Create a related project object
//@route    POST /api/projects/:id/create-related
//@access   Private/Admin
const createRelatedProjectObj = async (req, res) => {
  try {
    const { title, projectType, link, tags } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project Not Found." });
    }
    let newRelatedObj = {
      title,
      projectType,
      link,
      tags,
    };
    project.relatedProjects.push(newRelatedObj);
    await project.save();
    
    return res.status(200).json({ msg: "Related Project Created.", project });
  } catch (error) {
    console.error("Error creating related project object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Delete a related project object
//@route    DELETE /api/projects/:id/remove-related
//@access   Private/Admin
// const deleteRelatedProjectObj = async (req, res) => {
//   const project = await Project.findById(req.params.id)
//   if (!project) {
//     res.status(404)
//     throw new Error("Project not found.")
//   }
//   try {
//     project.relatedProjects.filter(item => item === )
//   } catch (error) {
//     res.status(500)
//     throw new Error(error)
//   }
// }

export {
  getAllProjects,
  getLimitedProjects,
  postNewProject,
  putProjectById,
  getProjectById,
  deleteProjectById,
  createDeveloperFeedback,
  deleteDeveloperFeedback,
  updateDeveloperFeedback,
  createRelatedProjectObj,
};
