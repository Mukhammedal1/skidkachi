import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
  name: string;
  phone: string;
  email: string;
  hashed_password: string;
}

@Table({ tableName: "admin" })
export class Admin extends Model<Admin, IAdminCreationAttr> {
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
  is_creator: boolean;
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string | null;
}
