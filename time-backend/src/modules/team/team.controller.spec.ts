import { TeamController } from './team.controller';

describe('TeamController', () => {
  const teamService = {
    createTeam: jest.fn(),
    listTeams: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
  };
  const userService = {
    getOrCreateDefault: jest.fn(),
    getUser: jest.fn(),
  };

  let controller: TeamController;
  let req: any;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new TeamController(
      teamService as any,
      userService as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    req = { session: {}, user: { _id: 'u1', id: 'u1' } };
    userService.getUser = jest.fn().mockResolvedValue({ _id: 'u1', id: 'u1' });
  });

  it('creates team', async () => {
    teamService.createTeam.mockResolvedValue({ name: 'Team' });
    const res = await controller.create(req as any, 'Team');
    expect(teamService.createTeam).toHaveBeenCalled();
    expect(res.name).toBe('Team');
  });

  it('lists teams', async () => {
    teamService.listTeams.mockResolvedValue([{ name: 'Team' }]);
    const res = await controller.list(req as any);
    expect(res.length).toBe(1);
  });

  it('adds member', async () => {
    await controller.addMember(req as any, 'team-1', 'user-2', undefined);
    expect(teamService.addMember).toHaveBeenCalled();
  });

  it('removes member', async () => {
    await controller.removeMember(req as any, 'team-1', 'user-2');
    expect(teamService.removeMember).toHaveBeenCalled();
  });
});
