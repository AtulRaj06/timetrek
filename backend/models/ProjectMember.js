import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ProjectMember extends Model {}

ProjectMember.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    roleInProject: {
      type: DataTypes.ENUM("owner", "member"),
      defaultValue: "member",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelize,
    modelName: "ProjectMember",
    tableName: "ProjectMembers",
    timestamps: true,
  }
);

// Define associations
ProjectMember.associate = (models) => {
  ProjectMember.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  ProjectMember.belongsTo(models.Project, {
    foreignKey: 'projectId',
    as: 'project'
  });
};

export default ProjectMember;
