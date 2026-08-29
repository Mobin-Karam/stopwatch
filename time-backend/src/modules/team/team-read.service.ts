import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamRead, TeamReadDocument } from './schemas/team-read.schema';
import { TeamService } from './team.service';
import { TeamMessage } from './schemas/team-message.schema';

@Injectable()
export class TeamReadService {
  constructor(
    @InjectModel(TeamRead.name)
    private readonly readModel: Model<TeamReadDocument>,
    @InjectModel('TeamMessage')
    private readonly messageModel: Model<any>,
    private readonly teamService: TeamService,
  ) {}

  async markRead(teamId: string, userId: Types.ObjectId, at?: Date) {
    await this.teamService.getTeamForUser(teamId, userId);
    const lastReadAt = at ?? new Date();
    await this.readModel.updateOne(
      { teamId: new Types.ObjectId(teamId), userId },
      { $set: { lastReadAt } },
      { upsert: true },
    );
    return { lastReadAt };
  }

  async unreadCount(teamId: string, userId: Types.ObjectId) {
    await this.teamService.getTeamForUser(teamId, userId);
    const state = await this.readModel.findOne({
      teamId: new Types.ObjectId(teamId),
      userId,
    });
    const since = state?.lastReadAt ?? new Date(0);
    const count = await this.messageModel.countDocuments({
      teamId: new Types.ObjectId(teamId),
      createdAt: { $gt: since },
    });
    return { count };
  }
}
