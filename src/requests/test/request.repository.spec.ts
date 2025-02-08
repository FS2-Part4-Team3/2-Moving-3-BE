import { PrismaService } from '#global/prisma.service.js';
import { RequestRepository } from '#requests/request.repository.js';
import { StatusEnum } from '#types/common.types.js';
import { Test, TestingModule } from '@nestjs/testing';

describe('RequestRepository', () => {
  let requestRepository: RequestRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    request: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    requestRepository = module.get<RequestRepository>(RequestRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('리포지토리가 정의되어 있어야 한다', () => {
    expect(requestRepository).toBeDefined();
  });

  describe('findById', () => {
    it('주어진 ID로 요청을 조회한다.', async () => {
      const mockRequest = { id: 'request-id', moveInfoId: 'move-1' };
      mockPrismaService.request.findUnique.mockResolvedValue(mockRequest);

      const result = await requestRepository.findById('request-id');

      expect(result).toBe(mockRequest);
      expect(mockPrismaService.request.findUnique).toHaveBeenCalledWith({
        where: { id: 'request-id' },
      });
    });

    it('존재하지 않는 ID로 요청을 조회할 때 null을 반환한다.', async () => {
      mockPrismaService.request.findUnique.mockResolvedValue(null);

      const result = await requestRepository.findById('non-existent-id');

      expect(result).toBeNull();
      expect(mockPrismaService.request.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });
  });

  describe('findByMoveInfoId', () => {
    it('주어진 moveInfoId로 요청 목록을 조회한다.', async () => {
      const mockRequests = [{ id: 'request-id1' }, { id: 'request-id2' }];
      mockPrismaService.request.findMany.mockResolvedValue(mockRequests);

      const result = await requestRepository.findByMoveInfoId('move-1');

      expect(result).toBe(mockRequests);
      expect(mockPrismaService.request.findMany).toHaveBeenCalledWith({
        where: { moveInfoId: 'move-1' },
      });
    });

    it('moveInfoId로 조회할 때 빈 요청 목록을 반환한다.', async () => {
      mockPrismaService.request.findMany.mockResolvedValue([]);

      const result = await requestRepository.findByMoveInfoId('move-1');

      expect(result).toEqual([]);
      expect(mockPrismaService.request.findMany).toHaveBeenCalledWith({
        where: { moveInfoId: 'move-1' },
      });
    });

    it('주어진 moveInfoId로 여러 개의 요청을 조회한다.', async () => {
      const mockRequests = [
        { id: 'request-id1', moveInfoId: 'move-1' },
        { id: 'request-id2', moveInfoId: 'move-1' },
      ];
      mockPrismaService.request.findMany.mockResolvedValue(mockRequests);

      const result = await requestRepository.findByMoveInfoId('move-1');

      expect(result).toBe(mockRequests);
      expect(mockPrismaService.request.findMany).toHaveBeenCalledWith({
        where: { moveInfoId: 'move-1' },
      });
    });
  });

  describe('create', () => {
    it('새로운 요청을 생성한다.', async () => {
      const mockRequest = { id: '1', moveInfoId: 'move-1', status: StatusEnum.PENDING, driverId: 'driver-id' };
      mockPrismaService.request.create.mockResolvedValue(mockRequest);

      const result = await requestRepository.create(mockRequest);

      expect(result).toBe(mockRequest);
      expect(mockPrismaService.request.create).toHaveBeenCalledWith({
        data: mockRequest,
      });
    });

    it('유효하지 않은 데이터로 요청을 생성하려고 할 때 에러를 반환한다.', async () => {
      const invalidData = { moveInfoId: null, status: StatusEnum.PENDING, driverId: null };
      mockPrismaService.request.create.mockRejectedValue(new Error('Invalid data'));

      await expect(requestRepository.create(invalidData)).rejects.toThrow('Invalid data');
      expect(mockPrismaService.request.create).toHaveBeenCalledWith({
        data: invalidData,
      });
    });
  });

  describe('update', () => {
    it('요청을 업데이트한다.', async () => {
      const mockRequest = { id: '1', status: StatusEnum.APPLY };
      mockPrismaService.request.update.mockResolvedValue(mockRequest);

      const result = await requestRepository.update('1', { status: StatusEnum.APPLY });

      expect(result).toBe(mockRequest);
      expect(mockPrismaService.request.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: StatusEnum.APPLY },
      });
    });
  });

  describe('delete', () => {
    it('요청을 삭제한다.', async () => {
      const mockRequest = { id: '1' };
      mockPrismaService.request.delete.mockResolvedValue(mockRequest);

      const result = await requestRepository.delete('1');

      expect(result).toBe(mockRequest);
      expect(mockPrismaService.request.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
