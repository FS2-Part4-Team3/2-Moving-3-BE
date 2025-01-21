import { DriverController } from '#drivers/driver.controller.js';
import { DriverService } from '#drivers/driver.service.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { GuardService } from '#guards/guard.service.js';
import { DriverSortOrder } from '#types/options.type.js';
import { DriversGetQueries } from '#types/queries.type.js';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Area, ServiceType } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

describe('DriverController', () => {
  let controller: DriverController;
  let service: DriverService;

  const mockDriverService = {
    findDrivers: jest.fn(),
    findDriver: jest.fn(),
    findLikedDrivers: jest.fn(),
    updateDriver: jest.fn(),
    likeDriver: jest.fn(),
    unlikeDriver: jest.fn(),
  };

  const mockGuardService = {
    validateAccessToken: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockAsyncLocalStorage = {
    getStore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: DriverService,
          useValue: mockDriverService,
        },
        {
          provide: GuardService,
          useValue: mockGuardService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AsyncLocalStorage,
          useValue: mockAsyncLocalStorage,
        },
        AccessTokenGuard,
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
    service = module.get<DriverService>(DriverService);

    jest.clearAllMocks();
  });

  describe('getDrivers', () => {
    const mockQuery: DriversGetQueries = {
      page: 1,
      pageSize: 10,
      orderBy: DriverSortOrder.MostReviewed,
      keyword: '전문',
      area: Area.SEOUL,
      serviceType: ServiceType.HOME,
    };

    it('should return drivers list with default pagination', async () => {
      const mockResult = {
        totalCount: 1,
        list: [
          {
            id: '1',
            name: 'Driver 1',
            rating: 4.5,
          },
        ],
      };

      mockDriverService.findDrivers.mockResolvedValue(mockResult);

      const result = await controller.getDrivers(mockQuery);

      expect(result).toBe(mockResult);
      expect(mockDriverService.findDrivers).toHaveBeenCalledWith(mockQuery);
    });

    it('should use default values when query params are missing', async () => {
      const emptyQuery = {};
      await controller.getDrivers(emptyQuery as DriversGetQueries);

      expect(mockDriverService.findDrivers).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 10,
          keyword: '',
        }),
      );
    });
  });

  describe('getLikedDrivers', () => {
    it('should return liked drivers with pagination', async () => {
      const mockResult = {
        totalCount: 1,
        list: [
          {
            id: '1',
            name: 'Liked Driver',
            likeCount: 5,
          },
        ],
      };

      mockDriverService.findLikedDrivers.mockResolvedValue(mockResult);

      const result = await controller.getLikedDrivers(1, 3);

      expect(result).toBe(mockResult);
      expect(mockDriverService.findLikedDrivers).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 3,
        }),
      );
    });
  });

  describe('getDriver', () => {
    it('should return a single driver', async () => {
      const mockDriver = {
        id: '1',
        name: 'Test Driver',
      };

      mockDriverService.findDriver.mockResolvedValue(mockDriver);

      const result = await controller.getDriver('1');

      expect(result).toBe(mockDriver);
      expect(mockDriverService.findDriver).toHaveBeenCalledWith('1');
    });
  });

  describe('patchDriver', () => {
    it('should update and return driver', async () => {
      const mockPatchDTO = {
        name: 'Updated Name',
        introduce: '업데이트된 소개',
      };
      const mockUpdatedDriver = {
        id: '1',
        ...mockPatchDTO,
      };

      mockDriverService.updateDriver.mockResolvedValue(mockUpdatedDriver);

      const result = await controller.patchDriver(mockPatchDTO);

      expect(result).toBe(mockUpdatedDriver);
      expect(mockDriverService.updateDriver).toHaveBeenCalledWith(mockPatchDTO);
    });
  });

  describe('postLikeDriver', () => {
    it('should like driver', async () => {
      const mockLikedDriver = {
        id: '1',
        likeCount: 1,
      };

      mockDriverService.likeDriver.mockResolvedValue(mockLikedDriver);

      const result = await controller.postLikeDriver('1');

      expect(result).toBe(mockLikedDriver);
      expect(mockDriverService.likeDriver).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteLikeDriver', () => {
    it('should unlike driver', async () => {
      const mockUnlikedDriver = {
        id: '1',
        likeCount: 0,
      };

      mockDriverService.unlikeDriver.mockResolvedValue(mockUnlikedDriver);

      const result = await controller.deleteLikeDriver('1');

      expect(result).toBe(mockUnlikedDriver);
      expect(mockDriverService.unlikeDriver).toHaveBeenCalledWith('1');
    });
  });
});
