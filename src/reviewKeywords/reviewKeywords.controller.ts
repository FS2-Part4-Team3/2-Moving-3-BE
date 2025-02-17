import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ReviewKeywordsService } from './reviewKeywords.service.js';
import { IReviewKeywordsController } from './interfaces/reviewKeywords.controller.interface.js';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('reviewKeywords')
export class ReviewKeywordsController implements IReviewKeywordsController {
  constructor(private readonly reviewKeywordsService: ReviewKeywordsService) {}
}
