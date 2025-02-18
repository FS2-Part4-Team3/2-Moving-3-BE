import { DriverRepository } from '#drivers/driver.repository.js';
import { Injectable, Logger } from '@nestjs/common';
import { ReviewKeywordsService } from './reviewKeywords.service.js';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AiReviewKeywordsScheduler {
  private readonly logger = new Logger(AiReviewKeywordsScheduler.name);

  constructor(
    private readonly reviewKeywordsService: ReviewKeywordsService,
    private readonly driverRepository: DriverRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async analyzeReviewKeywords() {
    this.logger.log('리뷰 키워드 분석 작업 시작');

    const drivers = await this.driverRepository.findAllDriverIds();
    if (!drivers.length) {
      this.logger.warn('드라이버가 존재하지 않습니다. 작업을 종료합니다.');
      return;
    }
    this.logger.log(`총 ${drivers.length}명의 드라이버 데이터를 처리합니다.`);

    for (const { id } of drivers) {
      try {
        this.logger.log(`리뷰 키워드 분석 중: ${id}`);
        await this.reviewKeywordsService.analyzeAiReviewKeywords(id);
        this.logger.log(`리뷰 키워드 분석 완료: ${id}`);
      } catch (error) {
        this.logger.error(`리뷰 키워드 분석 실패: ${id}`, error.stack);
      }
    }

    this.logger.log('AI 리뷰 키워드 분석 작업 완료.');
  }
}
