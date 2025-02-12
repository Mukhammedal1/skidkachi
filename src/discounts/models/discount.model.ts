import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Store } from "../../store/models/store.models";
import { Category } from "../../category/models/category.model";
import { DiscountType } from "../../discount_type/models/discount_type.model";

interface IDiscountCreationAttr {
  title: string;
  description: string;
  discount_percent: number;
  start_date: Date;
  end_date: Date;
  discount_value: number;
  special_link: string;
  is_active: boolean;
  storeId: number;
  categoryId: number;
  discountTypeId: number;
}

@Table({ tableName: "discount" })
export class Discount extends Model<Discount, IDiscountCreationAttr> {
  @ApiProperty({
    example: 1,
    description: "Foydalanuvchi Id raqami",
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;
  @Column({
    type: DataType.INTEGER,
  })
  discount_percent: number;
  @Column({
    type: DataType.DATE,
  })
  start_date: Date;
  @Column({
    type: DataType.DATE,
  })
  end_date: Date;
  @Column({
    type: DataType.INTEGER,
  })
  discount_value: number;
  @Column({
    type: DataType.STRING,
  })
  special_link: string;
  @Column({
    type: DataType.BOOLEAN,
  })
  is_active: boolean;
  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
  })
  storeId: number;
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
  })
  categoryId: number;
  @ForeignKey(() => DiscountType)
  @Column({
    type: DataType.INTEGER,
  })
  discountTypeId: number;
}
