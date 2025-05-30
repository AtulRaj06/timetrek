export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("TimeLogs", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
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
    text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    task: {
      type: Sequelize.ENUM(
        "analysis",
        "coding",
        "testing",
        "documentation",
        "meeting"
      ),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
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

  await queryInterface.addIndex("TimeLogs", [
    "isDeleted",
    "userId",
    "projectId",
    "task",
    "status",
    "start",
    "end",
  ]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("TimeLogs");
  await queryInterface.removeIndex("TimeLogs", [
    "isDeleted",
    "userId",
    "projectId",
    "task",
    "status",
    "start",
    "end",
  ]);
}
