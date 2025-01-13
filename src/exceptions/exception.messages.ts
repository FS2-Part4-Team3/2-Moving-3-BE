enum ExceptionMessages {
  BAD_REQUEST = '잘못된 요청입니다.',
  UNAUTHORIZED = '로그인이 필요합니다.',
  FORBIDDEN = '접근 권한이 없습니다.',
  NOT_FOUND = '찾을 수 없는 리소스입니다.',
  INTERNAL_SERVER_ERROR = '서버 내부 오류가 발생했습니다.',

  USER_NOT_FOUND = '찾을 수 없는 사용자입니다.',
  USER_ALREADY_EXIST = '이미 존재하는 사용자입니다.',
  WRONG_CREDENTIAL = '아이디 혹은 비밀번호가 틀렸습니다.',

  DRIVER_NOT_FOUND = '찾을 수 없는 기사입니다.',
  ALREADY_LIKED = '이미 찜해둔 기사입니다.',
  ALREADY_UNLIKED = '이미 찜 해제된 기사입니다.',

  MOVEINFO_NOT_FOUND = '이사 정보가 없습니다.',

  QUESTION_NOT_FOUND = '찾을 수 없는 문의입니다.',

  ID_FORMAT = 'ID 형식이 올바르지 않습니다.',
  INVALID_TOKEN = '토큰이 잘못되었습니다.',
  UN_CATCHED_EXCEPTION = '오류가 발생했습니다.',
}

export default ExceptionMessages;
