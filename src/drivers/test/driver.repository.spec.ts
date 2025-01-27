import { DriverRepository } from '#drivers/driver.repository.js';
import { PrismaService } from '#global/prisma.service.js';
import { DriverSortOrder } from '#types/options.type.js';
import { Test, TestingModule } from '@nestjs/testing';
import { Area, ServiceType } from '@prisma/client';

describe('DriverRepository', () => {
  let repository: DriverRepository;
  let prisma: PrismaService;

  const mockPrismaService = {
    driver: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<DriverRepository>(DriverRepository);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('generateFindCondition', () => {
    it('should generate correct sort condition for MostReviewed', () => {
      const options = {
        orderBy: DriverSortOrder.MostReviewed,
        keyword: '',
        area: null,
        serviceType: null,
      };

      const condition = (repository as any).generateFindCondition(options);

      expect(condition.orderBy).toEqual({ reviews: { _count: 'desc' } });
    });

    it('should generate correct filter conditions', () => {
      const options = {
        keyword: '전문',
        area: Area.SEOUL,
        serviceType: ServiceType.HOME,
      };

      const condition = (repository as any).generateFindCondition(options);

      expect(condition.where).toEqual({
        OR: [{ name: { contains: '전문' } }, { introduce: { contains: '전문' } }],
        availableAreas: { has: Area.SEOUL },
        serviceType: { has: ServiceType.HOME },
      });
    });
  });

  describe('findMany', () => {
    it('should return drivers with pagination', async () => {
      const mockDrivers = [
        { id: '1', name: 'Driver 1' },
        { id: '2', name: 'Driver 2' },
      ];
      const options = {
        page: 2,
        pageSize: 10,
        orderBy: DriverSortOrder.HighestRating,
        keyword: '',
        area: null,
        serviceType: null,
      };

      mockPrismaService.driver.findMany.mockResolvedValue(mockDrivers);

      const result = await repository.findMany(options);

      expect(result).toBe(mockDrivers);
      expect(mockPrismaService.driver.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
          orderBy: { rating: 'desc' },
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a driver by id', async () => {
      const mockDriver = { id: '1', name: 'Test Driver' };

      mockPrismaService.driver.findUnique.mockResolvedValue(mockDriver);

      const result = await repository.findById('1');

      expect(result).toBe(mockDriver);
      expect(mockPrismaService.driver.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          reviews: {
            select: {
              score: true,
            },
          },
        },
      });
    });
  });

  describe('like/unlike operations', () => {
    it('should increase likeCount and connect user when liking', async () => {
      const mockDriver = { id: '1', likeCount: 1 };

      mockPrismaService.driver.update.mockResolvedValue(mockDriver);

      const result = await repository.like('1', 'user-1');

      expect(result).toBe(mockDriver);
      expect(mockPrismaService.driver.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          likeCount: { increment: 1 },
          likedUsers: {
            connect: { id: 'user-1' },
          },
        },
      });
    });

    it('should decrease likeCount and disconnect user when unliking', async () => {
      const mockDriver = { id: '1', likeCount: 0 };

      mockPrismaService.driver.update.mockResolvedValue(mockDriver);

      const result = await repository.unlike('1', 'user-1');

      expect(result).toBe(mockDriver);
      expect(mockPrismaService.driver.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          likeCount: { decrement: 1 },
          likedUsers: {
            disconnect: { id: 'user-1' },
          },
        },
      });
    });
  });

  describe('isLiked', () => {
    it('should return true when driver is liked by user', async () => {
      mockPrismaService.driver.findUnique.mockResolvedValue({ id: '1' });

      const result = await repository.isLiked('1', 'user-1');

      expect(result).toBe(true);
      expect(mockPrismaService.driver.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
          likedUsers: { some: { id: 'user-1' } },
        },
      });
    });

    it('should return false when driver is not liked by user', async () => {
      mockPrismaService.driver.findUnique.mockResolvedValue(null);

      const result = await repository.isLiked('1', 'user-1');

      expect(result).toBe(false);
    });
  });
});
