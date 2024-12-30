export const postgresConfig = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
  }

  return {
    databaseUrl: process.env.DATABASE_URL,
  };
};

export default postgresConfig;
