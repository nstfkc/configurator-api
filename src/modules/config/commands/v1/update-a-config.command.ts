import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateAConfigCommand {
  @ApiProperty({ description: 'The configuration' })
  @IsNotEmpty()
  @IsObject()
  payload!: Record<string, any>;
}
