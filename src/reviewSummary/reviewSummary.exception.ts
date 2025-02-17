import ExceptionMessages from '#exceptions/exception.messages.js';
import { NotFoundException } from '#exceptions/http.exception.js';

export class AiReviewSummaryNotFoundException extends NotFoundException {
  constructor() {
    super(ExceptionMessages.AI_REVIEWS_SUMMARY_NOT_FOUND);
  }
}
