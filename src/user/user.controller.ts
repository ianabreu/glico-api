import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('profile')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }
}
