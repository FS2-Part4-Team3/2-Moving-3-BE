import { RequestController } from '#requests/request.controller.js';
import { RequestService } from '#requests/request.service.js';
import { AccessTokenGuard } from '#guards/access-token.guard.js';
import { GuardService } from '#guards/guard.service.js';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AsyncLocalStorage } from 'async_hooks';
import { RequestNotFoundException } from '#requests/request.exception.js';
import { BaseRequestOutputDTO, checkRequestOutputDTO, RequestOutputDTO } from '#requests/request.types.js';

describe('RequestController', () => {
  let controller: RequestController;
  let service: RequestService;

  const mockRequestService = {
    checkRequest: jest.fn(),
    getRequest: jest.fn(),
    postRequest: jest.fn(),
    deleteRequest: jest.fn(),
  };

  const mockGuardService = {
    validateAccessToken: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockAsyncLocalStorage = {
    getStore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        { provide: RequestService, useValue: mockRequestService },
        { provide: GuardService, useValue: mockGuardService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AsyncLocalStorage, useValue: mockAsyncLocalStorage },
        AccessTokenGuard,
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
    service = module.get<RequestService>(RequestService);

    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('checkRequest', () => {
    it('요청 가능 여부를 정상적으로 반환해야 한다', async () => {
      const driverId = 'driver123';
      const mockResponse: checkRequestOutputDTO = { isRequestPossible: true };

      jest.spyOn(service, 'checkRequest').mockResolvedValue(mockResponse);

      const result = await controller.checkRequest(driverId);

      expect(result).toEqual(mockResponse);
      expect(service.checkRequest).toHaveBeenCalledWith(driverId);
    });
  });

  describe('getRequest', () => {
    it('요청 상세 정보를 반환해야 한다', async () => {
      const requestId = 'request123';
      const mockResponse: RequestOutputDTO = {
        id: requestId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        moveInfoId: 'move123',
        driverId: 'driver123',
        status: 'PENDING',
        moveInfoOwnerId: 'owner123',
      };

      jest.spyOn(service, 'getRequest').mockResolvedValue(mockResponse);

      const result = await controller.getRequest(requestId);

      expect(result).toEqual(mockResponse);
      expect(service.getRequest).toHaveBeenCalledWith(requestId);
    });
  });

  describe('postRequest', () => {
    it('요청을 정상적으로 생성해야 한다', async () => {
      const driverId = 'driver123';
      const mockResponse: BaseRequestOutputDTO = {
        id: 'request123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        moveInfoId: 'move123',
        driverId: driverId,
        status: 'PENDING',
      };

      jest.spyOn(service, 'postRequest').mockResolvedValue(mockResponse);

      const result = await controller.postRequest(driverId);

      expect(result).toEqual(mockResponse);
      expect(service.postRequest).toHaveBeenCalledWith(driverId);
    });
  });

  describe('deleteRequest', () => {
    it('요청을 정상적으로 삭제해야 한다', async () => {
      const requestId = 'request123';
      const mockResponse: BaseRequestOutputDTO = {
        id: requestId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        moveInfoId: 'move123',
        driverId: 'driver123',
        status: 'CANCELED',
      };

      jest.spyOn(service, 'deleteRequest').mockResolvedValue(mockResponse);

      const result = await controller.deleteRequest(requestId);

      expect(result).toEqual(mockResponse);
      expect(service.deleteRequest).toHaveBeenCalledWith(requestId);
    });
  });

  describe('getRequest - 예외 처리', () => {
    it('존재하지 않는 요청 ID를 조회할 경우 RequestNotFoundException을 던져야 한다', async () => {
      const requestId = 'invalid_id';

      jest.spyOn(service, 'getRequest').mockRejectedValue(new RequestNotFoundException());

      await expect(controller.getRequest(requestId)).rejects.toThrow(RequestNotFoundException);
      expect(service.getRequest).toHaveBeenCalledWith(requestId);
    });
  });
});
