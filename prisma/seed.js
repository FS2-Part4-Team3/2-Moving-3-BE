import { fakerKO as faker } from '@faker-js/faker';
import { Area, NotificationType, PrismaClient, Progress, ServiceType, Status } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

async function main() {
  await prisma.$transaction([
    prisma.driverNotification.deleteMany(),
    prisma.userNotification.deleteMany(),
    prisma.review.deleteMany(),
    prisma.question.deleteMany(),
    prisma.estimation.deleteMany(),
    prisma.request.deleteMany(),
    prisma.moveInfo.deleteMany(),
    prisma.driver.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const serviceTypes = Object.values(ServiceType);
  const areas = Object.values(Area);
  const status = Object.values(Status);
  const progress = Object.values(Progress);
  const notificationTypes = Object.values(NotificationType);

  // Generate mock data for User
  const users = Array.from({ length: 20 }).map(() => {
    const userServiceTypes = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      const index = faker.number.int({ min: 0, max: 2 });
      if (!userServiceTypes.includes(serviceTypes[index])) userServiceTypes.push(serviceTypes[index]);
    }
    const userAreas = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: 17 }); i++) {
      const index = faker.number.int({ min: 0, max: 16 });
      if (!userAreas.includes(areas[index])) userAreas.push(areas[index]);
    }

    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      image: faker.image.avatar(),
      password: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 128 }),
      salt: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 32 }),
      serviceTypes: userServiceTypes,
      areas: userAreas,
    };
  });
  await prisma.user.createMany({ data: users });

  // Generate mock data for Driver
  const drivers = Array.from({ length: 20 }).map(() => {
    const driverServiceTypes = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      const index = faker.number.int({ min: 0, max: 2 });
      if (!driverServiceTypes.includes(serviceTypes[index])) driverServiceTypes.push(serviceTypes[index]);
    }
    const driverAreas = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: 17 }); i++) {
      const index = faker.number.int({ min: 0, max: 16 });
      if (!driverAreas.includes(areas[index])) driverAreas.push(areas[index]);
    }

    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      nickname: faker.internet.displayName(),
      image: faker.image.avatar(),
      password: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 128 }),
      salt: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 32 }),
      phoneNumber: faker.phone.number(),
      introduce: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      serviceTypes: driverServiceTypes,
      availableAreas: driverAreas,
      applyCount: faker.number.int({ min: 1, max: 100 }),
      favoriteCount: faker.number.int({ min: 1, max: 50 }),
      score: faker.number.float({ min: 0, max: 5 }),
    };
  });
  await prisma.driver.createMany({ data: drivers });

  // Generate mock data for MoveInfo
  const moveInfos = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    type: serviceTypes[faker.number.int({ min: 0, max: 2 })],
    date: faker.date.future(),
    fromAddress: faker.location.streetAddress(),
    toAddress: faker.location.streetAddress(),
    progress: progress[faker.number.int({ min: 0, max: 5 })],
    ownerId: users[faker.number.int({ min: 0, max: 19 })].id,
  }));
  await prisma.moveInfo.createMany({ data: moveInfos });

  // Generate mock data for Request
  const requests = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    moveInfoId: moveInfos[faker.number.int({ min: 0, max: 49 })].id,
    status: status[faker.number.int({ min: 0, max: 4 })],
    driverId: drivers[faker.number.int({ min: 0, max: 19 })].id,
  }));
  await prisma.request.createMany({ data: requests });

  // Generate mock data for Estimation
  const estimations = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    price: faker.number.int({ min: 10000, max: 1000000, multipleOf: 1000 }),
    comment: faker.lorem.sentence(),
    moveInfoId: moveInfos[faker.number.int({ min: 0, max: 49 })].id,
    driverId: drivers[faker.number.int({ min: 0, max: 19 })].id,
  }));
  await prisma.estimation.createMany({ data: estimations });

  // Generate mock data for Question
  const questions = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    content: faker.lorem.sentence(),
    estimationId: estimations[faker.number.int({ min: 0, max: 49 })].id,
  }));
  await prisma.question.createMany({ data: questions });

  // Generate mock data for Review
  const reviews = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    comment: faker.lorem.sentence(),
    score: faker.number.int({ min: 1, max: 5 }),
    driverId: drivers[faker.number.int({ min: 0, max: 19 })].id,
    ownerId: users[faker.number.int({ min: 0, max: 19 })].id,
  }));
  await prisma.review.createMany({ data: reviews });

  // Generate mock data for UserNotification
  const userNotifications = Array.from({ length: 20 }).map(() => ({
    id: faker.string.uuid(),
    type: notificationTypes[faker.number.int({ min: 0, max: 2 })],
    message: faker.lorem.sentence(),
    isRead: faker.datatype.boolean(),
    userId: users[faker.number.int({ min: 0, max: 19 })].id,
  }));
  await prisma.userNotification.createMany({ data: userNotifications });

  // Generate mock data for DriverNotification
  const driverNotifications = Array.from({ length: 20 }).map(() => ({
    id: faker.string.uuid(),
    type: notificationTypes[faker.number.int({ min: 0, max: 2 })],
    message: faker.lorem.sentence(),
    isRead: faker.datatype.boolean(),
    driverId: drivers[faker.number.int({ min: 0, max: 19 })].id,
  }));
  await prisma.driverNotification.createMany({ data: driverNotifications });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(() => {
    console.log('end of seed');
  });
