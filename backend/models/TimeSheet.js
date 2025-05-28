import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class TimeSheet extends Model {}

TimeSheet.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tasks",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hoursSpent: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
    modelName: "TimeSheet",
    tableName: "TimeSheets",
    timestamps: true,
  }
);

// Define associations
TimeSheet.associate = (models) => {
  TimeSheet.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });

  TimeSheet.belongsTo(models.Task, {
    foreignKey: "taskId",
    as: "task",
  });

  TimeSheet.belongsTo(models.Project, {
    foreignKey: "projectId",
    as: "project",
  });
};

export default TimeSheet;
