import { RequestNotFoundException, AlreadyRequestedException } from '#requests/request.exception.js';
import { RequestRepository } from '#requests/request.repository.js';
import { RequestService } from '#requests/request.service.js';
import { MoveRepository } from '#move/move.repository.js';
import { AsyncLocalStorage } from 'async_hooks';
import { IStorage, StatusEnum } from '#types/common.types.js';
import { Test, TestingModule } from '@nestjs/testing';
import { MoveInfoNotFoundException } from '#move/move.exception.js';
import { ForbiddenException } from '#exceptions/http.exception.js';

describe('RequestService', () => {
  let requestService: RequestService;
  let requestRepository: RequestRepository;
  let moveRepository: MoveRepository;
  let als: AsyncLocalStorage<IStorage>;

  const mockRequestRepository = {
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockMoveRepository = {
    findByUserId: jest.fn(),
    findByMoveInfoId: jest.fn(),
  };

  const mockAls = {
    getStore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        { provide: RequestRepository, useValue: mockRequestRepository },
        { provide: MoveRepository, useValue: mockMoveRepository },
        { provide: AsyncLocalStorage, useValue: mockAls },
      ],
    }).compile();

    requestService = module.get<RequestService>(RequestService);
    requestRepository = module.get<RequestRepository>(RequestRepository);
    moveRepository = module.get<MoveRepository>(MoveRepository);
    als = module.get<AsyncLocalStorage<IStorage>>(AsyncLocalStorage);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(requestService).toBeDefined();
  });

  describe('getRequest (요청 조회)', () => {
    it('존재하지 않는 요청을 조회하면 RequestNotFoundException을 던져야 한다', async () => {
      mockRequestRepository.findById.mockResolvedValue(null);

      await expect(requestService.getRequest('request-id')).rejects.toThrow(RequestNotFoundException);
    });

    it('요청 정보를 moveinfoOwnerId와 함께 반환해야 한다', async () => {
      mockRequestRepository.findById.mockResolvedValue({ id: 'request-id', moveInfoId: 'moveInfo-id' });
      mockMoveRepository.findByMoveInfoId.mockResolvedValue({ ownerId: 'owner-id' });

      const result = await requestService.getRequest('request-id');
      expect(result).toEqual(expect.objectContaining({ moveinfoOwnerId: 'owner-id' }));
    });
  });

  describe('checkRequest (요청 가능 여부 확인)', () => {
    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId: 'user-id' });
    });

    it('사용자의 이사 정보가 없으면 MoveInfoNotFoundException을 던져야 한다', async () => {
      mockMoveRepository.findByUserId.mockResolvedValue(null);

      await expect(requestService.checkRequest('driver-id')).rejects.toThrow(MoveInfoNotFoundException);
    });

    it('요청이 없으면 isRequestPossible을 true로 반환해야 한다', async () => {
      mockMoveRepository.findByUserId.mockResolvedValue([{ id: 'moveInfo-id', requests: [] }]);

      const result = await requestService.checkRequest('driver-id');
      expect(result.isRequestPossible).toBe(true);
    });

    it('이미 요청이 존재하면 isRequestPossible을 false로 반환해야 한다', async () => {
      mockMoveRepository.findByUserId.mockResolvedValue([{ id: 'moveInfo-id', requests: [{ driverId: 'driver-id' }] }]);

      const result = await requestService.checkRequest('driver-id');
      expect(result.isRequestPossible).toBe(false);
    });
  });

  describe('postRequest (새로운 요청 생성)', () => {
    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId: 'user-id' });
    });

    it('사용자의 이사 정보가 없으면 MoveInfoNotFoundException을 던져야 한다', async () => {
      mockMoveRepository.findByUserId.mockResolvedValue(null);
      await expect(requestService.postRequest('driver-id')).rejects.toThrow(MoveInfoNotFoundException);
    });

    it('이미 요청이 존재하면 AlreadyRequestedException을 던져야 한다', async () => {
      mockMoveRepository.findByUserId.mockResolvedValue([
        { id: 'moveInfo-id', ownerId: 'user-id', requests: [{ driverId: 'driver-id' }] },
      ]);

      await expect(requestService.postRequest('driver-id')).rejects.toThrow(AlreadyRequestedException);
    });

    it('새로운 요청을 생성해야 한다', async () => {
      mockMoveRepository.findByUserId.mockResolvedValue([{ id: 'moveInfo-id', ownerId: 'user-id', requests: [] }]);
      mockRequestRepository.create.mockResolvedValue({ id: 'new-request-id' });

      const result = await requestService.postRequest('driver-id');

      expect(result).toEqual({ id: 'new-request-id' });
      expect(mockRequestRepository.create).toHaveBeenCalledWith({
        moveInfoId: 'moveInfo-id',
        status: StatusEnum.PENDING,
        driverId: 'driver-id',
      });
    });
  });

  describe('deleteRequest (요청 삭제)', () => {
    beforeEach(() => {
      mockAls.getStore.mockReturnValue({ userId: 'user-id' });
    });

    it('존재하지 않는 요청을 삭제하려 하면 RequestNotFoundException을 던져야 한다', async () => {
      mockRequestRepository.findById.mockResolvedValue(null);

      await expect(requestService.deleteRequest('request-id')).rejects.toThrow(RequestNotFoundException);
    });

    it('사용자가 요청의 소유자가 아니면 ForbiddenException을 던져야 한다', async () => {
      mockRequestRepository.findById.mockResolvedValue({ id: 'request-id', moveInfo: { ownerId: 'other-user' } });

      await expect(requestService.deleteRequest('request-id')).rejects.toThrow(ForbiddenException);
    });

    it('요청을 정상적으로 삭제해야 한다', async () => {
      mockRequestRepository.findById.mockResolvedValue({ id: 'request-id', moveInfo: { ownerId: 'user-id' } });
      mockRequestRepository.delete.mockResolvedValue({ id: 'request-id' });

      const result = await requestService.deleteRequest('request-id');

      expect(result).toEqual({ id: 'request-id' });
    });
  });
});
