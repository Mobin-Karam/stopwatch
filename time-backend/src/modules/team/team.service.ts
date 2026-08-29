import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private readonly userService: UserService,
  ) {}

  async getTeamForUser(teamId: string, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');
    if (!team.memberIds.some((m) => m.equals(userId))) {
      throw new ForbiddenException('Not a team member');
    }
    return team;
  }

  async listMemberIds(teamId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');
    return team.memberIds;
  }

  async createTeam(user: any, name: string) {
    if (!name?.trim()) throw new BadRequestException('Name is required');
    return this.teamModel.create({
      name: name.trim(),
      ownerId: user._id,
      memberIds: [user._id],
    });
  }

  async listTeams(userId: Types.ObjectId) {
    return this.teamModel
      .find({ memberIds: userId })
      .sort({ createdAt: 1 })
      .lean();
  }

  async addMember(opts: {
    teamId: string;
    requester: any;
    memberUserId?: string;
    memberEmail?: string;
  }) {
    const team = await this.teamModel.findById(opts.teamId);
    if (!team) throw new NotFoundException('Team not found');
    if (!team.ownerId.equals(opts.requester._id)) {
      throw new ForbiddenException('Only the team owner can invite members');
    }

    let memberId: Types.ObjectId | undefined;
    if (opts.memberUserId) {
      memberId = new Types.ObjectId(opts.memberUserId);
    } else if (opts.memberEmail) {
      const existing =
        (await this.userService.findByEmail(opts.memberEmail)) ??
        (await this.userService.getOrCreateDefault(opts.memberEmail));
      memberId = existing._id;
    } else {
      throw new BadRequestException('memberUserId or memberEmail is required');
    }

    if (!team.memberIds.some((m) => m.equals(memberId!))) {
      team.memberIds.push(memberId!);
      await team.save();
    }

    return team;
  }

  async removeMember(teamId: string, requester: any, memberId: string) {
    const team = await this.teamModel.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');
    if (!team.ownerId.equals(requester._id)) {
      throw new ForbiddenException('Only the team owner can remove members');
    }
    if (!Types.ObjectId.isValid(memberId)) {
      throw new BadRequestException('Invalid memberId');
    }
    const memberObjectId = new Types.ObjectId(memberId);
    team.memberIds = team.memberIds.filter(
      (m) => !m.equals(memberObjectId),
    );
    await team.save();
    return team;
  }
}
