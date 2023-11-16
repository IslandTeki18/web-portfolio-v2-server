import { Project } from "../models/project.model.js";

export async function migrateProjects() {
  try {
    console.log("Starting Migration");
    const projects = await Project.find({});
    if (!projects) {
      console.log("No Projects");
    } else {
      for (var i = 0; i < projects.length; i++) {
        console.log("Migration project: ", projects[i]._id);
        projects[i].tags = [];
        projects[i].relatedProjects = [];
        await projects[i].save();
        console.log("Project Migrated: ", project[i]._id);
      }
      console.log("Project Migration was successful.");
    }
  } catch (error) {
    console.log("Error during migration: ", error);
  }
}

migrateProjects()

