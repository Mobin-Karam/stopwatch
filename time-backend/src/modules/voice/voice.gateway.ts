import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'ws';
import { v4 as uuid } from 'uuid';
import { TeamService } from '../team/team.service';

type JoinPayload = {
  room: string;
  teamId?: string;
  userId?: string;
  secret?: string;
};
type SignalPayload = { room: string; targetId: string; data: any };
type ActivePayload = { room: string; speaking: boolean };

@WebSocketGateway({
  path: '/api/voice',
  cors: { origin: '*' },
})
export class VoiceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private rooms = new Map<
    string,
    Map<
      string,
      {
        socket: Socket;
        userId?: string;
        teamId?: string;
      }
    >
  >();

  constructor(private readonly teamService: TeamService) {}

  handleConnection(client: Socket) {
    (client as any).peerId = uuid();
    client.send(
      JSON.stringify({
        type: 'connected',
        peerId: (client as any).peerId,
      }),
    );
  }

  handleDisconnect(client: Socket) {
    this.leaveAll(client);
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: JoinPayload) {
    const room = payload.room;
    if (!room) {
      client.send(JSON.stringify({ type: 'error', message: 'room required' }));
      return;
    }
    const sharedSecret = process.env.VOICE_SHARED_SECRET;
    if (sharedSecret && payload.secret !== sharedSecret) {
      client.send(JSON.stringify({ type: 'error', message: 'unauthorized' }));
      client.close();
      return;
    }
    if (payload.teamId && payload.userId) {
      try {
        await this.teamService.getTeamForUser(
          payload.teamId,
          payload.userId as any,
        );
      } catch (err: any) {
        client.send(
          JSON.stringify({ type: 'error', message: err.message ?? 'forbidden' }),
        );
        client.close();
        return;
      }
    }

    let members = this.rooms.get(room);
    if (!members) {
      members = new Map();
      this.rooms.set(room, members);
    }
    members.set((client as any).peerId, {
      socket: client,
      userId: payload.userId,
      teamId: payload.teamId,
    });

    for (const [peerId, info] of members.entries()) {
      if (info.socket === client) continue;
      info.socket.send(
        JSON.stringify({ type: 'peer:joined', peerId: (client as any).peerId }),
      );
    }

    const peers = Array.from(members.keys()).filter(
      (pid) => pid !== (client as any).peerId,
    );
    client.send(JSON.stringify({ type: 'join:ok', peers }));
  }

  @SubscribeMessage('signal')
  handleSignal(client: Socket, payload: SignalPayload) {
    const { room, targetId, data } = payload;
    const members = this.rooms.get(room);
    if (!members) return;
    const target = members.get(targetId);
    if (target) {
      target.socket.send(
        JSON.stringify({
          type: 'signal',
          from: (client as any).peerId,
          data,
        }),
      );
    }
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, room?: string) {
    if (room) {
      this.leaveRoom(client, room);
    } else {
      this.leaveAll(client);
    }
  }

  @SubscribeMessage('active')
  handleActive(client: Socket, payload: ActivePayload) {
    const members = this.rooms.get(payload.room);
    if (!members) return;
    for (const [, info] of members.entries()) {
      if (info.socket === client) continue;
      info.socket.send(
        JSON.stringify({
          type: 'voice:active',
          peerId: (client as any).peerId,
          speaking: payload.speaking,
        }),
      );
    }
  }

  private leaveRoom(client: Socket, room: string) {
    const members = this.rooms.get(room);
    if (!members) return;
    members.delete((client as any).peerId);
    for (const [, info] of members.entries()) {
      info.socket.send(
        JSON.stringify({ type: 'peer:left', peerId: (client as any).peerId }),
      );
    }
    if (members.size === 0) this.rooms.delete(room);
  }

  private leaveAll(client: Socket) {
    for (const room of this.rooms.keys()) {
      this.leaveRoom(client, room);
    }
  }
}
