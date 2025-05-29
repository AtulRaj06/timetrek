import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import process from "process";

// Import your models
import User from "./User.js";
import Project from "./Project.js";
import ProjectMember from "./ProjectMember.js";
import TimeLog from "./TimeLog.js";

const env = process.env.NODE_ENV || "development";

import config from "../config/config.js";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Initialize models
const models = {
  User: User,
  Project: Project,
  ProjectMember: ProjectMember,
  TimeLog: TimeLog,
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
export { sequelize, User, Project, ProjectMember, TimeLog };
export default models;
