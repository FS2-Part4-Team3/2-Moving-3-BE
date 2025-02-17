import { DriverRepository } from '#drivers/driver.repository.js';
import { Injectable, Logger } from '@nestjs/common';
import { ReviewKeywordsService } from './reviewKeywords.service.js';

@Injectable()
export class AiReviewKeywordsScheduler {
  private readonly logger = new Logger(AiReviewKeywordsScheduler.name);

  constructor(
    private readonly reviewKeywordsService: ReviewKeywordsService,
    private readonly driverRepository: DriverRepository,
  ) {}
}
