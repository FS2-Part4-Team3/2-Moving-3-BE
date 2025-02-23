enum ExceptionMessages {
  BAD_REQUEST = '잘못된 요청입니다.',
  UNAUTHORIZED = '로그인이 필요합니다.',
  FORBIDDEN = '접근 권한이 없습니다.',
  NOT_FOUND = '찾을 수 없는 리소스입니다.',
  INTERNAL_SERVER_ERROR = '서버 내부 오류가 발생했습니다.',

  USER_NOT_FOUND = '찾을 수 없는 사용자입니다.',
  USER_ALREADY_EXIST = '이미 존재하는 사용자입니다.',
  WRONG_CREDENTIAL = '아이디 혹은 비밀번호가 틀렸습니다.',
  WRONG_PASSWORD = '비밀번호가 틀렸습니다.',
  INVALID_PASSWORD_TYPE = '비밀번호는 8자 이상의 영문/숫자/특수문자의 조합입니다.',

  DRIVER_UNAUTHORIZED = '드라이버로 로그인해주세요.',

  DRIVER_NOT_FOUND = '찾을 수 없는 기사입니다.',
  ALREADY_LIKED = '이미 찜해둔 기사입니다.',
  ALREADY_UNLIKED = '이미 찜 해제된 기사입니다.',

  MOVEINFO_ALREADY_EXISTS = '이미 생성된 이사정보가 있습니다. 하나만 생성할 수 있습니다.',
  MOVEINFO_NOT_FOUND = '이사 정보가 없습니다.',
  RECEIVED_ESTIMATE = '받은 견적이 있습니다',

  MOVE_REQUEST_NOT_FOUND = '이사 요청을 먼저 해주세요.',
  ESTIMATION_ALREADY_CONFIRMED = '이미 확정된 견적이 있습니다.',

  PENDING_REQUEST_NOT_FOUND = '해당 드라이버에 대한 지정 견적 요청이 존재하지 않습니다.',
  ESTIMATION_NOT_FOUND = '찾을 수 없는 견적입니다.',
  ALREADY_ESTIMATION = '작성한 적이 있는 견적입니다.',
  MOVE_INFO_NOT_FOUND = '이사 정보를 찾을 수 없습니다.',
  ESTIMATION_ALREADY_EXISTS = '이미 견적이 존재합니다.',
  REQUEST_REJECTED = '요청이 거부되었습니다.',
  ESTIMATION_ACCESS_FORBIDDEN = '이 견적을 조회할 권한이 없습니다.',

  QUESTION_NOT_FOUND = '찾을 수 없는 문의입니다.',

  REVIEW_NOT_FOUND = '찾을 수 없는 리뷰입니다.',
  REVIEW_ALREADY_SUBMITTED = '이미 리뷰를 작성하였습니다.',
  AI_REVIEWS_SUMMARY_NOT_FOUND = 'AI 리뷰 요약이 존재하지 않습니다.',

  REQUEST_NOT_FOUND = '찾을 수 없는 지정견적요청입니다.',
  ALREADY_REQUESTED = '이미 지정견적요청을 하였습니다.',
  ESTIMATION_ALREADY_RECEIVED = '이미 해당 드라이버로부터 견적을 받았으므로 지정견적 요청을 보낼 수 없습니다.',

  INVALID_NOTIFICATION_TYPE = '올바르지 않은 알림 형식입니다.',

  INVALID_USER_TYPE = '사용자 형식이 올바르지 않습니다.',
  ID_FORMAT = 'ID 형식이 올바르지 않습니다.',
  INVALID_TOKEN = '토큰이 잘못되었습니다.',
  TOKEN_NOT_FOUND = '토큰을 찾을 수 없습니다.',
  UN_CATCHED_EXCEPTION = '오류가 발생했습니다.',

  AUTO_COMPLETE_ERROR = '자동 완료 중 오류가 발생했습니다.',
}

export default ExceptionMessages;
