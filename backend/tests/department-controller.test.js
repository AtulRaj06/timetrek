import { jest } from '@jest/globals';
import Department from '../models/Department.js';

// Mock the Department model
jest.mock('../models/Department.js', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  destroy: jest.fn()
}));

// Import the controller after mocking
import { 
  getAllDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../controllers/departmentController.js';

describe('Department Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllDepartments', () => {
    it('should return all departments', async () => {
      const mockDepartments = [
        { id: 1, name: 'Finance', isActive: true },
        { id: 2, name: 'HR', isActive: true }
      ];
      Department.findAll.mockResolvedValue(mockDepartments);

      await getAllDepartments(req, res);

      expect(Department.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDepartments);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Department.findAll.mockRejectedValue(error);

      await getAllDepartments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        error: error.message
      });
    });
  });

  describe('getDepartmentById', () => {
    it('should return a department by id', async () => {
      const mockDepartment = { id: 1, name: 'Finance', isActive: true };
      req.params.id = 1;
      Department.findByPk.mockResolvedValue(mockDepartment);

      await getDepartmentById(req, res);

      expect(Department.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDepartment);
    });

    it('should return 404 if department not found', async () => {
      req.params.id = 999;
      Department.findByPk.mockResolvedValue(null);

      await getDepartmentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department not found' });
    });
  });

  describe('createDepartment', () => {
    it('should create a new department', async () => {
      const mockDepartment = { id: 1, name: 'Finance', isActive: true };
      req.body = { name: 'Finance', isActive: true };
      Department.findOne.mockResolvedValue(null);
      Department.create.mockResolvedValue(mockDepartment);

      await createDepartment(req, res);

      expect(Department.findOne).toHaveBeenCalledWith({ where: { name: 'Finance' } });
      expect(Department.create).toHaveBeenCalledWith({
        name: 'Finance',
        isActive: true
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockDepartment);
    });

    it('should return 400 if name is missing', async () => {
      req.body = { isActive: true };

      await createDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department name is required' });
    });

    it('should return 400 if department with same name exists', async () => {
      req.body = { name: 'Finance', isActive: true };
      Department.findOne.mockResolvedValue({ id: 1, name: 'Finance' });

      await createDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department with this name already exists' });
    });
  });

  describe('updateDepartment', () => {
    it('should update a department', async () => {
      const mockDepartment = { 
        id: 1, 
        name: 'Finance', 
        isActive: true,
        save: jest.fn().mockResolvedValue(true)
      };
      req.params.id = 1;
      req.body = { name: 'Finance Updated', isActive: false };
      Department.findByPk.mockResolvedValue(mockDepartment);
      Department.findOne.mockResolvedValue(null);

      await updateDepartment(req, res);

      expect(Department.findByPk).toHaveBeenCalledWith(1);
      expect(mockDepartment.name).toBe('Finance Updated');
      expect(mockDepartment.isActive).toBe(false);
      expect(mockDepartment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDepartment);
    });

    it('should return 404 if department not found', async () => {
      req.params.id = 999;
      Department.findByPk.mockResolvedValue(null);

      await updateDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department not found' });
    });
  });

  describe('deleteDepartment', () => {
    it('should delete a department', async () => {
      const mockDepartment = { 
        id: 1, 
        name: 'Finance', 
        isActive: true,
        destroy: jest.fn().mockResolvedValue(true)
      };
      req.params.id = 1;
      Department.findByPk.mockResolvedValue(mockDepartment);

      await deleteDepartment(req, res);

      expect(Department.findByPk).toHaveBeenCalledWith(1);
      expect(mockDepartment.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department deleted successfully' });
    });

    it('should return 404 if department not found', async () => {
      req.params.id = 999;
      Department.findByPk.mockResolvedValue(null);

      await deleteDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department not found' });
    });
  });
});