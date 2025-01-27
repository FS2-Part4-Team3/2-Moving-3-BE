if (!process.env.NAVER_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID 환경변수가 설정되지 않았습니다.');
}
if (!process.env.NAVER_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET 환경변수가 설정되지 않았습니다.');
}
if (!process.env.NAVER_REDIRECT_URL) {
  throw new Error('GOOGLE_CLIENT_SECRET 환경변수가 설정되지 않았습니다.');
}

export const naverConfig = {
  naverClientId: process.env.NAVER_CLIENT_ID,
  naverClientSecret: process.env.NAVER_CLIENT_SECRET,
  naverRedirectURL: process.env.NAVER_REDIRECT_URL,
};

export default naverConfig;
