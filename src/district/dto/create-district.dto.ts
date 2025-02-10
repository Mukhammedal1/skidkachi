import { IsNotEmpty, IsString } from "class-validator";

export class CreateDistrictDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  regionId: number;
}
