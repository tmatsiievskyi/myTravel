import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsDefined()
  public role_id: string;

  @IsString()
  @IsDefined()
  public description: string;

  @IsBoolean()
  @IsOptional()
  public archived: boolean;
}
