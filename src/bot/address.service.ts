import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { Ctx, InjectBot, On } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async onAddress(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchi manzillari`, {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["Mening manzillarim"],
          ["Yangi manzil qo'shish"],
        ]).resize(),
      });
    } catch (error) {
      console.log("OnAddress error", error);
    }
  }

  async onCommandNewAddress(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        await this.addressModel.create({ user_id, last_state: "name" });
        await ctx.reply(
          `Yangi manzilingiz nomini kiriting (masalan, <i>uyim</i>):`,
          {
            parse_mode: "HTML",
            ...Markup.removeKeyboard(),
          }
        );
      }
    } catch (error) {
      console.log("OnCommand error", error);
    }
  }

  async onCommandMyAddress(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const addressses = await this.addressModel.findAll({
          where: { user_id, last_state: "finish" },
        });
        if (!addressses.length) {
          await ctx.reply("Locatsiyalar mavjud emas");
          return;
        }
        addressses.forEach(async (address) => {
          await ctx.replyWithHTML(
            `<b>Manzil nomi</b> ${address.name}\n<b>Manzil</b> ${address.address}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Lokatsiyani ko'rish",
                      callback_data: `loc_${address.id}`,
                    },
                    {
                      text: "Manzilni o'chirish",
                      callback_data: `del_${address.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }
    } catch (error) {
      console.log("onCommandMyAddress error", error);
    }
  }

  async onClickLocation(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const address_id = contextAction.split("_")[1];
      const address = await this.addressModel.findByPk(address_id);
      await ctx.replyWithLocation(
        Number(address?.location?.split(",")[0]),
        Number(address?.location?.split(",")[1])
      );
    } catch (error) {
      console.log("OnAddress error", error);
    }
  }

  async onClickLocationDelete(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const address_id = contextAction.split("_")[1];
      const address = await this.addressModel.findByPk(address_id);
      const deletedaddress = await this.addressModel.destroy({
        where: { id: address_id },
      });
      await ctx.reply("Quyidagi location o'chirildi");
      await ctx.replyWithLocation(
        Number(address?.location?.split(",")[0]),
        Number(address?.location?.split(",")[1])
      );
    } catch (error) {
      console.log("OnAddress error", error);
    }
  }
}
