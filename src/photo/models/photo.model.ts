import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Discount } from "../../discounts/models/discount.model";
import { User } from "../../users/models/user.model";

interface IPhotoCreationAttr {
  url: string;
  discountId: number;
}

@Table({ tableName: "photo" })
export class Photo extends Model<Photo, IPhotoCreationAttr> {
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
  url: string;
  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  discountId: number;
}
