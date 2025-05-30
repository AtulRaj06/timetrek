import bcrypt from "bcryptjs";

export async function up(queryInterface, Sequelize) {
  // First check if super admin exists
  const existingSuperAdmin = await queryInterface.sequelize.query(
    `SELECT * FROM "Users" WHERE role = 'super_admin' LIMIT 1`,
    {
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  // If super admin exists, don't proceed with seeding
  if (existingSuperAdmin.length > 0) {
    console.log("Super admin already exists. Skipping seeder.");
    return;
  }

  const encryptedPass = await bcrypt.hash("securepassword", 10);
  await queryInterface.bulkInsert(
    "Users",
    [
      {
        displayName: "John Doe",
        email: "example2@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "user",
        isInternal: true,
        password: encryptedPass,
        isDeleted: false,
      },
      {
        displayName: "Super Admin",
        email: "sadmin2@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "super_admin",
        isInternal: true,
        password: encryptedPass,
        isDeleted: false,
      },
      {
        displayName: "Project Admin",
        email: "padmin2@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "project_admin",
        isInternal: true,
        password: encryptedPass,
        isDeleted: false,
      },
    ],
    {}
  );
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("Users", null, {});
}
