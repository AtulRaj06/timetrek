export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Tasks", {
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
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("todo", "inprogress", "done"),
      defaultValue: "todo",
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

    await queryInterface.addIndex('Tasks', ['isDeleted', 'userId', 'projectId']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Tasks");
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_Tasks_status;');
  await queryInterface.removeIndex('Tasks', ['isDeleted', 'userId', 'projectId']);
}
