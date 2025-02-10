import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { GuardService } from '#guards/guard.service.js';
import { ReviewController } from '#reviews/review.controller.js';
import { ReviewService } from '#reviews/review.service.js';
import { SortOrder } from '#types/options.type.js';
import { GetQueries, ReviewableGetQueries } from '#types/queries.type.js';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AsyncLocalStorage } from 'async_hooks';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  const mockReviewService = {
    getMyReviews: jest.fn(),
    getDriverReviews: jest.fn(),
    postReview: jest.fn(),
    patchReview: jest.fn(),
    deleteReview: jest.fn(),
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
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
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

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService);

    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyReviews', () => {
    const mockQuery: GetQueries = {
      page: 1,
      pageSize: 5,
      orderBy: SortOrder.Recent,
      keyword: '',
    };

    it('내가 작성한 리뷰 목록을 반환해야 합니다.', async () => {
      const mockResult = {
        totalCount: 1,
        list: [
          {
            id: 'review-id',
            comment: '4점 줍니다.',
            score: 4,
            isSpecificRequest: true,
          },
        ],
      };

      mockReviewService.getMyReviews.mockResolvedValue(mockResult);

      const result = await controller.getMyReviews(mockQuery);

      expect(result).toStrictEqual(mockResult);
      expect(mockReviewService.getMyReviews).toHaveBeenCalledWith(mockQuery);
    });

    it('쿼리 스트링이 없을 시 기본값을 사용한다.', async () => {
      const emptyQuery = {};
      await controller.getMyReviews(emptyQuery as GetQueries);

      expect(mockReviewService.getMyReviews).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 10,
          orderBy: SortOrder.Recent,
          keyword: '',
        }),
      );
    });
  });

  it('서비스 호출이 실패할 경우 예외를 던져야 한다', async () => {
    mockReviewService.getMyReviews.mockRejectedValue(new Error('Service Error'));
    const emptyQuery = {};

    await expect(controller.getMyReviews(emptyQuery as GetQueries)).rejects.toThrow('Service Error');
  });

  describe('getDriverReviews', () => {
    const mockQuery: GetQueries = {
      page: 1,
      pageSize: 5,
      orderBy: SortOrder.Recent,
      keyword: '',
    };

    it('기사 리뷰 목록을 반환해야 합니다.', async () => {
      const driverId = 'driver-id';
      const mockResult = {
        totalCount: 1,
        stats: {
          averageRating: 1,
          ratingCounts: [1, 2, 3, 4, 5],
        },
        list: [
          {
            id: 'review-id',
            comment: '4점 줍니다.',
            score: 4,
            isSpecificRequest: true,
          },
        ],
      };

      mockReviewService.getDriverReviews.mockResolvedValue(mockResult);

      const result = await controller.getDriverReviews(driverId, mockQuery);

      expect(result).toStrictEqual(mockResult);
      expect(mockReviewService.getDriverReviews).toHaveBeenCalledWith(driverId, mockQuery);
    });

    it('쿼리 스트링이 없을 시 기본값을 사용한다.', async () => {
      const driverId = 'driver-id';
      const emptyQuery = {};
      await controller.getDriverReviews(driverId, emptyQuery as GetQueries);

      expect(mockReviewService.getDriverReviews).toHaveBeenCalledWith(
        driverId,
        expect.objectContaining({
          page: 1,
          pageSize: 10,
          orderBy: SortOrder.Recent,
          keyword: '',
        }),
      );
    });

    it('서비스 호출이 실패할 경우 예외를 던져야 한다', async () => {
      mockReviewService.getDriverReviews.mockRejectedValue(new Error('Service Error'));
      const driverId = 'driver-id';
      const emptyQuery = {};

      await expect(controller.getDriverReviews(driverId, emptyQuery as GetQueries)).rejects.toThrow('Service Error');
    });
  });

  describe('postReview', () => {
    const estimationId = 'estimation-id';
    const reviewBody = {
      score: 5,
      comment: 'Excellent service!',
    };

    it('리뷰를 생성해야 합니다.', async () => {
      const mockResult = {
        id: 'review-id',
        ...reviewBody,
      };

      mockReviewService.postReview.mockResolvedValue(mockResult);

      const result = await controller.postReview(estimationId, reviewBody);

      expect(result).toStrictEqual(mockResult);
      expect(mockReviewService.postReview).toHaveBeenCalledWith(estimationId, reviewBody);
    });

    it('서비스 호출이 실패할 경우 예외를 던져야 한다', async () => {
      mockReviewService.postReview.mockRejectedValue(new Error('Service Error'));

      await expect(controller.postReview(estimationId, reviewBody)).rejects.toThrow('Service Error');
    });
  });

  describe('patchReview', () => {
    const reviewId = 'review-id';
    const patchBody = {
      score: 4,
      comment: 'Good service',
    };

    it('리뷰를 수정해야 합니다.', async () => {
      const mockResult = {
        id: reviewId,
        ...patchBody,
      };

      mockReviewService.patchReview.mockResolvedValue(mockResult);

      const result = await controller.patchReview(reviewId, patchBody);

      expect(result).toStrictEqual(mockResult);
      expect(mockReviewService.patchReview).toHaveBeenCalledWith(reviewId, patchBody);
    });

    it('서비스 호출이 실패할 경우 예외를 던져야 한다', async () => {
      mockReviewService.patchReview.mockRejectedValue(new Error('Service Error'));

      await expect(controller.patchReview(reviewId, patchBody)).rejects.toThrow('Service Error');
    });
  });

  describe('deleteReview', () => {
    const reviewId = 'review-id';

    it('리뷰를 삭제해야 합니다.', async () => {
      const mockResult = {
        id: reviewId,
      };

      mockReviewService.deleteReview.mockResolvedValue(mockResult);

      const result = await controller.deleteReview(reviewId);

      expect(result).toStrictEqual(mockResult);
      expect(mockReviewService.deleteReview).toHaveBeenCalledWith(reviewId);
    });

    it('서비스 호출이 실패할 경우 예외를 던져야 한다', async () => {
      mockReviewService.deleteReview.mockRejectedValue(new Error('Service Error'));

      await expect(controller.deleteReview(reviewId)).rejects.toThrow('Service Error');
    });
  });
});
