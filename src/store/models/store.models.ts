import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Region } from "../../region/models/region.model";
import { User } from "../../users/models/user.model";
import { District } from "../../district/models/district.model";
import { StoreSocialLink } from "../../store_social_link/models/store_social_link.model";

interface IStoreCreationAttr {
  name: string;
  location: string;
  phone: string;
  since: number;
  ownerId: number;
  store_social_linkId: number;
  districtId: number;
  regionId: number;
}

@Table({ tableName: "district" })
export class Store extends Model<Store, IStoreCreationAttr> {
  @ApiProperty({
    example: 1,
    description: "Store Id raqami",
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
  location: string;
  @Column({
    type: DataType.STRING,
  })
  phone: string;
  @Column({
    type: DataType.STRING,
  })
  since: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  ownerId: number;
  @ForeignKey(() => StoreSocialLink)
  @Column({
    type: DataType.INTEGER,
  })
  store_social_linkId: number;
  @ForeignKey(() => District)
  @Column({
    type: DataType.INTEGER,
  })
  districtId: number;
  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
  })
  regionId: number;
}
