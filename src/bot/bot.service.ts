import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { Ctx, InjectBot, On } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";
import { locationRequest } from "telegraf/typings/button";
import { Cars } from "./models/cars.model";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Cars) private readonly carsModel: typeof Cars,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    const user_id = ctx.from?.id;
    const user = await this.botModel.findByPk(user_id);
    if (!user) {
      await this.botModel.create({
        user_id,
        username: ctx.from?.username,
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
        lang: ctx.from?.language_code,
      });
      await ctx.reply(
        `Iltimos, <b>Telefon raqamni yuborish</b> tugmasini bosing`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("Telefon raqamni yuborish")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else if (!user.status) {
      await ctx.reply(
        `Iltimos, <b>Telefon raqamni yuborish</b> tugmasini bosing`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("Telefon raqamni yuborish")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else {
      await this.bot.telegram.sendChatAction(user_id!, "typing");
      await ctx.reply(
        `Ushbu bot Chegirmachi foydalanuvchilarini faollashtirish uchun ishlatiladi`,
        {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        }
      );
    }
  }

  async onContact(ctx: Context) {
    if ("contact" in ctx.message!) {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.reply(`Iltimos, <b>Start</b> tugmasini bosing`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]])
            .resize()
            .oneTime(),
        });
      } else if (ctx.message!.contact.user_id != user_id) {
        await ctx.reply(`Iltimos, o'zingizni telefon raqamingizni yuboring`, {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("Telefon raqamni yuborish")],
          ])
            .resize()
            .oneTime(),
        });
      } else {
        user.phone_number = ctx.message.contact.phone_number;
        user.status = true;
        await user.save();
        await ctx.reply(`Tabriklayman, sizning akkauntingiz faollashtirildi.`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (user && user.status) {
        user.status = false;
        user.phone_number = "";
        await user.save();
        await ctx.reply(`Sizni yana kutib qolamiz!`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
            parse_mode: "HTML",
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });
          if (address && address.last_state == "location") {
            address.location = `${ctx.message.location.latitude}, ${ctx.message.location.longitude}`;
            address.last_state = "finish";
            await address.save();
            await ctx.reply(`Manzil saqlandi`, {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Mening manzillarim", "Yangi manzil qo'shish"],
              ]).resize(),
            });
          }
        }
      }
    } catch (error) {
      console.log("OnLocation error", error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
            parse_mode: "HTML",
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else {
          const car_id = user.last_edit_carId;
          if (car_id) {
            const car = await this.carsModel.findByPk(car_id);
            if (car && car.edit_session === "model") {
              car.model = ctx.message.text;
              await car.save();
              await ctx.reply(`Mashina modeli yangilandi`, {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["My cars", "Add cars"],
                ]).resize(),
              });
            } else if (car && car.edit_session === "carnumber") {
              car.car_number = ctx.message.text;
              await car.save();
              await ctx.reply(`Mashina raqami yangilandi`, {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["My cars", "Add cars"],
                ]).resize(),
              });
            } else if (car && car.edit_session === "color") {
              car.color = ctx.message.text;
              await car.save();
              await ctx.reply(`Mashina rangi yangilandi`, {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["My cars", "Add cars"],
                ]).resize(),
              });
            } else if (car && car.edit_session === "year") {
              car.year = Number(ctx.message.text);
              await car.save();
              await ctx.reply(`Mashina yili yangilandi`, {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["Mening mashinalarim", "Yangi mashina qo'shish"],
                ]).resize(),
              });
            }
          }
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });
          const car = await this.carsModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });
          if (car && car.last_state !== "finish") {
            if (car.last_state == "car_number") {
              car.car_number = ctx.message.text;
              car.last_state = "model";
              await car.save();
              await ctx.reply("Mashina modelini kiriting:", {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (car.last_state == "model") {
              car.model = ctx.message.text;
              car.last_state = "color";
              await car.save();
              await ctx.reply("Mashinangiz rangini kiriting:", {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (car.last_state == "color") {
              car.color = ctx.message.text;
              car.last_state = "year";
              await car.save();
              await ctx.reply(
                "Mashinangizni ishlab chiqarilgan yilini kiriting:",
                {
                  parse_mode: "HTML",
                  ...Markup.removeKeyboard(),
                }
              );
            } else if (car.last_state == "year") {
              car.year = Number(ctx.message.text);
              car.last_state = "finish";
              await car.save();
              await ctx.reply(`Yangi mashina saqlandi`, {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["My cars", "Add cars"],
                ]).resize(),
              });
            }
          }

          if (address && address.last_state !== "finish") {
            if (address.last_state == "name") {
              address.name = ctx.message.text;
              address.last_state = "address";
              await address.save();
              await ctx.reply("Manzilingizni kiriting:", {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (address.last_state == "address") {
              address.address = ctx.message.text;
              address.last_state = "location";
              await address.save();
              await ctx.reply("Manzilingiz lokatsiyasini kiriting:", {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  [Markup.button.locationRequest("Lokatsiyani yuboring")],
                ]).resize(),
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("Ontextda error", error);
    }
  }

  async deleteUnCautchedMessage(ctx: Context) {
    try {
      const message_id = ctx.message!.message_id;

      await ctx.deleteMessage(message_id);
    } catch (error) {
      console.log("deleteUnCautchedMessage error", error);
    }
  }

  async sendOtp(
    phone_number: string,
    OTP: string
  ): Promise<boolean | undefined> {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });
      if (!user || !user.status) {
        return false;
      }
      await this.bot.telegram.sendMessage(
        user.user_id!,
        `Verification OTP code:  ${OTP}`
      );
      return true;
    } catch (error) {
      console.log("sendotperror", error);
    }
  }
}
