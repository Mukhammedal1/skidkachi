import { IsString } from "class-validator";

export class CreateDiscountDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  discount_percent: number;
  start_date: Date;
  end_date: Date;
  discount_value: number;
  @IsString()
  special_link: string;
  is_active: boolean;
  storeId: number;
  categoryId: number;
  discountTypeId: number;
}
