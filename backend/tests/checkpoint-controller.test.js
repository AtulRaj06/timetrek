import { jest } from '@jest/globals';
import { Op } from 'sequelize';
import Checkpoint from '../models/Checkpoint.js';
import Department from '../models/Department.js';
import Type from '../models/Type.js';
import Head from '../models/Head.js';

// Mock the models
jest.mock('../models/Checkpoint.js', () => ({
  findAll: jest.fn(),
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('../models/Department.js', () => ({
  findByPk: jest.fn()
}));

jest.mock('../models/Type.js', () => ({
  findByPk: jest.fn()
}));

jest.mock('../models/Head.js', () => ({
  findByPk: jest.fn()
}));

// Import the controller after mocking
import { 
  getAllCheckpoints, 
  getCheckpointById, 
  createCheckpoint, 
  updateCheckpoint, 
  deleteCheckpoint 
} from '../controllers/checkpointController.js';

describe('Checkpoint Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllCheckpoints', () => {
    it('should return checkpoints with pagination', async () => {
      const mockCheckpoints = [
        { id: 1, headId: 1, typeId: 1, departmentId: 1
          // , fiscalYear: '2023'
         },
        { id: 2, headId: 2, typeId: 2, departmentId: 2
          // , fiscalYear: '2023' 
        }
      ];
      
      Checkpoint.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockCheckpoints
      });

      await getAllCheckpoints(req, res);

      expect(Checkpoint.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        checkpoints: mockCheckpoints,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });

    it('should apply filters when provided', async () => {
      req.query = {
        page: 2,
        limit: 5,
        typeId: 1,
        departmentId: 2,
        search: 'test',
        // sortField: 'fiscalYear',
        sortOrder: 'ASC'
      };
      
      const mockCheckpoints = [{ id: 3, headId: 1, typeId: 1, departmentId: 2
        // , fiscalYear: '2023' 
      }];
      
      Checkpoint.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: mockCheckpoints
      });

      await getAllCheckpoints(req, res);

      expect(Checkpoint.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.any(Object),
        limit: 5,
        offset: 5
      }));
      
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getCheckpointById', () => {
    it('should return an checkpoint by id', async () => {
      const mockCheckpoint = { 
        id: 1, 
        headId: 1, 
        typeId: 1, 
        departmentId: 1, 
        // fiscalYear: '2023' 
      };
      
      req.params.id = 1;
      Checkpoint.findByPk.mockResolvedValue(mockCheckpoint);

      await getCheckpointById(req, res);

      expect(Checkpoint.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCheckpoint);
    });

    it('should return 404 if checkpoint not found', async () => {
      req.params.id = 999;
      Checkpoint.findByPk.mockResolvedValue(null);

      await getCheckpointById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Checkpoint not found' });
    });
  });

  describe('createCheckpoint', () => {
    it('should create a new checkpoint', async () => {
      const mockCheckpoint = { 
        id: 1, 
        headId: 1, 
        typeId: 1, 
        departmentId: 1, 
        // fiscalYear: '2023' 
      };
      
      req.body = {
        headId: 1,
        typeId: 1,
        departmentId: 1,
        // fiscalYear: '2023',
        checkpoint: 'Test checkpoint',
        isActive: true
      };
      
      Head.findByPk.mockResolvedValue({ id: 1, name: 'Head 1' });
      Type.findByPk.mockResolvedValue({ id: 1, name: 'Type 1' });
      Department.findByPk.mockResolvedValue({ id: 1, name: 'Department 1' });
      
      Checkpoint.create.mockResolvedValue({ id: 1 });
      Checkpoint.findByPk.mockResolvedValue(mockCheckpoint);

      await createCheckpoint(req, res);

      expect(Head.findByPk).toHaveBeenCalledWith(1);
      expect(Type.findByPk).toHaveBeenCalledWith(1);
      expect(Department.findByPk).toHaveBeenCalledWith(1);
      expect(Checkpoint.create).toHaveBeenCalledWith(expect.objectContaining({
        headId: 1,
        typeId: 1,
        departmentId: 1,
        // fiscalYear: '2023',
        checkpoint: 'Test checkpoint',
        isActive: true
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCheckpoint);
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {
        headId: 1,
        // Missing required fields
      };

      await createCheckpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Missing required fields'
      }));
    });

    it('should return 400 if referenced entities do not exist', async () => {
      req.body = {
        headId: 999, // Non-existent head
        typeId: 1,
        departmentId: 1,
        // fiscalYear: '2023'
      };
      
      Head.findByPk.mockResolvedValue(null);

      await createCheckpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Head not found' });
    });
  });

  describe('updateCheckpoint', () => {
    it('should update an checkpoint', async () => {
      const mockCheckpoint = { 
        id: 1, 
        headId: 1, 
        typeId: 1, 
        departmentId: 1, 
        // fiscalYear: '2023',
        checkpoint: 'Old checkpoint',
        save: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = 1;
      req.body = {
        checkpoint: 'Updated checkpoint',
        isActive: false
      };
      
      Checkpoint.findByPk.mockResolvedValueOnce(mockCheckpoint).mockResolvedValueOnce({
        ...mockCheckpoint,
        checkpoint: 'Updated checkpoint',
        isActive: false
      });

      await updateCheckpoint(req, res);

      expect(Checkpoint.findByPk).toHaveBeenCalledWith(1);
      expect(mockCheckpoint.checkpoint).toBe('Updated checkpoint');
      expect(mockCheckpoint.isActive).toBe(false);
      expect(mockCheckpoint.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if checkpoint not found', async () => {
      req.params.id = 999;
      Checkpoint.findByPk.mockResolvedValue(null);

      await updateCheckpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Checkpoint not found' });
    });
  });

  describe('deleteCheckpoint', () => {
    it('should delete an checkpoint', async () => {
      const mockCheckpoint = { 
        id: 1, 
        headId: 1, 
        typeId: 1, 
        departmentId: 1, 
        // fiscalYear: '2023',
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      req.params.id = 1;
      Checkpoint.findByPk.mockResolvedValue(mockCheckpoint);

      await deleteCheckpoint(req, res);

      expect(Checkpoint.findByPk).toHaveBeenCalledWith(1);
      expect(mockCheckpoint.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Checkpoint deleted successfully' });
    });

    it('should return 404 if checkpoint not found', async () => {
      req.params.id = 999;
      Checkpoint.findByPk.mockResolvedValue(null);

      await deleteCheckpoint(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Checkpoint not found' });
    });
  });
});