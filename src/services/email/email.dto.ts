import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  isEmail,
} from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @IsDefined()
  public from: string;

  @IsEmail()
  @IsDefined()
  public to: string;

  @IsOptional()
  @IsEmail()
  public cc?: string;

  @IsString()
  @IsDefined()
  public subject: string;

  @IsString()
  @IsDefined()
  public text: string;

  @IsString()
  public html?: string;
}
