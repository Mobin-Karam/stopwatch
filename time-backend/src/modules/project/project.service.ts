import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { TeamService } from '../team/team.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private readonly teamService: TeamService,
  ) {}

  create(userId: Types.ObjectId, name: string, color?: string, teamId?: string) {
    return this.projectModel.create({
      userId,
      teamId: teamId ? new Types.ObjectId(teamId) : undefined,
      name: name.trim(),
      color: color?.trim() || '#60a5fa',
    });
  }

  async list(userId: Types.ObjectId) {
    return this.projectModel
      .find({ userId, archived: false })
      .sort({ createdAt: 1 })
      .lean();
  }

  async listAccessible(user: any) {
    const teams = await this.teamService.listTeams(user._id);
    const teamIds = teams.map((t: any) => t._id);
    return this.projectModel
      .find({
        archived: false,
        $or: [{ userId: user._id }, ...(teamIds.length ? [{ teamId: { $in: teamIds } }] : [])],
      })
      .sort({ createdAt: 1 })
      .lean();
  }

  listByTeam(teamId: Types.ObjectId) {
    return this.projectModel
      .find({ teamId, archived: false })
      .sort({ createdAt: 1 })
      .lean();
  }

  async findAccessibleProject(user: any, projectId: string) {
    const teams = await this.teamService.listTeams(user._id);
    const teamIds = teams.map((t: any) => t._id);
    const project = await this.projectModel.findOne({
      _id: projectId,
      archived: false,
      $or: [{ userId: user._id }, ...(teamIds.length ? [{ teamId: { $in: teamIds } }] : [])],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async ensureCanUseTeam(user: any, team: any) {
    if (!team.memberIds.some((m: any) => m.equals(user._id))) {
      throw new ForbiddenException('Not a member of this team');
    }
  }

  async update(
    projectId: string,
    payload: Partial<{ name: string; color: string; archived: boolean }>,
  ) {
    const project = await this.projectModel.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');
    if (payload.name !== undefined) project.name = payload.name.trim();
    if (payload.color !== undefined) project.color = payload.color.trim();
    if (payload.archived !== undefined) project.archived = payload.archived;
    await project.save();
    return project;
  }
}
