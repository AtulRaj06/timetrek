import { User, ProjectMember } from "../models/index.js";

export const getProjectMembersByProjectId = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const userProjects = await ProjectMember.findAll({
      where: {
        projectId: projectId,
        isDeleted: false,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "displayName", "email", "role"], // Only include necessary user fields
        },
      ],
      attributes: ["id", "projectId", "roleInProject", "createdAt"], // Include necessary ProjectMember fields
    });

    return res.status(200).json(userProjects);
  } catch (error) {
    console.error("Error fetching Project members:", error);
    return res.status(500).json({
      message: "Failed to fetch project members",
      error: error.message,
    });
  }
};

// Create new Project Member
export const createProjectMember = async (req, res) => {
  try {
    const { userId, projectId, roleInProject } = req.body;

    // Basic validation
    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ message: "Project and User Id is required" });
    }

    // Check if project name already exists
    const existingProjectMember = await ProjectMember.findOne({
      where: {
        userId: userId,
        projectId: projectId,
      },
    });

    if (existingProjectMember) {
      const updatedProjectMember = await existingProjectMember.update({ isDeleted: false });
      const projectResponse = await updatedProjectMember.toJSON();
      return res.status(201).json(projectResponse);
    }

    // Create new project
    const newProjectMember = await ProjectMember.create({
      userId,
      projectId,
      roleInProject,
    });

    // Return project without sensitive data
    const projectResponse = await newProjectMember.toJSON();
    return res.status(201).json(projectResponse);
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ message: "Failed to create project", error: error.message });
  }
};

// Delete Project Member
export const deleteProjectMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Project Member
    const member = await ProjectMember.findByPk(id);

    if (!member) {
      return res.status(404).json({ message: "Project Member not found" });
    }
    // Prevent deleting project owner
    if (member.roleInProject === "owner") {
      return res.status(500).json({ message: "Project owner cannot be deleted." });
    }

    // Soft Delete user
    await member.update({ isDeleted: true });

    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete member", error: error.message });
  }
};
