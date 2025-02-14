import { PrismaService } from '#global/prisma.service.js';
import { ReviewRepository } from '#reviews/review.repository.js';
import { SortOrder } from '#types/options.type.js';
import { GetQueries } from '#types/queries.type.js';
import { Test, TestingModule } from '@nestjs/testing';

describe('ReviewRepository', () => {
  let reviewRepository: ReviewRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    review: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    $transaction: jest.fn(fn => fn(mockPrismaService)),
    driver: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewRepository, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('리포지토리가 정의되어 있어야 한다', () => {
    expect(reviewRepository).toBeDefined();
  });

  describe('totalCount', () => {
    it('사용자의 리뷰 개수를 조회한다.', async () => {
      mockPrismaService.review.count.mockResolvedValue(5);

      const result = await reviewRepository.totalCount('user-id', 'user');
      expect(result).toBe(5);
      expect(mockPrismaService.review.count).toHaveBeenCalledWith({ where: { ownerId: 'user-id' } });
    });
  });

  describe('findManyMyReviews', () => {
    const mockQuery: GetQueries = {
      page: 1,
      pageSize: 5,
      orderBy: SortOrder.Recent,
      keyword: '',
    };

    it('사용자의 리뷰 목록을 조회한다.', async () => {
      const mockReviews = [
        {
          id: 1,
          score: 5,
          content: 'Great service!',
          estimation: {
            id: 1,
            moveInfo: {
              id: 10,
              requests: [{ driverId: 2 }],
              isSpecificRequest: true,
            },
          },
          driverId: 2,
        },
      ];
      mockPrismaService.review.findMany.mockResolvedValue(
        mockReviews.map(review => ({
          ...review,
          estimation: {
            ...review.estimation,
            moveInfo: {
              ...review.estimation.moveInfo,
              isSpecificRequest: review.estimation.moveInfo.requests.some(req => req.driverId === review.driverId),
            },
          },
        })),
      );

      const result = await reviewRepository.findManyMyReviews('user-id', mockQuery);
      expect(result).toEqual(mockReviews);
      expect(mockPrismaService.review.findMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('새로운 리뷰를 생성한다.', async () => {
      const mockReview = {
        id: 'review-id',
        driverId: 'driver-id',
        score: 5,
        comment: '하하',
        ownerId: 'owner-id',
        estimationId: 'estimation-id',
      };
      mockPrismaService.review.create.mockResolvedValue(mockReview);
      mockPrismaService.review.aggregate.mockResolvedValue({ _avg: { score: 4.5 } });

      const result = await reviewRepository.create(mockReview);
      expect(result).toBe(mockReview);
      expect(mockPrismaService.review.create).toHaveBeenCalledWith({ data: mockReview });
      expect(mockPrismaService.driver.update).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('리뷰를 업데이트한다.', async () => {
      const mockReview = { id: 'review-id', score: 4 };
      mockPrismaService.review.update.mockResolvedValue(mockReview);
      mockPrismaService.review.aggregate.mockResolvedValue({ _avg: { score: 4.5 } });

      const result = await reviewRepository.update('review-id', { score: 4 });
      expect(result).toBe(mockReview);
      expect(mockPrismaService.review.update).toHaveBeenCalledWith({ where: { id: 'review-id' }, data: { score: 4 } });
    });
  });

  describe('delete', () => {
    it('리뷰를 삭제한다.', async () => {
      const mockReview = { id: 'review-id', driverId: 'driver-id' };
      mockPrismaService.review.findUnique.mockResolvedValue(mockReview);
      mockPrismaService.review.delete.mockResolvedValue(mockReview);
      mockPrismaService.review.aggregate.mockResolvedValue({ _avg: { score: 4.5 } });

      const result = await reviewRepository.delete('review-id');
      expect(result).toBe(mockReview);
      expect(mockPrismaService.review.delete).toHaveBeenCalledWith({ where: { id: 'review-id' } });
      expect(mockPrismaService.driver.update).toHaveBeenCalled();
    });
  });
});
