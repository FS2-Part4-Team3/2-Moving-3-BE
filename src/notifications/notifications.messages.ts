import { NotificationType } from '@prisma/client';

export const notificationMessages = {
  [NotificationType.MOVE_INFO_EXPIRED]: '이사 요청이 만료되었습니다.',
  [NotificationType.NEW_REQUEST]: '새 이사 요청이 등록되었습니다.',
  [NotificationType.NEW_ESTIMATION]: '새 견적이 등록되었습니다.',
  [NotificationType.REQUEST_REJECTED]: '지정 이사 요청이 거부되었습니다.',
  [NotificationType.ESTIMATION_CONFIRMED]: '견적이 확정되었습니다.',
  [NotificationType.NEW_QUESTION]: '새 문의가 등록되었습니다.',
  [NotificationType.D_7]: '이사일까지 7일 남았습니다.',
  [NotificationType.D_1]: '이사일까지 하루 남았습니다.',
  [NotificationType.D_DAY]: '이사 당일입니다!',
};
