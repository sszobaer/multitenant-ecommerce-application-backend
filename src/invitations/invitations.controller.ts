import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './DTOs/create-invitation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('invitations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @Roles('admin')
  sendInvite(
    @CurrentUser() user: { userId: string; tenantId: string; role: string },
    @Body() dto: CreateInvitationDto,
  ) {
    return this.invitationsService.sendInvite(user.tenantId, dto.email);
  }
}
