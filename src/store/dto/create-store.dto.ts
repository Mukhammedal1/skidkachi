import { IsNotEmpty, IsString } from "class-validator";

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  location: string;
  @IsString()
  phone: string;
  since: number;
  @IsNotEmpty()
  ownerId: number;
  @IsNotEmpty()
  store_social_linkId: number;
  @IsNotEmpty()
  districtId: number;
  @IsNotEmpty()
  regionId: number;
}
