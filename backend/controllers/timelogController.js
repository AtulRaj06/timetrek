import { TimeLog, User } from "../models/index.js";
import { Op } from "sequelize";
// import { logActivity } from '../../controllers/activityLogController.js';

// Get all projects
// export const getAllProjects = async (req, res) => {
//   try {
//     let projects;
//     let userId = req.user.id;
//     if (req.user.role === "super_admin") {
//       projects = await Project.findAll({
//         attributes: ["id", "name", "description", "startDate", "endDate"],
//       });
//     } else if (req.user.role === "project_admin" || req.user.role === "user") {
//       const projectMembers = await ProjectMember.findAll({
//         where: {
//           userId: userId,
//           isDeleted: false,
//         },
//       });

//       const projectIds = projectMembers.map((member) => member.projectId);

//       const userProjects = await Project.findAll({
//         where: {
//           id: {
//             [Op.in]: projectIds,
//           },
//           isDeleted: false,
//         },
//         attributes: ["id", "name", "description", "startDate", "endDate"],
//       });
//       projects = userProjects.map((projectMember) => projectMember.dataValues);
//     }else{
//       return res.status(403).json({
//         message: "You do not have permission to view projects",
//       });
//     }
//     return res.status(200).json(projects);
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to fetch projects", error: error.message });
//   }
// };

// Get Users timelogs
export const getMyTimelogs = async (req, res) => {
  try {
    const timelogs = await TimeLog.findAll({
      where: { userId: req.user.id, isDeleted: false },
    });

    if (!timelogs) {
      return res.status(404).json({ message: "Timelogs not found" });
    }

    return res.status(200).json(timelogs);
  } catch (error) {
    console.error("Error fetching timelogs:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch timelogs", error: error.message });
  }
};

// Get Users timelogs
export const getMyTimelogsfromProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const timelogs = await TimeLog.findAll({
      where: { userId: req.user.id, projectId: projectId, isDeleted: false },
    });

    if (!timelogs) {
      return res.status(404).json({ message: "Timelogs not found" });
    }

    return res.status(200).json(timelogs);
  } catch (error) {
    console.error("Error fetching timelogs:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch timelogs", error: error.message });
  }
};

// const timelogs = await TimeLog.findAll({
//     where: {
//       userId: req.user.id,
//       isDeleted: false,
//     },
//     include: [
//       {
//         model: User,
//         as: "user",
//         attributes: ["id", "displayName", "email", "role"], // Only include necessary user fields
//       },
//     ],
//   });

// Create new Timelog
export const createTimelog = async (req, res) => {
  try {
    const { text, task, start, end, userId, projectId, status } = req.body;

    // Basic validation
    if (!text) {
      return res.status(400).json({ message: "Timelog is required" });
    }

    // Create new timelog
    const newTimelog = await TimeLog.create({
      text,
      task,
      start,
      end,
      userId,
      projectId,
      status,
    });

    // Return timelog without sensitive data
    const timelogResponse = await newTimelog.toJSON();

    return res.status(201).json(timelogResponse);
  } catch (error) {
    console.error("Error creating timelog:", error);
    return res
      .status(500)
      .json({ message: "Failed to create timelog", error: error.message });
  }
};

// Update project
// export const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, startDate, endDate } = req.body;

//     // Find project
//     const project = await Project.findByPk(id);

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     // Update project fields
//     if (name) project.name = name;
//     if (description) project.description = description;
//     if (startDate) project.startDate = startDate;
//     if (endDate) project.endDate = endDate;

//     // Save changes
//     await project.save();

//     // Return updated project without sensitive data
//     const projectResponse = project.toJSON();

//     return res.status(200).json(projectResponse);
//   } catch (error) {
//     console.error('Error updating project:', error);
//     return res.status(500).json({ message: 'Failed to update project', error: error.message });
//   }
// };

// // Delete user
// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find user
//     const user = await User.findByPk(id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Prevent deleting the last super_admin
//     if (user.role === 'super_admin') {
//       const superAdminCount = await User.count({ where: { role: 'super_admin' } });
//       if (superAdminCount <= 1) {
//         return res.status(400).json({ message: 'Cannot delete the last super admin' });
//       }
//     }

//     // Delete user
//     await user.destroy();

//     // Log activity
//     // if (req.user) {
//     //   await logActivity(
//     //     req.user.id,
//     //     req.user.name,
//     //     req.user.email,
//     //     'user',
//     //     id,
//     //     'delete',
//     //     {
//     //       name: user.name,
//     //     }
//     //   );
//     // }

//     return res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return res.status(500).json({ message: 'Failed to delete user', error: error.message });
//   }
// };
