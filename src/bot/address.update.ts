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

@Update()
export class AddressUpdate {
  constructor(private readonly addressService: AddressService) {}

  @Command("address")
  async onAddress(@Ctx() ctx: Context) {
    await this.addressService.onAddress(ctx);
  }

  @Hears("Yangi manzil qo'shish")
  async onCommandNewAddress(@Ctx() ctx: Context) {
    await this.addressService.onCommandNewAddress(ctx);
  }

  @Hears("Mening manzillarim")
  async onCommandMyAddress(@Ctx() ctx: Context) {
    await this.addressService.onCommandMyAddress(ctx);
  }

  @Action(/^loc_+\d+/)
  async onClickLocation(@Ctx() ctx: Context) {
    await this.addressService.onClickLocation(ctx);
  }

  @Action(/^del_+\d+/)
  async onClickLocationDelete(@Ctx() ctx: Context) {
    await this.addressService.onClickLocationDelete(ctx);
  }
}
