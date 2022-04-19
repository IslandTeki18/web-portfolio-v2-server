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
    },
    description: {
      type: String,
    },
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
    designer: {
      type: String,
      required: false,
    },
    designType: {
      type: String,
      required: false,
    },
    client: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
    },
    githubUrl: {
      type: String,
    },
    projectUrl: {
      type: String,
    },
    techStack: {
      type: [String],
    },
    developerFeedback: [developerFeedbackSchema],
    relatedProjects: [
      {
        title: { type: String },
        projectType: { type: String },
        link: { type: String },
      },
    ],
    status: {
      type: String,
      default: "Not Live",
      enum: ["Live", "Under Construction", "Not Live", "Remodeling"],
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

export { Project, ProjectFeedback };
