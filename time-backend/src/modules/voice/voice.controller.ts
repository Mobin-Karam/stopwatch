import { Controller, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Body, Param, Post, Delete, Req, Query } from '@nestjs/common';
import { VoiceRoomService } from './voice-room.service';
import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import { AuthenticatedGuard } from '../../common/guards/guards';
import { Throttle } from '@nestjs/throttler';

@Controller('voice')
@UseGuards(AuthenticatedGuard)
export class VoiceController {
  constructor(
    private readonly voiceRoomService: VoiceRoomService,
    private readonly userService: UserService,
    private readonly teamService: TeamService,
  ) {}

  private async ensureUser(req: any) {
    if (req.user) {
      if (!req.session?.userId) req.session.userId = req.user.id;
      return req.user;
    }
    if (!req.session.userId) {
      const user = await this.userService.getOrCreateDefault();
      req.session.userId = user.id;
      return user;
    }
    return this.userService.getUser(req.session.userId);
  }

  @Get('ice')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  getIceServers() {
    const servers: any[] = [];
    const offline = process.env.OFFLINE_MODE === 'true';
    try {
      const raw = process.env.ICE_SERVERS;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) servers.push(...parsed);
      }
    } catch (err) {
      // ignore malformed env
    }

    // Optional TURN config (comma-separated URLs)
    const turnUrls = process.env.TURN_URLS;
    const turnUser = process.env.TURN_USERNAME;
    const turnPass = process.env.TURN_PASSWORD;
    if (turnUrls && turnUser && turnPass) {
      turnUrls.split(',').map((u) => u.trim()).filter(Boolean).forEach((url) => {
        servers.push({ urls: url, username: turnUser, credential: turnPass });
      });
    }

    if (servers.length === 0 && !offline) {
      servers.push({ urls: 'stun:stun.l.google.com:19302' });
      servers.push({ urls: 'stun:global.stun.twilio.com:3478?transport=udp' });
    }

    return {
      iceServers: servers,
    };
  }

  @Post('rooms')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async createRoom(
    @Req() req: any,
    @Body('name') name: string,
    @Body('room') room: string,
    @Body('teamId') teamId?: string,
  ) {
    const user = await this.ensureUser(req);
    return this.voiceRoomService.createRoom({
      name,
      room,
      teamId,
      creator: user,
    });
  }

  @Get('rooms')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async listRooms(@Query('teamId') teamId?: string) {
    return this.voiceRoomService.listRooms(teamId);
  }

  @Delete('rooms/:id')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async deleteRoom(@Req() req: any, @Param('id') id: string) {
    const user = await this.ensureUser(req);
    return this.voiceRoomService.deleteRoom(id, user);
  }
}
