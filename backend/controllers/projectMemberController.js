import {User, ProjectMember} from '../models/index.js';

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
