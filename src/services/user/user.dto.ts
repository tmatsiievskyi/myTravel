import {
  IsDefined,
  IsEmail,
  IsIP,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsDefined()
  public firstName: string;

  @IsString()
  @IsDefined()
  public lastName: string;

  @IsEmail()
  @IsDefined()
  public email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(48)
  @NotContains(' ', { message: 'No spaces allowed' })
  @IsDefined()
  public password: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsString({ message: 'Use valid ISO country code(2 or 3-digits)' })
  @MinLength(2)
  @MaxLength(3)
  @IsOptional()
  public country: string;

  @IsString()
  @IsOptional()
  public timeZone: string;

  @IsString({ message: 'Use valid ISO language code(4-digits)' })
  @MinLength(4)
  @MaxLength(5)
  @IsOptional()
  public language: string;

  @IsIP()
  @IsOptional()
  public ip: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsDefined()
  public email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(24)
  @NotContains(' ', { message: 'Space is not allowed' })
  @IsDefined()
  public password: string;
}
