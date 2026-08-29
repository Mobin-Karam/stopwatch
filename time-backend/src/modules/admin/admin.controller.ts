import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/guards/roles.decorator';
import { RolesGuard, AuthenticatedGuard } from '../../common/guards/guards';
import { UserService } from '../user/user.service';

@Controller('admin')
@UseGuards(RolesGuard, AuthenticatedGuard)
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Patch('users/:id/role')
  async setRole(@Param('id') id: string, @Body('role') role: 'admin' | 'user') {
    return this.userService.setRole(id, role);
  }
}
