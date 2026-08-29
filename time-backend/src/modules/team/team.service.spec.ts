import { Model } from 'mongoose';
import { TeamService } from './team.service';
import { TeamDocument } from './schemas/team.schema';

const makeTeam = (overrides: Partial<TeamDocument> = {}) =>
  ({
    _id: 'team-1',
    name: 'Pro Team',
    ownerId: { equals: (id: any) => id === 'owner' },
    memberIds: [{ equals: (id: any) => id === 'owner' }],
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as any;

describe('TeamService', () => {
  let service: TeamService;
  let model: jest.Mocked<Model<TeamDocument>>;
  const userService = {
    findByEmail: jest.fn(),
    getOrCreateDefault: jest.fn(),
  };

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([]) }),
      findById: jest.fn(),
    } as any;
    service = new TeamService(model, userService as any);
  });

  const proUser = { _id: 'owner', subscription: { planId: 'pro', status: 'active' } };

  it('creates a team for any user (now free)', async () => {
    model.create.mockResolvedValue(makeTeam());
    const team = await service.createTeam(proUser, 'Team');
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Team', ownerId: 'owner' }),
    );
    expect(team).toBeDefined();
  });

  it('adds member by email (creating if missing)', async () => {
    const teamDoc = makeTeam({ memberIds: [{ equals: () => false, toString: () => 'owner' }] });
    model.findById.mockResolvedValue(teamDoc);
    userService.findByEmail.mockResolvedValue(null);
    userService.getOrCreateDefault.mockResolvedValue({ _id: 'new-user' });

    const res = await service.addMember({
      teamId: 'team-1',
      requester: proUser,
      memberEmail: 'a@b.com',
    });

    expect(userService.getOrCreateDefault).toHaveBeenCalledWith('a@b.com');
    expect(teamDoc.save).toHaveBeenCalled();
    expect(res.memberIds.length).toBe(2);
  });

  it('removes member when owner requests', async () => {
    const memberHex = '507f1f77bcf86cd799439011';
    const teamDoc = makeTeam({
      memberIds: [
        { equals: (id: any) => id.toString() === 'owner' },
        { equals: (id: any) => id.toString() === memberHex },
      ],
    });
    model.findById.mockResolvedValue(teamDoc);

    const res = await service.removeMember('team-1', proUser, memberHex);

    expect(teamDoc.save).toHaveBeenCalled();
    expect(res.memberIds.some((m: any) => m.equals(memberHex))).toBe(false);
  });
});
