import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsPhoneNumber("UZ")
  phone?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
}
