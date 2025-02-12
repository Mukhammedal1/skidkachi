import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { SequelizeModule } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { Address } from "./models/address.model";
import { AddressUpdate } from "./address.update";
import { AddressService } from "./address.service";
import { Cars } from "./models/cars.model";
import { CarsUpdate } from "./cars.update";
import { CarsService } from "./cars.service";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Address, Cars])],
  providers: [
    CarsUpdate,
    CarsService,
    AddressUpdate,
    AddressService,
    BotService,
    BotUpdate,
  ],
  exports: [BotService],
})
export class BotModule {}
