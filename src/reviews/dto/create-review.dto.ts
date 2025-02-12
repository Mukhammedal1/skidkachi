import { IsString } from "class-validator";

export class CreateReviewDto {
  @IsString()
  text: string;
  rating: number;
  @IsString()
  photo: string;
  discountId: number;
  userId: number;
}
