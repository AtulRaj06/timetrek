import { ProjectMember } from "../models/index.js";

export const checkProjectMembership = async (userId, projectId) => {
  try {
    const membership = await ProjectMember.findOne({
      where: {
        userId: userId,
        projectId: projectId,
        isDeleted: false,
      },
    });

    // Returns either null (if not found) or the membership object
    // which includes roleInProject ("owner" or "member")
    return membership;
  } catch (error) {
    console.error("Error checking project membership:", error);
    throw error;
  }
};

export const fetchUserProjectMembership = async (userId) => {
  try {
    const memberships = await ProjectMember.findAll({
      where: {
        userId: userId,
      },
    });

    // Returns either null (if not found) or the memberships object
    // which includes roleInProject ("owner" or "member")
    return memberships;
  } catch (error) {
    console.error("Error checking project membership:", error);
    throw error;
  }
};

// Helper function to check if user is project owner
export const isProjectOwner = async (userId, projectId) => {
  try {
    const membership = await ProjectMember.findOne({
      where: {
        userId: userId,
        projectId: projectId,
        roleInProject: "owner",
        isDeleted: false,
      },
    });
    return !!membership; // Convert to boolean
  } catch (error) {
    console.error("Error checking project ownership:", error);
    throw error;
  }
};

// Helper function to check if user is project member (either owner or member)
export const isProjectMember = async (userId, projectId) => {
  try {
    const membership = await ProjectMember.findOne({
      where: {
        userId: userId,
        projectId: projectId,
        isDeleted: false,
      },
    });
    console.log('membership: ',membership, !!membership)
    return !!membership; // Convert to boolean
  } catch (error) {
    console.error("Error checking project membership:", error);
    throw error;
  }
};
