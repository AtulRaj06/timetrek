import { login, forgotPassword } from '../controllers/authController.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Mock dependencies
jest.mock('../models/User.js');
jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      await login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });

    it('should return 401 if user not found', async () => {
      req.body = { email: 'nonexistent@example.com', password: 'password' };
      User.findOne.mockResolvedValue(null);
      
      await login(req, res);
      
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 401 if user is inactive', async () => {
      req.body = { email: 'inactive@example.com', password: 'password' };
      User.findOne.mockResolvedValue({ isActive: false });
      
      await login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Account is inactive' });
    });

    it('should return 401 if password is invalid', async () => {
      req.body = { email: 'user@example.com', password: 'wrongpassword' };
      const mockUser = {
        isActive: true,
        validatePassword: jest.fn().mockResolvedValue(false)
      };
      User.findOne.mockResolvedValue(mockUser);
      
      await login(req, res);
      
      expect(mockUser.validatePassword).toHaveBeenCalledWith('wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 200 with token if credentials are valid', async () => {
      req.body = { email: 'user@example.com', password: 'correctpassword' };
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'user@example.com',
        role: 'user',
        isActive: true,
        validatePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          name: 'Test User',
          email: 'user@example.com',
          role: 'user',
          password: 'hashedpassword'
        })
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('generated-token');
      
      await login(req, res);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: expect.objectContaining({
          id: 1,
          name: 'Test User',
          email: 'user@example.com',
          role: 'user'
        }),
        token: 'generated-token'
      });
      // Password should be removed from response
      expect(res.json.mock.calls[0][0].user.password).toBeUndefined();
    });
  });

  describe('forgotPassword', () => {
    it('should return 400 if email is missing', async () => {
      await forgotPassword(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email is required' });
    });

    it('should return 200 even if user not found (for security)', async () => {
      req.body = { email: 'nonexistent@example.com' };
      User.findOne.mockResolvedValue(null);
      
      await forgotPassword(req, res);
      
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'If your email exists in our system, you will receive a password reset link' 
      });
    });

    it('should generate reset token and save to user if email exists', async () => {
      req.body = { email: 'user@example.com' };
      const mockUser = {
        email: 'user@example.com',
        save: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);
      crypto.randomBytes.mockReturnValue({
        toString: jest.fn().mockReturnValue('random-token')
      });
      
      await forgotPassword(req, res);
      
      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(mockUser.resetToken).toBe('random-token');
      expect(mockUser.resetTokenExpiry).toBeInstanceOf(Date);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'If your email exists in our system, you will receive a password reset link',
        resetToken: 'random-token'
      });
    });
  });
});