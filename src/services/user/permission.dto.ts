import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsDefined()
  public resource: string;

  @IsString()
  @IsDefined()
  public action: string;

  @IsString()
  @IsDefined()
  public attributes: string;
}

export class AddRemovePermissionDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  permissions: string[];
}
