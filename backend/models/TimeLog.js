import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class TimeLog extends Model {}

TimeLog.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    task: {
      type: DataTypes.ENUM(
        "analysis",
        "coding",
        "testing",
        "documentation",
        "meeting"
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
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
    modelName: "TimeLog",
    tableName: "TimeLogs",
    timestamps: true,
  }
);

// Define associations
TimeLog.associate = (models) => {
  TimeLog.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });

  TimeLog.belongsTo(models.Project, {
    foreignKey: "projectId",
    as: "project",
  });
};

export default TimeLog;
