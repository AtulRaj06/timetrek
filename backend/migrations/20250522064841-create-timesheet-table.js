export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("TimeSheets", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    taskId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Tasks",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    note: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    hoursSpent: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex("TimeSheets", [
    "isDeleted",
    "userId",
    "taskId",
    "projectId",
    "date",
  ]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("TimeSheets");
  await queryInterface.removeIndex("TimeSheets", [
    "isDeleted",
    "userId",
    "taskId",
    "projectId",
    "date",
  ]);
}
