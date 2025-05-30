import { sequelize, testConnection } from '../config/database.js';
import User from '../models/User.js';

// Test database connection and model synchronization
const testDatabase = async () => {
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Database connection test failed');
      process.exit(1);
    }
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log('Models synchronized successfully');
    
    // Create a test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('Test user created:', testUser.toJSON());
    
    // Find the user
    const foundUser = await User.findByPk(testUser.id);
    console.log('Found user:', foundUser.toJSON());
    
    // Clean up (optional)
    // await testUser.destroy();
    // console.log('Test user deleted');
    
    console.log('Database test completed successfully');
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('Database connection closed');
  }
};

// Run the test
testDatabase();