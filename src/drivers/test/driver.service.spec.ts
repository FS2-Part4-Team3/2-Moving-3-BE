import {
  DriverInvalidTypeException,
  DriverIsLikedException,
  DriverIsUnLikedException,
  DriverNotFoundException,
} from '#drivers/driver.exception.js';
import { DriverRepository } from '#drivers/driver.repository.js';
import { DriverService } from '#drivers/driver.service.js';
import { IStorage, UserType } from '#types/common.types.js';
import * as s3Utils from '#utils/S3/generate-s3-upload-url.js';
import { Test, TestingModule } from '@nestjs/testing';
import { AsyncLocalStorage } from 'async_hooks';

describe('DriverService', () => {
  let service: DriverService;
  let repository: DriverRepository;
  let als: AsyncLocalStorage<IStorage>;

  const mockDriver = {
    id: 'driver-id',
    email: 'driver@test.com',
    name: 'Test Driver',
    phoneNumber: '01012345678',
    startAt: new Date('2020-01-01'),
    reviews: [],
    image: 'profile.jpg',
  };

  const mockDriverRepository = {
    count: jest.fn(),
    findMany: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    like: jest.fn(),
    unlike: jest.fn(),
    isLiked: jest.fn(),
  };

  const mockAls = {
    getStore: jest.fn(),
  };

  const mockFilterSensitiveData = jest.fn();

  jest.mock('#utils/filterSensitiveData.js', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(async driver => ({
      ...driver,
      reviews: driver.reviews,
    })),
  }));
  jest.spyOn(s3Utils, 'generateS3UploadUrl').mockImplementation(async (driverId, fileName) => {
    const timestamp = Date.now();
    const newFileName = `${timestamp}.${fileName}`;
    return {
      uploadUrl: 'https://moving-bucket-be.s3.ap-northeast-2.amazonaws.com/test-url',
      uniqueFileName: newFileName,
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: DriverRepository,
          useValue: mockDriverRepository,
        },
        {
          provide: AsyncLocalStorage,
          useValue: mockAls,
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
    repository = module.get<DriverRepository>(DriverRepository);
    als = module.get<AsyncLocalStorage<IStorage>>(AsyncLocalStorage);

    jest.clearAllMocks();

    mockFilterSensitiveData.mockImplementation(driver => ({
      ...driver,
      reviews: driver.reviews,
    }));
  });

  describe('findDrivers', () => {
    const mockOptions = {
      page: 1,
      pageSize: 10,
      orderBy: null,
      keyword: '',
      area: null,
      serviceType: null,
    };

    it('should return drivers with calculated career and review count', async () => {
      const mockDrivers = [
        {
          ...mockDriver,
          startAt: new Date('2020-01-01'),
          reviews: [{ score: 5 }, { score: 4 }],
        },
      ];

      mockDriverRepository.count.mockResolvedValue(1);
      mockDriverRepository.findMany.mockResolvedValue(mockDrivers);

      const result = await service.findDrivers(mockOptions);

      expect(result.totalCount).toBe(1);
      expect(result.list[0].career).toBeDefined();
      expect(result.list[0].reviewCount).toBe(2);
      expect(result.list[0].reviews).toBeUndefined();
      expect(mockDriverRepository.count).toHaveBeenCalledWith(mockOptions);
      expect(mockDriverRepository.findMany).toHaveBeenCalledWith(mockOptions);
    });
  });

  describe('updateDriver', () => {
    const mockPatchDTO = {
      name: 'Updated Name',
      image: 'new-image.jpg',
    };

    it('should throw DriverInvalidTypeException when user is not a driver', async () => {
      mockAls.getStore.mockReturnValue({ type: UserType.User });

      await expect(service.updateDriver(mockPatchDTO)).rejects.toThrow(DriverInvalidTypeException);
    });

    it('should update driver with image upload URL', async () => {
      const mockUpdatedDriver = {
        ...mockDriver,
        name: 'Updated Name',
        image: expect.stringMatching(/^\d+\.new-image\.jpg$/),
      };

      mockAls.getStore.mockReturnValue({ type: UserType.Driver, driverId: 'driver-id' });
      mockDriverRepository.update.mockResolvedValue(mockUpdatedDriver);
      mockFilterSensitiveData.mockResolvedValue(mockUpdatedDriver);

      const result = await service.updateDriver(mockPatchDTO);

      expect(s3Utils.generateS3UploadUrl).toHaveBeenCalledWith('driver-id', 'new-image.jpg');
      expect(result).toEqual(
        expect.objectContaining({
          ...mockUpdatedDriver,
          uploadUrl: 'https://moving-bucket-be.s3.ap-northeast-2.amazonaws.com/test-url',
        }),
      );
    });
  });

  describe('likeDriver', () => {
    const driverId = 'driver-id';
    const userId = 'user-id';

    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId });
    });

    it('should throw DriverNotFoundException when driver does not exist', async () => {
      mockDriverRepository.findById.mockResolvedValue(null);

      await expect(service.likeDriver(driverId)).rejects.toThrow(DriverNotFoundException);
    });

    it('should throw DriverIsLikedException when already liked', async () => {
      mockDriverRepository.findById.mockResolvedValue(mockDriver);
      mockDriverRepository.isLiked.mockResolvedValue(true);

      await expect(service.likeDriver(driverId)).rejects.toThrow(DriverIsLikedException);
    });

    it('should like driver successfully', async () => {
      mockDriverRepository.findById.mockResolvedValue(mockDriver);
      mockDriverRepository.isLiked.mockResolvedValue(false);
      mockDriverRepository.like.mockResolvedValue({ ...mockDriver, likeCount: 1 });

      await service.likeDriver(driverId);

      expect(mockDriverRepository.like).toHaveBeenCalledWith(driverId, userId);
    });
  });

  describe('unlikeDriver', () => {
    const driverId = 'driver-id';
    const userId = 'user-id';

    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId });
    });

    it('should throw DriverNotFoundException when driver does not exist', async () => {
      mockDriverRepository.findById.mockResolvedValue(null);

      await expect(service.unlikeDriver(driverId)).rejects.toThrow(DriverNotFoundException);
    });

    it('should throw DriverIsUnLikedException when not liked', async () => {
      mockDriverRepository.findById.mockResolvedValue(mockDriver);
      mockDriverRepository.isLiked.mockResolvedValue(false);

      await expect(service.unlikeDriver(driverId)).rejects.toThrow(DriverIsUnLikedException);
    });

    it('should unlike driver successfully', async () => {
      mockDriverRepository.findById.mockResolvedValue(mockDriver);
      mockDriverRepository.isLiked.mockResolvedValue(true);
      mockDriverRepository.unlike.mockResolvedValue({ ...mockDriver, likeCount: 0 });

      await service.unlikeDriver(driverId);

      expect(mockDriverRepository.unlike).toHaveBeenCalledWith(driverId, userId);
    });
  });
});
