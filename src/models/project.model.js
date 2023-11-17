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
      maxlength: 100,
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
      maxlength: 100,
    },
    projectType: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
          return urlRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: "",
      sparse: true,
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
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
    },
    designer: String,
    projectType: String,
    applicationType: {
      type: String,
      required: true,
    },
    budget: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
    client: String,
    images: [String],
    trelloUrl: {
      type: String,
      validate: {
        validator: function (value) {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
          return value === "" || urlRegex.test(value);
        },
        message: (props) =>
          props.value === ""
            ? "Trello URL cannot be empty"
            : `${props.value} is not a valid URL!`,
      },
      default: "",
      sparse: true,
    },
    githubUrl: {
      type: String,
      validate: {
        validator: function (value) {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
          return value === "" || urlRegex.test(value);
        },
        message: (props) =>
          props.value === ""
            ? "GitHub URL cannot be empty"
            : `${props.value} is not a valid URL!`,
      },
      default: "",
      sparse: true,
    },
    projectUrl: {
      type: String,
      validate: {
        validator: function (value) {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
          return value === "" || urlRegex.test(value);
        },
        message: (props) =>
          props.value === ""
            ? "Project URL cannot be empty"
            : `${props.value} is not a valid URL!`,
      },
      default: "",
      sparse: true,
    },
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
