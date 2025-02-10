import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IDiscountTypeCreationAttr {
  name: string;
  description: string;
}

@Table({ tableName: "discount_type" })
export class DiscountType extends Model<
  DiscountType,
  IDiscountTypeCreationAttr
> {
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
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;
}
