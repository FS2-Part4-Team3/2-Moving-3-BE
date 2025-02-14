import { Injectable, Logger } from '@nestjs/common';
import { AiReviewSummaryService } from './aiReviewSummary.service.js';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DriverRepository } from '#drivers/driver.repository.js';

@Injectable()
export class AiReviewSummaryScheduler {
  private readonly logger = new Logger(AiReviewSummaryScheduler.name);

  constructor(
    private readonly aiReviewSummaryService: AiReviewSummaryService,
    private readonly driverRepository: DriverRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('AI 리뷰 요약 작업 시작...');

    const drivers = await this.driverRepository.findAllDriverIds();

    if (!drivers.length) {
      this.logger.warn('드라이버가 존재하지 않습니다. 작업을 종료합니다.');
      return;
    }

    for (const { id } of drivers) {
      try {
        this.logger.log(`리뷰 요약 중: ${id}`);
        await this.aiReviewSummaryService.generateAiReviewSummary(id);
        this.logger.log(`리뷰 요약 완료: ${id}`);
      } catch (error) {
        this.logger.error(`리뷰 요약 실패: ${id}`, error.stack);
      }
    }

    this.logger.log('AI 리뷰 요약 작업 완료.');
  }
}
