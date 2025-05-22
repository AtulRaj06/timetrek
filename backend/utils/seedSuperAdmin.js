import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv'; // Import dotenv for environment variables

// Load environment variables
dotenv.config();

// Function to create a default super admin if none exists
export const seedSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { role: 'super_admin' } });
    
    if (!existingAdmin) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'password';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        displayName: 'Super Admin',
        role: 'super_admin',
        isExternal: true,
        isDeleted: false
      });
      
      console.log('Default super admin created.');
    } else {
      console.log('Super admin already exists.');
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
};

export default seedSuperAdmin;