import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Store } from "../../store/models/store.models";

interface IStoreSubscribeCreationAttr {
  userId: number;
  storeId: number;
}

@Table({ tableName: "store_subscribe" })
export class StoreSubscribe extends Model<
  StoreSubscribe,
  IStoreSubscribeCreationAttr
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;
  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
  })
  storeId: number;
}
