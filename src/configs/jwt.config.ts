const jwtConfig = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
  }

  return {
    jwtSecret: process.env.JWT_SECRET,
    accessExpireTime: process.env.ACCESS_EXPIRE_TIME || '1h',
    refreshExpireTime: process.env.REFRESH_EXPIRE_TIME || '14d',
  };
};

export default jwtConfig;
