import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamMessage, TeamMessageDocument } from './schemas/team-message.schema';
import { TeamService } from './team.service';
import { EventsService } from '../events/events.service';

const mentionRegex = /@user:([a-fA-F0-9]{24})/g;

@Injectable()
export class TeamMessageService {
  constructor(
    @InjectModel(TeamMessage.name)
    private readonly messageModel: Model<TeamMessageDocument>,
    private readonly teamService: TeamService,
    private readonly eventsService: EventsService,
  ) {}

  async postMessage(opts: {
    teamId: string;
    sender: any;
    content: string;
    projectId?: string;
  }) {
    if (!opts.content?.trim()) {
      throw new BadRequestException('content is required');
    }
    const team = await this.teamService.getTeamForUser(
      opts.teamId,
      opts.sender._id,
    );
    const message = await this.messageModel.create({
      teamId: team._id,
      senderId: opts.sender._id,
      projectId: opts.projectId ? new Types.ObjectId(opts.projectId) : undefined,
      content: opts.content.trim(),
    });

    const mentionsAll =
      opts.content.includes('@all') || opts.content.includes('@here');
    const userMentions: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = mentionRegex.exec(opts.content))) {
      userMentions.push(match[1]);
    }

    this.eventsService.emit({
      type: 'team:message',
      teamId: team._id.toString(),
      projectId: opts.projectId,
      payload: {
        messageId: message._id.toString(),
        senderId: opts.sender._id.toString(),
        content: message.content,
        createdAt: (message as any).createdAt,
        projectId: opts.projectId,
      },
    });

    if (mentionsAll || userMentions.length) {
      this.eventsService.emit({
        type: 'team:mention',
        teamId: team._id.toString(),
        projectId: opts.projectId,
        payload: {
          messageId: message._id.toString(),
          senderId: opts.sender._id.toString(),
          content: message.content,
          mention: mentionsAll ? 'all' : 'users',
          userIds: userMentions,
        },
      });
    }

    return message;
  }

  async listMessages(teamId: string, requester: any, limit = 50, since?: string) {
    const team = await this.teamService.getTeamForUser(teamId, requester._id);
    const safeLimit = Number.isFinite(limit) ? Math.min(limit, 200) : 50;
    const filter: any = { teamId: team._id };
    if (since) {
      const date = new Date(since);
      if (!Number.isNaN(date.getTime())) filter.createdAt = { $gt: date };
    }
    return this.messageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .lean();
  }
}
