import { Model } from 'mongoose';
import { TeamMessageService } from './team-message.service';
import { TeamMessageDocument } from './schemas/team-message.schema';

describe('TeamMessageService', () => {
  let service: TeamMessageService;
  let model: jest.Mocked<Model<TeamMessageDocument>>;
  const teamService = { getTeamForUser: jest.fn() };
  const eventsService = { emit: jest.fn() };

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: 'm1' }]),
      }),
    } as any;
    teamService.getTeamForUser.mockResolvedValue({ _id: 'team-1' });
    service = new TeamMessageService(
      model,
      teamService as any,
      eventsService as any,
    );
  });

  it('posts a message and emits event', async () => {
    model.create.mockResolvedValue({
      _id: 'm1',
      teamId: 'team-1',
      senderId: 'u1',
      content: 'hi',
      createdAt: new Date(),
    } as any);

    const msg = await service.postMessage({
      teamId: 'team-1',
      sender: { _id: 'u1' } as any,
      content: 'hi @user:507f1f77bcf86cd799439011',
    });

    expect(teamService.getTeamForUser).toHaveBeenCalledWith('team-1', 'u1');
    expect(eventsService.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'team:message' }),
    );
    expect(eventsService.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'team:mention' }),
    );
    expect(msg._id).toBe('m1');
  });

  it('lists messages', async () => {
    const res = await service.listMessages('team-1', { _id: 'u1' } as any, 10);
    expect(teamService.getTeamForUser).toHaveBeenCalled();
    expect(model.find).toHaveBeenCalledWith({ teamId: 'team-1' });
    expect(res[0]._id).toBe('m1');
  });
});
