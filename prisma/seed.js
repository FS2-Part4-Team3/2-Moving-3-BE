import { fakerKO as faker, faker as fakerEN } from '@faker-js/faker';
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

  const serviceType = Object.values(ServiceType);
  const areas = Object.values(Area);
  const status = Object.values(Status);
  const progress = Object.values(Progress);
  const notificationTypes = Object.values(NotificationType);

  // Generate mock data for User
  const users = Array.from({ length: 20 }).map(() => {
    const userServiceTypes = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: serviceType.length }); i++) {
      const index = faker.number.int({ min: 0, max: serviceType.length - 1 });
      if (!userServiceTypes.includes(serviceType[index])) userServiceTypes.push(serviceType[index]);
    }
    const userAreas = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: areas.length }); i++) {
      const index = faker.number.int({ min: 0, max: areas.length - 1 });
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
      serviceType: userServiceTypes,
      areas: userAreas,
    };
  });
  await prisma.user.createMany({ data: users });

  // Generate mock data for Driver
  const drivers = Array.from({ length: 20 }).map(() => {
    const driverServiceTypes = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: serviceType.length }); i++) {
      const index = faker.number.int({ min: 0, max: serviceType.length - 1 });
      if (!driverServiceTypes.includes(serviceType[index])) driverServiceTypes.push(serviceType[index]);
    }
    const driverAreas = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: areas.length }); i++) {
      const index = faker.number.int({ min: 0, max: areas.length - 1 });
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
      introduce: fakerEN.lorem.sentence(),
      description: fakerEN.lorem.paragraph(),
      serviceType: driverServiceTypes,
      availableAreas: driverAreas,
      applyCount: faker.number.int({ min: 1, max: 100 }),
      likeCount: faker.number.int({ min: 1, max: 50 }),
      startAt: faker.date.between({ from: '1980-01-01', to: '2010-12-31' }),
    };
  });
  await prisma.driver.createMany({ data: drivers });

  // Generate mock data for MoveInfo
  const moveInfos = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    serviceType: serviceType[faker.number.int({ min: 0, max: serviceType.length - 1 })],
    date: faker.date.future(),
    fromAddress: faker.location.streetAddress(),
    toAddress: faker.location.streetAddress(),
    progress: progress[faker.number.int({ min: 0, max: progress.length - 1 })],
    ownerId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
  }));
  await prisma.moveInfo.createMany({ data: moveInfos });

  // Generate mock data for Request
  const requests = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    moveInfoId: moveInfos[faker.number.int({ min: 0, max: moveInfos.length - 1 })].id,
    status: status[faker.number.int({ min: 0, max: status.length - 1 })],
    driverId: drivers[faker.number.int({ min: 0, max: drivers.length - 1 })].id,
  }));
  await prisma.request.createMany({ data: requests });

  // Generate mock data for Estimation
  const estimations = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    price: faker.number.int({ min: 10000, max: 1000000, multipleOf: 1000 }),
    comment: fakerEN.lorem.sentence(),
    moveInfoId: moveInfos[faker.number.int({ min: 0, max: moveInfos.length - 1 })].id,
    driverId: drivers[faker.number.int({ min: 0, max: drivers.length - 1 })].id,
  }));
  await prisma.estimation.createMany({ data: estimations });

  // Generate mock data for Question
  const questions = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    content: fakerEN.lorem.sentence(),
    estimationId: estimations[faker.number.int({ min: 0, max: estimations.length - 1 })].id,
  }));
  await prisma.question.createMany({ data: questions });

  // Generate mock data for Review
  const reviews = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    comment: fakerEN.lorem.sentence(),
    score: faker.number.int({ min: 1, max: 5 }),
    driverId: drivers[faker.number.int({ min: 0, max: drivers.length - 1 })].id,
    ownerId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
  }));
  // await prisma.review.createMany({ data: reviews });
  for (const review of reviews) {
    await prisma.$transaction(async tx => {
      await tx.review.create({ data: review });

      const rating = await tx.review.aggregate({
        where: { driverId: review.driverId },
        _avg: { score: true },
      });

      await tx.driver.update({
        where: { id: review.driverId },
        data: { rating: Number(rating._avg.score.toFixed(2)) || 0 },
      });
    });
  }

  // Generate mock data for UserNotification
  const userNotifications = Array.from({ length: 20 }).map(() => ({
    id: faker.string.uuid(),
    type: notificationTypes[faker.number.int({ min: 0, max: notificationTypes.length - 1 })],
    message: fakerEN.lorem.sentence(),
    isRead: faker.datatype.boolean(),
    userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
  }));
  await prisma.userNotification.createMany({ data: userNotifications });

  // Generate mock data for DriverNotification
  const driverNotifications = Array.from({ length: 20 }).map(() => ({
    id: faker.string.uuid(),
    type: notificationTypes[faker.number.int({ min: 0, max: notificationTypes.length - 1 })],
    message: fakerEN.lorem.sentence(),
    isRead: faker.datatype.boolean(),
    driverId: drivers[faker.number.int({ min: 0, max: drivers.length - 1 })].id,
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
