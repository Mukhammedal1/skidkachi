import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ICarsCreationAttr {
  user_id: number | undefined;
  last_state: string;
}

@Table({ tableName: "cars" })
export class Cars extends Model<Cars, ICarsCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.BIGINT,
  })
  user_id: number | undefined;
  @Column({
    type: DataType.STRING,
  })
  car_number: string | undefined;
  @Column({
    type: DataType.STRING,
  })
  model: string | undefined;
  @Column({
    type: DataType.STRING,
  })
  color: string | undefined;
  @Column({
    type: DataType.INTEGER,
  })
  year: number | undefined;
  @Column({
    type: DataType.STRING,
  })
  last_state: string;
  @Column({
    type: DataType.STRING,
  })
  edit_session: string;
}
