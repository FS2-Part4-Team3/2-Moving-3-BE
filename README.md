![로고](https://www.moving.wiki/_next/static/media/logo-icon-text.a208f1f3.svg)</br>
**FS2 PART4 TEAM3 MOVING BE**</br>
📅 2025.01.06 ~ 2025.02.25 </br>
🚀 **코드잇 스프린트 풀스택 2기 고급 프로젝트 3팀 (Backend)** 🖥️
</br>

✨ **원하는 이사 서비스를 요청하고** ✨  
🚚 **견적을 받아보세요** 💰
</br>

🔗 **관련 링크**

- **무빙 홈페이지**: [moving.wiki](https://www.moving.wiki/)
- **무빙 FE Github**: [moving FE Github](https://github.com/FS2-Part4-Team3/2-Moving-3-FE)
- **무빙 노션**: [Moving Notion](https://www.notion.so/168070c8d1ed80f780a9f4417cf0ec74?v=f40161463b244eab97b47b04b98f7f1a)
- **API 명세서**: [API Docs](https://backend.moving.wiki/api-docs)

</br>

- [🛠️ 기술 스택](#️-기술-스택)
- [👥 팀원 구성](#-팀원-구성)
- [📝 팀원별 구현 기능 상세](#-팀원별-구현-기능-상세)

</br>

# 🛠️ 기술 스택

**BackEnd** <br>
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)
![Passport](https://img.shields.io/badge/Passport-34E27A?style=flat&logo=passport&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![Winston](https://img.shields.io/badge/Winston-000000?style=flat)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-8E75B2?style=flat&logo=googleGemini&logoColor=white)

**Database** <br>
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

**DevOps & Others** <br>
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Node-cron](https://img.shields.io/badge/Node--cron-777BB4?style=flat&logo=node-schedule&logoColor=white)
![Scheduler](https://img.shields.io/badge/Scheduler-8A2BE2?style=flat&logo=scheduler&logoColor=white)

**Tools** <br>
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=flat&logo=slack&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)
![Gather](https://img.shields.io/badge/Gather-3A2EDE?style=flat&logo=gather&logoColor=white)
![Zoom](https://img.shields.io/badge/Zoom-0B5CFF?style=flat&logo=Zoom&logoColor=white)

# 👥 팀원 구성

|                   김태영                   |                   강명곤                    |                     김윤서                     |
| :----------------------------------------: | :-----------------------------------------: | :--------------------------------------------: |
| [태영's Github](https://github.com/csbizz) | [명곤's Github](https://github.com/GGON123) | [윤서's Github](https://github.com/hello-yoon) |

</br>

**김태영**

- 백엔드 파트장
- 백엔드 자료 및 회의 정리

</br>

**강명곤**

- 시연 영상 촬영
- 시연 영상 편집

</br>

**김윤서**

- 백엔드 일정 관리
- README.md 작성

</br>

# 📝 팀원별 구현 기능 상세

  </br>

🌟 김태영 (Backend Lead)

- 인증/인가, 소셜 로그인 (구글)
- 유저/기사 정보 및 비밀번호 수정
- 기사 CRUD 및 찜하기
- 문의 관련 기능
- 실시간 알림 및 채팅 구현
- 이사 날짜 기준 스케쥴러 작성
- 각종 Pipe, Exception filter, Log interceptor 등 작성
- 배포 세팅 및 자동화

  </br>
🌟 강명곤

- 지정 견적 요청 관련 기능
- 리뷰 관련 기능
- 이사 정보 조회, 수정, 삭제 기능
- 소셜 로그인 (카카오, 네이버)
- AI 리뷰 요약 및 키워드 분석 기능 구현
- AI 리뷰 관련 업데이트 스케쥴러 작성
- 논리삭제 미들웨어 작성

  </br>
🌟 김윤서

- 유저 - 이사 정보 생성 기능

- 드라이버 - 견적 생성/반려 기능
- 유저 - 이사 견적 확정 기능
- 견적 목록 조회 (유저/드라이버)
- 견적 상세 조회 (유저/드라이버)
- 견적 자동 만료 기능
