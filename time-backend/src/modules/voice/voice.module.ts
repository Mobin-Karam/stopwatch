import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoiceGateway } from './voice.gateway';
import { VoiceController } from './voice.controller';
import { VoiceRoom, VoiceRoomSchema } from './schemas/voice-room.schema';
import { VoiceRoomService } from './voice-room.service';
import { UserModule } from '../user/user.module';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [
    UserModule,
    TeamModule,
    MongooseModule.forFeature([{ name: VoiceRoom.name, schema: VoiceRoomSchema }]),
  ],
  providers: [VoiceGateway, VoiceRoomService],
  controllers: [VoiceController],
})
export class VoiceModule {}
