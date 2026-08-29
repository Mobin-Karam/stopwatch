import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PlannerService } from './planner.service';
import { UserService } from '../user/user.service';
import { EventsService } from '../events/events.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('planner')
@UseGuards(AuthenticatedGuard)
export class PlannerController {
  constructor(
    private readonly plannerService: PlannerService,
    private readonly userService: UserService,
    private readonly eventsService: EventsService,
  ) {}

  private async ensureUser(req: any) {
    if (req.user) {
      if (!req.session?.userId) req.session.userId = req.user.id;
      return req.user;
    }
    if (!req.session?.userId) {
      throw new UnauthorizedException();
    }
    return this.userService.getUser(req.session.userId);
  }

  @Post('tasks')
  async createTask(
    @Req() req: any,
    @Body('title') title: string,
    @Body('date') date: string,
    @Body('priority') priority?: number,
    @Body('projectId') projectId?: string,
    @Body('tags') tags?: string[],
  ) {
    const user = await this.ensureUser(req);
    const task = await this.plannerService.createTask(user._id, {
      title,
      date,
      priority,
      projectId: projectId as any,
      tags,
    });
    this.eventsService.emit({
      type: 'planner:created',
      projectId: task.projectId?.toString(),
      payload: { taskId: task._id.toString(), status: task.status },
    });
    return task;
  }

  @Get('tasks')
  async list(
    @Req() req: any,
    @Query('date') date?: string,
    @Query('tag') tag?: string,
  ) {
    const user = await this.ensureUser(req);
    return this.plannerService.listTasks(user._id, date, undefined, tag);
  }

  @Patch('tasks/:id')
  async update(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('status') status?: 'pending' | 'done' | 'archived',
    @Body('priority') priority?: number,
    @Body('date') date?: string,
    @Body('order') order?: number,
    @Body('projectId') projectId?: string,
    @Body('tags') tags?: string[],
  ) {
    const task = await this.plannerService.updateTask(id, {
      title,
      status,
      priority,
      date,
      order,
      projectId: projectId as any,
      tags,
    });
    this.eventsService.emit({
      type: 'planner:updated',
      projectId: (task as any).projectId?.toString?.(),
      payload: { taskId: id, status: task.status },
    });
    return task;
  }

  @Delete('tasks/:id')
  async delete(@Param('id') id: string) {
    return this.plannerService.deleteTask(id);
  }

  @Get('summary')
  async summary(@Req() req: any, @Query('days') days?: string) {
    const user = await this.ensureUser(req);
    const parsed = days ? Number(days) : 7;
    return this.plannerService.summary(
      user._id,
      Number.isFinite(parsed) ? parsed : 7,
    );
  }
}
