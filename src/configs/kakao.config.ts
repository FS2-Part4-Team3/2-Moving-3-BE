if (!process.env.KAKAO_CLIENT_ID) {
  throw new Error('KAKAO_CLIENT_ID 환경변수가 설정되지 않았습니다.');
}
if (!process.env.KAKAO_CLIENT_SECRET) {
  throw new Error('KAKAO_CLIENT_SECRET 환경변수가 설정되지 않았습니다.');
}

export const kakaoConfig = {
  kakaoClientId: process.env.KAKAO_CLIENT_ID,
  kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET,
};

export default kakaoConfig;
