import { IMoveService } from '#move/interfaces/move.service.interface.js';
import { IStorage, UserType } from '#types/common.types.js';
import { MoveInfoGetQueries } from '#types/queries.type.js';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { MoveRepository } from './move.repository.js';
import { MoveInfoNotFoundException, ReceivedEstimationException } from './move.exception.js';
import { Progress } from '@prisma/client';
import { MoveInfo, MoveInfoInputDTO } from './move.types.js';
import { ForbiddenException, InternalServerErrorException, NotFoundException } from '#exceptions/http.exception.js';
import { DriverInvalidTokenException } from '#drivers/driver.exception.js';
import { DriverService } from '#drivers/driver.service.js';
import { EstimationsFilter } from '#types/options.type.js';
import { EstimationRepository } from '#estimations/estimation.repository.js';
import { ConfirmedEstimationException, EstimationNotFoundException } from '#estimations/estimation.exception.js';
import { PrismaService } from '#global/prisma.service.js';

@Injectable()
export class MoveService implements IMoveService {
  constructor(
    private readonly driverService: DriverService,
    private readonly moveRepository: MoveRepository,
    private readonly als: AsyncLocalStorage<IStorage>,
    private readonly estimationRepository: EstimationRepository,
  ) {}

  private async getFilteredDriverData(driverId: string) {
    const driver = await this.driverService.findDriver(driverId);

    return {
      id: driver.id,
      name: driver.name,
      image: driver.image,
      applyCount: driver.applyCount,
      likeCount: driver.likeCount,
      rating: driver.rating,
      reviewCount: driver.reviewCount,
      career: driver.career,
    };
  }

  async getMoveInfos(options: MoveInfoGetQueries) {
    const { driverId, driver: driverInfo } = this.als.getStore();

    const list = await this.moveRepository.findMany(options, driverId, driverInfo.availableAreas);
    const totalCount = await this.moveRepository.getTotalCount(options, driverId, driverInfo.availableAreas);
    const counts = await this.moveRepository.getFilteringCounts(driverId, driverInfo.availableAreas);

    const moveInfo = { totalCount, counts, list };

    return moveInfo;
  }

  async getMoveInfo(moveInfoId: string) {
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveInfoId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }

