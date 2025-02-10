import { IsNotEmpty, IsString } from "class-validator";

export class CreateStoreSocialLinkDto {
  @IsString()
  @IsNotEmpty()
  url: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  social_linkId: number;
}
