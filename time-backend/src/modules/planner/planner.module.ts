import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PlannerTask,
  PlannerTaskSchema,
} from './schemas/planner-task.schema';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { UserModule } from '../user/user.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    UserModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: PlannerTask.name, schema: PlannerTaskSchema },
    ]),
  ],
  controllers: [PlannerController],
  providers: [PlannerService],
  exports: [PlannerService],
})
export class PlannerModule {}
