import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IUserCreationAttr {
  name: string;
  phone: string;
  email: string;
  hashed_password: string;
  activation_link: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, IUserCreationAttr> {
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
    type: DataType.STRING(50),
    allowNull: false,
  })
  name: string;
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  phone: string;
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  email: string;
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;
  @Column({
    type: DataType.STRING,
    defaultValue: false,
  })
  is_active: boolean;
  @Column({
    type: DataType.STRING,
    defaultValue: false,
  })
  is_owner: boolean;
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string|null
  @Column({
    type: DataType.STRING,
  })
  activation_link: string;
}
