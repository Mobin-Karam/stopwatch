import { Model } from 'mongoose';
import { TeamReadService } from './team-read.service';
import { TeamReadDocument } from './schemas/team-read.schema';

describe('TeamReadService', () => {
  let service: TeamReadService;
  let readModel: jest.Mocked<Model<TeamReadDocument>>;
  let messageModel: any;
  const teamService = { getTeamForUser: jest.fn() };

  beforeEach(() => {
    readModel = {
      updateOne: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn(),
    } as any;
    messageModel = {
      countDocuments: jest.fn().mockResolvedValue(2),
    };
    teamService.getTeamForUser.mockResolvedValue({});
    service = new TeamReadService(
      readModel,
      messageModel,
      teamService as any,
    );
  });

  const teamHex = '507f1f77bcf86cd799439011';
  const userHex = '507f1f77bcf86cd799439012';

  it('marks read with now when no timestamp provided', async () => {
    const res = await service.markRead(teamHex, userHex as any);
    expect(readModel.updateOne).toHaveBeenCalled();
    expect(res.lastReadAt).toBeInstanceOf(Date);
  });

  it('returns unread count since last read', async () => {
    readModel.findOne.mockResolvedValue({ lastReadAt: new Date('2024-01-01') } as any);

    const res = await service.unreadCount(teamHex, userHex as any);

    expect(messageModel.countDocuments).toHaveBeenCalled();
    expect(res.count).toBe(2);
  });
});
