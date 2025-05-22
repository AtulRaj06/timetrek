import User from '../models/User.js';
import { Op } from 'sequelize';
// import { logActivity } from '../../controllers/activityLogController.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] } // Don't return sensitive data
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { displayName, email, password, role } = req.body;
    
    // Basic validation
    if (!email || !password || !displayName) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: {
        [Op.or]: [
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    // Only super_admin can create another super_admin
    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admins can create other super admins' });
    }
    
    // Create new user
    const newUser = await User.create({
      displayName,
      email,
      password, // Will be hashed by the model hook
      role: role || 'user' // Default to 'user' if role is not provided
    });
    
    // Return user without sensitive data
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    delete userResponse.resetToken;
    delete userResponse.resetTokenExpiry;

    // Log activity
    // if (req.user) {
    //   await logActivity(
    //     req.user.id,
    //     req.user.name,
    //     req.user.email,
    //     'user',
    //     newUser.id,
    //     'create',
    //     { 
    //       name: newUser.name, 
    //     }
    //   );
    // }
    
    return res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, firstName, lastName, isActive, role } = req.body;
    
    // Find user
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only super_admin can update role
    if (role && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admins can update roles' });
    }
    
    // Prevent changing the last super_admin to a regular user
    if (user.role === 'super_admin' && role === 'user') {
      const superAdminCount = await User.count({ where: { role: 'super_admin' } });
      if (superAdminCount <= 1) {
        return res.status(400).json({ message: 'Cannot change the last super admin to a regular user' });
      }
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;
    
    // Save changes
    await user.save();
    
    // Return updated user without sensitive data
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.resetToken;
    delete userResponse.resetTokenExpiry;

    // Log activity
    // if (req.user) {
    //   await logActivity(
    //     req.user.id,
    //     req.user.name,
    //     req.user.email,
    //     'user',
    //     user.id,
    //     'update',
    //     { 
    //       name: user.name, 
    //     }
    //   );
    // }
    
    return res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting the last super_admin
    if (user.role === 'super_admin') {
      const superAdminCount = await User.count({ where: { role: 'super_admin' } });
      if (superAdminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last super admin' });
      }
    }
    
    // Delete user
    await user.destroy();

    // Log activity
    // if (req.user) {
    //   await logActivity(
    //     req.user.id,
    //     req.user.name,
    //     req.user.email,
    //     'user',
    //     id,
    //     'delete',
    //     { 
    //       name: user.name,
    //     }
    //   );
    // }
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};