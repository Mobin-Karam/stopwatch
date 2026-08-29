import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VoiceRoom, VoiceRoomDocument } from './schemas/voice-room.schema';
import { TeamService } from '../team/team.service';

@Injectable()
export class VoiceRoomService {
  constructor(
    @InjectModel(VoiceRoom.name)
    private roomModel: Model<VoiceRoomDocument>,
    private readonly teamService: TeamService,
  ) {}

  async createRoom(opts: {
    name: string;
    room: string;
    creator: any;
    teamId?: string;
  }) {
    if (!opts.name?.trim() || !opts.room?.trim()) {
      throw new BadRequestException('name and room are required');
    }
    if (opts.teamId) {
      await this.teamService.getTeamForUser(opts.teamId, opts.creator._id);
    }
    return this.roomModel.create({
      name: opts.name.trim(),
      room: opts.room.trim(),
      teamId: opts.teamId ? new Types.ObjectId(opts.teamId) : undefined,
      createdBy: opts.creator._id,
    });
  }

  async listRooms(teamId?: string) {
    const filter: any = {};
    if (teamId) filter.teamId = new Types.ObjectId(teamId);
    return this.roomModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async deleteRoom(id: string, requester: any) {
    const room = await this.roomModel.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    if (room.teamId) {
      await this.teamService.getTeamForUser(room.teamId.toString(), requester._id);
    } else if (!room.createdBy.equals(requester._id)) {
      throw new BadRequestException('Only creator can delete');
    }
    await room.deleteOne();
    return { deleted: true };
  }
}
