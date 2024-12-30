import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

const prismaClient = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

async function main() {}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async e => {
    console.log(e);
    await prismaClient.$disconnect();
    process.exit(1);
  })
  .finally(() => {
    console.log('end of seed');
  });
