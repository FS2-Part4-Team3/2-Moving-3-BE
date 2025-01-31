import { notificationMessages } from '#notifications/notifications.messages.js';
import { fakerKO as faker } from '@faker-js/faker';
import { NotificationType, PrismaClient } from '@prisma/client';
import {
  addresses,
  areas,
  driverDescriptions,
  estimationComments,
  introduces,
  notificationTypes,
  progress,
  questionContents,
  reviewContents,
  serviceType,
  status,
} from './mock/mock.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

async function main() {
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.review.deleteMany(),
    prisma.question.deleteMany(),
    prisma.estimation.deleteMany(),
    prisma.request.deleteMany(),
    prisma.moveInfo.deleteMany(),
    prisma.driver.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Generate mock data for User
  const users = Array.from({ length: 10 }).map(() => {
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
      // image: faker.image.avatar(),
      password: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 128 }),
      salt: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 32 }),
      serviceType: userServiceTypes,
      areas: userAreas,
    };
  });
  await prisma.user.createMany({ data: users });

  // Generate mock data for Driver
  const drivers = Array.from({ length: 10 }).map(() => {
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
      // image: faker.image.avatar(),
      password: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 128 }),
      salt: faker.string.hexadecimal({ prefix: '', casing: 'lower', length: 32 }),
      phoneNumber: faker.phone.number(),
      introduce: introduces[faker.number.int({ min: 0, max: introduces.length - 1 })],
      description: driverDescriptions[faker.number.int({ min: 0, max: driverDescriptions.length - 1 })],
      serviceType: driverServiceTypes,
      availableAreas: driverAreas,
      applyCount: faker.number.int({ min: 1, max: 100 }),
      likeCount: faker.number.int({ min: 1, max: 50 }),
      startAt: faker.date.between({ from: '1980-01-01', to: '2010-12-31' }),
    };
  });
  await prisma.driver.createMany({ data: drivers });

  // Generate mock data for MoveInfo
  const moveInfos = Array.from({ length: 50 }).map(() => {
    const fromIndex = faker.number.int({ min: 0, max: addresses.length - 1 });
    let toIndex = faker.number.int({ min: 0, max: addresses.length - 1 });
    while (fromIndex === toIndex) {
      toIndex = faker.number.int({ min: 0, max: addresses.length - 1 });
    }

    return {
      id: faker.string.uuid(),
      serviceType: serviceType[faker.number.int({ min: 0, max: serviceType.length - 1 })],
      date: faker.date.future(),
      fromAddress: addresses[fromIndex],
      toAddress: addresses[toIndex],
      progress: progress[faker.number.int({ min: 0, max: progress.length - 1 })],
      ownerId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
    };
  });
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
    comment: estimationComments[faker.number.int({ min: 0, max: estimationComments.length - 1 })],
    moveInfoId: moveInfos[faker.number.int({ min: 0, max: moveInfos.length - 1 })].id,
    driverId: drivers[faker.number.int({ min: 0, max: drivers.length - 1 })].id,
  }));
  await prisma.estimation.createMany({ data: estimations });

  // Generate mock data for Question
  const questions = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    content: questionContents[faker.number.int({ min: 0, max: questionContents.length - 1 })],
    estimationId: estimations[faker.number.int({ min: 0, max: estimations.length - 1 })].id,
  }));
  await prisma.question.createMany({ data: questions });

  // Generate mock data for Review
  const reviews = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    comment: reviewContents[faker.number.int({ min: 0, max: reviewContents.length - 1 })],
    score: faker.number.int({ min: 1, max: 5 }),
    driverId: drivers[faker.number.int({ min: 0, max: drivers.length - 1 })].id,
    ownerId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
    estimationId: estimations[faker.number.int({ min: 0, max: estimations.length - 1 })].id,
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

  //
  function getRelation(type) {
    let relation;
    switch (type) {
      case NotificationType.MOVE_INFO_EXPIRED:
        relation = { moveInfoId: moveInfos[faker.number.int({ min: 0, max: moveInfos.length - 1 })].id };
        break;
      case NotificationType.NEW_REQUEST:
      case NotificationType.REQUEST_REJECTED:
        relation = { requestId: requests[faker.number.int({ min: 0, max: requests.length - 1 })].id };
        break;
      case NotificationType.NEW_ESTIMATION:
      case NotificationType.ESTIMATION_CONFIRMED:
        relation = { estimationId: estimations[faker.number.int({ min: 0, max: estimations.length - 1 })].id };
        break;
      case NotificationType.NEW_QUESTION:
        relation = { questionId: questions[faker.number.int({ min: 0, max: questions.length - 1 })].id };
        break;
      case NotificationType.D_7:
      case NotificationType.D_DAY:
      default:
        relation = {};
    }

    return relation;
  }

  // Generate mock data for notification to user
  const userNotifications = Array.from({ length: 100 }).map(() => {
    const type = notificationTypes[faker.number.int({ min: 0, max: notificationTypes.length - 1 })];
    const relation = getRelation(type);

    return {
      id: faker.string.uuid(),
      type,
      message: notificationMessages[type],
      // isRead: faker.datatype.boolean(),
      userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
      ...relation,
    };
  });
  await prisma.notification.createMany({ data: userNotifications });

  // Generate mock data for notification to driver
  const driverNotifications = Array.from({ length: 100 }).map(() => {
    const type = notificationTypes[faker.number.int({ min: 0, max: notificationTypes.length - 1 })];
    const relation = getRelation(type);

    return {
      id: faker.string.uuid(),
      type,
      message: notificationMessages[type],
      // isRead: faker.datatype.boolean(),
      driverId: drivers[faker.number.int({ min: 0, max: drivers.length - 1 })].id,
      ...relation,
    };
  });
  await prisma.notification.createMany({ data: driverNotifications });
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