    return moveInfo;
  }

  async checkMoveInfoExistence() {
    const { userId, type } = this.als.getStore();
    if (type !== UserType.User) {
      throw new DriverInvalidTokenException();
    }

    const moveInfo = await this.moveRepository.findByUserId(userId);

    return moveInfo;
  }

  async getReceivedEstimations(filter: EstimationsFilter) {
    const { userId } = this.als.getStore();

    const moveInfos = await this.moveRepository.findWithEstimationsByUserId(userId);

    return await Promise.all(
      moveInfos.map(async moveInfo => ({
        ...moveInfo,
        confirmedEstimation: moveInfo.confirmedEstimation
          ? {
              ...moveInfo.confirmedEstimation,
              driver: await this.getFilteredDriverData(moveInfo.confirmedEstimation.driverId),
            }
          : null,
        estimations:
          filter === EstimationsFilter.confirmed
            ? []
            : await Promise.all(
                moveInfo.estimations
                  .filter(estimation => estimation.id !== moveInfo.confirmedEstimation?.id)
                  .map(async estimation => ({
                    ...estimation,
                    driver: await this.getFilteredDriverData(estimation.driverId),
                  })),
              ),
      })),
    );
  }

  async postMoveInfo(moveData: MoveInfoInputDTO): Promise<MoveInfo> {
    const { userId } = this.als.getStore();
    const progress = Progress.OPEN;
    const moveInfo = await this.moveRepository.postMoveInfo({
      ...moveData,
      ownerId: userId,
      progress,
    });

    return moveInfo;
  }

  async patchMoveInfo(moveId: string, body: Partial<MoveInfoInputDTO>) {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    if (userId !== moveInfo.ownerId) {
      throw new ForbiddenException();
    }
    if (moveInfo.estimations.length > 0) {
      throw new ReceivedEstimationException();
    }

    const updatedMoveInfo = await this.moveRepository.update(moveId, body);

    return updatedMoveInfo;
  }

  async softDeleteMoveInfo(moveId: string) {
    const { userId } = this.als.getStore();
    const moveInfo = await this.moveRepository.findByMoveInfoId(moveId);

    if (!moveInfo) {
      throw new MoveInfoNotFoundException();
    }
    if (moveInfo.ownerId !== userId) {
      throw new ForbiddenException();
    }

    const softDeleteMoveInfo = await this.moveRepository.softDeleteMoveInfo(moveId);

    return softDeleteMoveInfo;
  }

  async confirmEstimation(moveInfoId: string, estimationId: string) {
    const { userId } = this.als.getStore();

    console.log('User ID:', userId);
    console.log('MoveInfo ID:', moveInfoId);
    // 1. 이사 정보 찾기
    const moveInfo = await this.moveRepository.findMoveInfoById(moveInfoId);
    if (!moveInfo) {
      console.log('MoveInfo:', moveInfo);
      throw new MoveInfoNotFoundException();
    }

    if (moveInfo.ownerId !== userId) {
      console.error('권한이 없습니다.');
      throw new ForbiddenException();
    }

    // 2. 이미 확정된 견적이 있는지 확인
    const isConfirmed = await this.moveRepository.checkConfirmedEstimation(moveInfoId);
    console.log('Is Confirmed:', isConfirmed);

    if (isConfirmed) {
      console.error('이미 확정된 견적이 있습니다.');

      throw new ConfirmedEstimationException();
    }

    // 3. 해당 이사 정보에 연결된 견적 찾기 (해당 이사정보와 연결된 견적인지 확인)
    const estimation = await this.estimationRepository.findEstimationByMoveInfo(moveInfoId, estimationId);
    console.log('Estimation:', estimation); // 조회된 견적 정보 확인

    if (!estimation) {
      console.error('견적 정보가 없습니다.');

      throw new EstimationNotFoundException();
    }

    // 4. 이사 정보 업데이트하기 (확정된 견적 ID 등록 + 상태 업데이트)
    console.log('Confirming Estimation...');
    //  await this.moveRepository.confirmEstimation(moveInfoId, estimationId);

    this.moveRepository.confirmEstimation(moveInfoId, estimationId);
    this.estimationRepository.confirmedForIdEstimation(estimationId, moveInfoId);
  }

  // await this.prisma.$transaction([
  //   this.moveRepository.confirmEstimation(moveInfoId, estimationId),
  //   this.estimationRepository.confirmedForIdEstimation(estimationId, moveInfoId),
  // ]);

  //   try {
  //     await this.prisma.$transaction(async prisma => {
  //       await this.moveRepository.confirmEstimation(prisma, moveInfoId, estimationId);
  //       await this.estimationRepository.confirmedForIdEstimation(prisma, estimationId, moveInfoId);
  //     });
  //   } catch (error) {
  //     console.error('견적 확정 오류 발생:', error);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' 형식의 인수는 'PrismaService' 형식의 매개 변수에 할당될 수 없습니다.
  // 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' 형식에 'PrismaService' 형식의 onModuleInit, $on, $connect, $disconnect 외 3개 속성이 없습니다.

  //아니면 레포지토리를 두개다 moveRepository에 만들어두기.?

  //레포지토리가 다르면 트랙잭션을 ..따로..?..??
  // await this.moveRepository.confirmEstimation(moveInfoId, estimationId);
  // await this.estimationRepository.confirmedForIdEstimation(estimationId, moveInfoId);

  // 1. 두개의 레포지토리를 move나 estimation 중 한곳으로 옮기는게 나을지 xx
  // 1-2. 하나로 합치면..? 너무 많은가..?
  // 2. 현재 프리시마 의존성?인가..? 이 너무 높아지는게 아닌지..?..
  // 3. db가 제대로 연결이 되게 된다면 아래꺼는 없애도될 거 같아서..
}
//}
