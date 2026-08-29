import { Model } from 'mongoose';
import { VoiceRoomService } from './voice-room.service';
import { VoiceRoomDocument } from './schemas/voice-room.schema';

describe('VoiceRoomService', () => {
  let service: VoiceRoomService;
  let model: jest.Mocked<Model<VoiceRoomDocument>>;
  const teamService = { getTeamForUser: jest.fn() };

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      }),
      findById: jest.fn(),
    } as any;
    service = new VoiceRoomService(model, teamService as any);
  });

  it('creates room with team validation', async () => {
    teamService.getTeamForUser.mockResolvedValue({});
    model.create.mockResolvedValue({ _id: 'r1' } as any);
    const teamHex = '507f1f77bcf86cd799439011';
    const res = await service.createRoom({
      name: 'Room',
      room: 'team-1-main',
      creator: { _id: 'u1' },
      teamId: teamHex,
    });
    expect(teamService.getTeamForUser).toHaveBeenCalledWith(teamHex, 'u1');
    expect(model.create).toHaveBeenCalled();
    expect(res._id).toBe('r1');
  });

  it('lists rooms', async () => {
    const res = await service.listRooms();
    expect(model.find).toHaveBeenCalled();
    expect(res).toEqual([]);
  });
});
