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

interface IReviewCreationAttr {
  text: string;
  rating: number;
  photo: string;
  discountId: number;
  userId: number;
}

@Table({ tableName: "review" })
export class Review extends Model<Review, IReviewCreationAttr> {
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
  text: string;

  @Column({
    type: DataType.INTEGER,
  })
  rating: number;
  @Column({
    type: DataType.STRING,
  })
  photo: string;
  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  discountId: number;
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;
}
