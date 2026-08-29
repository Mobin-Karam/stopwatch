import { Model } from 'mongoose';
import { ProjectService } from './project.service';
import { ProjectDocument } from './schemas/project.schema';

const makeDoc = (overrides: Partial<ProjectDocument> = {}) =>
  ({
    _id: 'proj-1',
    userId: 'user-1',
    name: 'Project 1',
    color: '#60a5fa',
    archived: false,
    save: jest.fn().mockResolvedValue(undefined),
  }) as any;

describe('ProjectService', () => {
  let service: ProjectService;
  let model: jest.Mocked<Model<ProjectDocument>>;
  const teamService = { listTeams: jest.fn() };

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: 'proj-1' }]),
      }),
      findById: jest.fn(),
    } as any;
    teamService.listTeams.mockResolvedValue([]);
    service = new ProjectService(model, teamService as any);
  });

  it('creates a project with default color', async () => {
    const doc = makeDoc();
    model.create.mockResolvedValue(doc);

    const res = await service.create('user-1' as any, 'Work', undefined, undefined);

    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', name: 'Work', color: '#60a5fa' }),
    );
    expect(res).toBe(doc);
  });

  it('lists projects', async () => {
    const res = await service.list('user-1' as any);
    expect(model.find).toHaveBeenCalledWith({
      userId: 'user-1',
      archived: false,
    });
    expect(res).toEqual([{ _id: 'proj-1' }]);
  });

  it('updates project fields', async () => {
    const doc = makeDoc();
    model.findById.mockResolvedValue(doc);

    const res = await service.update('proj-1', {
      name: 'Renamed',
      color: '#000',
      archived: true,
    });

    expect(res.name).toBe('Renamed');
    expect(res.color).toBe('#000');
    expect(res.archived).toBe(true);
    expect(doc.save).toHaveBeenCalled();
  });
});
