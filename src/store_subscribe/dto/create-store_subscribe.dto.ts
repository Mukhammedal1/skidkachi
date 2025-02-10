import { IsNotEmpty } from "class-validator";

export class CreateStoreSubscribeDto {
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  storeId: number;
}
