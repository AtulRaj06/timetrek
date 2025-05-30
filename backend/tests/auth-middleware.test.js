import jwt from 'jsonwebtoken';
import { verifyToken, isSuperAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/User.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('should call next() if token is valid', async () => {
      // Mock jwt.verify to return a valid decoded token
      jwt.verify.mockReturnValue({ id: 1 });
      
      // Mock User.findByPk to return a user
      User.findByPk.mockResolvedValue({ id: 1, name: 'Test User', role: 'user' });
      
      await verifyToken(req, res, next);
      
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(req.user).toEqual({ id: 1, name: 'Test User', role: 'user' });
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', async () => {
      req.headers.authorization = undefined;
      
      await verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      jwt.verify.mockReturnValue({ id: 999 });
      User.findByPk.mockResolvedValue(null);
      
      await verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isSuperAdmin', () => {
    it('should call next() if user is super_admin', () => {
      req.user = { role: 'super_admin' };
      
      isSuperAdmin(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not super_admin', () => {
      req.user = { role: 'user' };
      
      isSuperAdmin(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Super admin role required.' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});