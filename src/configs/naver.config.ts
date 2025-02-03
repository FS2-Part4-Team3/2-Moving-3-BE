if (!process.env.NAVER_CLIENT_ID) {
  throw new Error('NAVER_CLIENT_ID 환경변수가 설정되지 않았습니다.');
}
if (!process.env.NAVER_CLIENT_SECRET) {
  throw new Error('NAVER_CLIENT_SECRET 환경변수가 설정되지 않았습니다.');
}

export const naverConfig = {
  naverClientId: process.env.NAVER_CLIENT_ID,
  naverClientSecret: process.env.NAVER_CLIENT_SECRET,
};

export default naverConfig;
