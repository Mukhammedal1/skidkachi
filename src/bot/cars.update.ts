import { repl } from "@nestjs/core";
import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { AddressService } from "./address.service";
import { CarsService } from "./cars.service";

@Update()
export class CarsUpdate {
  constructor(private readonly carsService: CarsService) {}

  @Command("cars")
  async onCars(@Ctx() ctx: Context) {
    await this.carsService.onCars(ctx);
  }

  @Hears("Yangi mashina qo'shish")
  async onCommandNewAddress(@Ctx() ctx: Context) {
    await this.carsService.onCommandNewCars(ctx);
  }

  @Hears("Mening mashinalarim")
  async onCommandMyCars(@Ctx() ctx: Context) {
    await this.carsService.onCommandMyCars(ctx);
  }
  @Action(/^model_+\d+/)
  async onChangeModel(@Ctx() ctx: Context) {
    await this.carsService.onChangeModel(ctx);
  }
  @Action(/^carnumber_+\d+/)
  async onChangeCarNumber(@Ctx() ctx: Context) {
    await this.carsService.onChangeCarNumber(ctx);
  }
  @Action(/^color_+\d+/)
  async onChangeColor(@Ctx() ctx: Context) {
    await this.carsService.onChangeColor(ctx);
  }
  @Action(/^year_+\d+/)
  async onChangeYear(@Ctx() ctx: Context) {
    await this.carsService.onChangeYear(ctx);
  }

  @Action(/^upd_+\d+/)
  async onClickCarUpdate(@Ctx() ctx: Context) {
    await this.carsService.onClickCarUpdate(ctx);
  }

  @Action(/^del_+\d+/)
  async onClickCarDelete(@Ctx() ctx: Context) {
    await this.carsService.onClickCarDelete(ctx);
  }
}
