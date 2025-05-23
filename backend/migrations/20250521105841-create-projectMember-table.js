export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("ProjectMembers", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
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
    roleInProject: {
      type: Sequelize.ENUM("owner", "member"),
      defaultValue: "member",
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

  await queryInterface.addIndex("ProjectMembers", ["isDeleted", "userId", "projectId"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("ProjectMembers");
  await queryInterface.removeIndex("ProjectMembers", ["isDeleted", "userId", "projectId"]);
}
