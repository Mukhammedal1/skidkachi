import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class VerifyOtpDto {
  @IsPhoneNumber("UZ")
  phone: string;
  @IsString()
  @IsNotEmpty()
  otp: string;
  @IsString()
  @IsNotEmpty()
  verification_key: string;
}
