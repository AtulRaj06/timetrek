export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Projects", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // removed because a project can have multiple owners
    // ownerId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "Users",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // },
    startDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("active", "on_hold", "cancelled"),
      defaultValue: "active",
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

  await queryInterface.addIndex("Projects", ["isDeleted"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Projects");
  await queryInterface.sequelize.query(
    "DROP TYPE IF EXISTS enum_Projects_status;"
  );
  await queryInterface.removeIndex("Projects", ["isDeleted"]);
}
