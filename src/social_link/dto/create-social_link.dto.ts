import { IsNotEmpty, IsString } from "class-validator";

export class CreateSocialLinkDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  icon: string;
}
