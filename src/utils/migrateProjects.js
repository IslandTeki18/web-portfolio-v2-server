import mongoose from "mongoose";
import { Project } from "../models/project.model.js";

async function migrateProjects() {
  try {
    console.log("Starting Migration");
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      "mongodb+srv://admin:9Wik7isWdtQEh4A@cluster0.basf6.mongodb.net/<dbname>?retryWrites=true&w=majority"
    );
    const projects = await Project.find({});

    console.log("Project Migration was successful.");
  } catch (error) {
    console.log("Error during migration: ", error);
  } finally {
    mongoose.disconnect();
  }
}

migrateProjects();
