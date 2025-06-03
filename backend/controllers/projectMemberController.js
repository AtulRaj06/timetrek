import { User, ProjectMember } from "../models/index.js";
import {
  checkProjectMembership,
  fetchUserProjectMembership,
} from "../utils/projectMemberUtils.js";

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
      const updatedProjectMember = await existingProjectMember.update({
        isDeleted: false,
      });
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
// need memberId OR (userId AND projectId) as params
export const deleteProjectMember = async (req, res) => {
  try {
    const { id, userId, projectId } = req.params;

    let memberId;
    if (!id && userId && projectId) {
      const memberDetails = checkProjectMembership(userId, projectId);
      memberId = memberDetails.id;
    } else {
      memberId = id;
    }

    // Find Project Member
    const member = await ProjectMember.findByPk(memberId);

    if (!member) {
      return res.status(404).json({ message: "Project Member not found" });
    }
    // Prevent deleting project owner
    if (member.roleInProject === "owner") {
      return res
        .status(500)
        .json({ message: "Project owner cannot be deleted." });
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

export const updateUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const { projectIds } = req.query;
    const userProjectId = projectIds.split(",").map((val) => Number(val));
    const allUserMemberships = await fetchUserProjectMembership(userId);
    const allUserMembershipIds = allUserMemberships.map((val) => val.projectId);
    const addProjectIds = userProjectId.filter(
      (val) => !allUserMembershipIds.includes(val)
    );

    const removeProjectIds = allUserMembershipIds.filter(
      (val) => !userProjectId.includes(val)
    );
    console.log("removeProjectIds: ", removeProjectIds);

    // Add users to projects
    await Promise.all(
      addProjectIds.map(async (proId) => {
        const existingProjectMember = await ProjectMember.findOne({
          where: { userId, projectId: proId },
        });
        if (existingProjectMember) {
          await existingProjectMember.update({ isDeleted: false });
        } else {
          await ProjectMember.create({ userId, projectId: proId });
        }
      })
    );

    // Remove projects (soft delete)
    await Promise.all(
      removeProjectIds.map(async (proId) => {
        const projectMember = await ProjectMember.findOne({
          where: { userId, projectId: proId },
        });
        if (projectMember) {
          await projectMember.update({ isDeleted: true });
        }
      })
    );

    return res
      .status(200)
      .json({ message: "User projects updated successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete member", error: error.message });
  }
};
