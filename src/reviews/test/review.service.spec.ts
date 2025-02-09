import { Test, TestingModule } from '@nestjs/testing';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { AsyncLocalStorage } from 'async_hooks';
import { IStorage } from '#types/common.types.js';
import { ForbiddenException } from '#exceptions/http.exception.js';
import { ReviewService } from '#reviews/review.service.js';
import { ReviewRepository } from '#reviews/review.repository.js';
import { ReviewAlreadyExistsException, ReviewNotFoundException } from '#reviews/review.exception.js';

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let reviewRepository: ReviewRepository;
  let estimationRepository: EstimationRepository;
  let als: AsyncLocalStorage<IStorage>;

  const mockReviewRepository = {
    findManyMyReviews: jest.fn(),
    findManyDriverReviews: jest.fn(),
    totalCount: jest.fn(),
    getDriverRatingStats: jest.fn(),
    getDriverAverageRating: jest.fn(),
    create: jest.fn(),
    findByReviewId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockEstimationRepository = {
    findById: jest.fn(),
  };

  const mockAls = {
    getStore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: ReviewRepository, useValue: mockReviewRepository },
        { provide: EstimationRepository, useValue: mockEstimationRepository },
        { provide: AsyncLocalStorage, useValue: mockAls },
      ],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    estimationRepository = module.get<EstimationRepository>(EstimationRepository);
    als = module.get<AsyncLocalStorage<IStorage>>(AsyncLocalStorage);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(reviewService).toBeDefined();
  });

  describe('getMyReviews (내 리뷰 조회)', () => {
    it('사용자가 인증되지 않으면 ForbiddenException을 던져야 한다', async () => {
      mockAls.getStore.mockReturnValue(null); // null 대신 빈 객체 반환
      await expect(reviewService.getMyReviews({})).rejects.toThrow(ForbiddenException);
    });

    it('리뷰 목록과 총 개수를 반환해야 한다', async () => {
      mockAls.getStore.mockReturnValue({ userId: 'user-id' });
      mockReviewRepository.findManyMyReviews.mockResolvedValue([{ id: 'review-id' }]);
      mockReviewRepository.totalCount.mockResolvedValue(1);

      const result = await reviewService.getMyReviews({});
      expect(result).toEqual({ totalCount: 1, list: [{ id: 'review-id' }] });
    });
  });

  describe('getDriverReviews (운전자 리뷰 조회)', () => {
    it('운전자의 리뷰 목록, 총 개수, 평점 통계를 반환해야 한다', async () => {
      mockReviewRepository.findManyDriverReviews.mockResolvedValue([{ id: 'review-id' }]);
      mockReviewRepository.totalCount.mockResolvedValue(5);
      mockReviewRepository.getDriverRatingStats.mockResolvedValue([
        { score: 5, _count: 3 },
        { score: 4, _count: 2 },
      ]);
      mockReviewRepository.getDriverAverageRating.mockResolvedValue(4.6);

      const result = await reviewService.getDriverReviews('driver-id', {});

      expect(result).toEqual({
        totalCount: 5,
        stats: { averageRating: 4.6, ratingCounts: [0, 0, 0, 2, 3] },
        list: [{ id: 'review-id' }],
      });
    });
  });

  describe('postReview (리뷰 작성)', () => {
    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId: 'user-id' });
    });

    it('이미 리뷰가 존재하면 ReviewAlreadyExistsException을 던져야 한다', async () => {
      mockEstimationRepository.findById.mockResolvedValue({
        driverId: 'driver-id',
        reviews: [{ estimationId: 'estimation-id', ownerId: 'user-id' }],
      });

      await expect(reviewService.postReview('estimation-id', { comment: 'Good', score: 5 })).rejects.toThrow(
        ReviewAlreadyExistsException,
      );
    });

    it('리뷰를 정상적으로 생성해야 한다', async () => {
      mockEstimationRepository.findById.mockResolvedValue({ driverId: 'driver-id', reviews: [] });
      mockReviewRepository.create.mockResolvedValue({ id: 'review-id' });

      const result = await reviewService.postReview('estimation-id', { comment: 'Good', score: 5 });

      expect(result).toEqual({ id: 'review-id' });
    });
  });

  describe('patchReview (리뷰 수정)', () => {
    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId: 'user-id' });
    });

    it('존재하지 않는 리뷰를 수정하려 하면 ReviewNotFoundException을 던져야 한다', async () => {
      mockReviewRepository.findByReviewId.mockResolvedValue(null);
      await expect(reviewService.patchReview('review-id', { comment: 'Updated', score: 4 })).rejects.toThrow(
        ReviewNotFoundException,
      );
    });

    it('사용자가 리뷰의 소유자가 아니면 ForbiddenException을 던져야 한다', async () => {
      mockReviewRepository.findByReviewId.mockResolvedValue({ ownerId: 'other-user' });

      await expect(reviewService.patchReview('review-id', { comment: 'Updated', score: 4 })).rejects.toThrow(ForbiddenException);
    });

    it('리뷰를 정상적으로 수정해야 한다', async () => {
      mockReviewRepository.findByReviewId.mockResolvedValue({ ownerId: 'user-id' });
      mockReviewRepository.update.mockResolvedValue({ id: 'review-id', comment: 'Updated', score: 4 });

      const result = await reviewService.patchReview('review-id', { comment: 'Updated', score: 4 });

      expect(result).toEqual({ id: 'review-id', comment: 'Updated', score: 4 });
    });
  });

  describe('deleteReview (리뷰 삭제)', () => {
    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId: 'user-id' });
    });

    it('존재하지 않는 리뷰를 삭제하려 하면 ReviewNotFoundException을 던져야 한다', async () => {
      mockReviewRepository.findByReviewId.mockResolvedValue(null);
      await expect(reviewService.deleteReview('review-id')).rejects.toThrow(ReviewNotFoundException);
    });

    it('사용자가 리뷰의 소유자가 아니면 ForbiddenException을 던져야 한다', async () => {
      mockReviewRepository.findByReviewId.mockResolvedValue({ ownerId: 'other-user' });

      await expect(reviewService.deleteReview('review-id')).rejects.toThrow(ForbiddenException);
    });

    it('리뷰를 정상적으로 삭제해야 한다', async () => {
      mockReviewRepository.findByReviewId.mockResolvedValue({ ownerId: 'user-id' });
      mockReviewRepository.delete.mockResolvedValue({ id: 'review-id' });

      const result = await reviewService.deleteReview('review-id');

      expect(result).toEqual({ id: 'review-id' });
    });
  });
});
