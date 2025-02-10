import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { SocialLink } from "../../social_link/models/social_link.model";

interface IStoreSocialLinkCreationAttr {
  url: string;
  description: string;
  social_linkId: number;
}

@Table({ tableName: "store_social_link" })
export class StoreSocialLink extends Model<
  StoreSocialLink,
  IStoreSocialLinkCreationAttr
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
  url: string;
  @Column({
    type: DataType.STRING,
  })
  description: string;

  @ForeignKey(() => SocialLink)
  @Column({
    type: DataType.INTEGER,
  })
  social_linkId: number;
}
