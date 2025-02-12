import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class PhoneUserDto {
  @IsPhoneNumber("UZ")
  phone: string;
}
