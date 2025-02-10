import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ISocialLinkCreationAttr {
  name: string;
  icon: string;
}

@Table({ tableName: "social_link" })
export class SocialLink extends Model<SocialLink, ISocialLinkCreationAttr> {
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
  icon: string;
}
