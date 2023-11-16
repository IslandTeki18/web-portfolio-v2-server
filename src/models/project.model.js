import mongoose from "mongoose";
const { Schema } = mongoose;

const developerFeedbackSchema = new Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const relatedProjectsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

const projectSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    designer: String,
    designType: String,
    client: String,
    images: [String],
    githubUrl: String,
    projectUrl: String,
    techStack: [String],
    tags: [String],
    developerFeedback: [developerFeedbackSchema],
    relatedProjects: [relatedProjectsSchema],
    status: {
      type: String,
      default: "Not Live",
      enum: ["Live", "Under Construction", "Not Live", "On Hold", "Remodeling"],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
const ProjectFeedback = mongoose.model(
  "ProjectFeedback",
  developerFeedbackSchema
);
const ProjectRelatedProjects = mongoose.model(
  "ProjectRelatedProjects",
  relatedProjectsSchema
);

export { Project, ProjectFeedback, ProjectRelatedProjects };
