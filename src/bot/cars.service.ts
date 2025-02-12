import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { Ctx, InjectBot, On } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";
import { Cars } from "./models/cars.model";

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Cars) private readonly carsModel: typeof Cars,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async onCars(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchilarning mashinalari`, {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["My cars"],
          ["Add cars"],
        ]).resize(),
      });
    } catch (error) {
      console.log("onCars error", error);
    }
  }

  async onCommandNewCars(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        await this.carsModel.create({ user_id, last_state: "car_number" });
        await ctx.reply(`Yangi mashinangiz raqamini kiriting:`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log("onCommandNewCars error", error);
    }
  }

  async onCommandMyCars(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const cars = await this.carsModel.findAll({
          where: { user_id, last_state: "finish" },
        });
        if (!cars.length) {
          await ctx.reply("Mashinalar mavjud emas");
          return;
        }
        cars.forEach(async (car) => {
          await ctx.replyWithHTML(
            `<b>Mashina raqami</b> ${car.car_number}\n<b>Mashina modeli</b> ${car.model}\n<b>Mashina rangi</b> ${car.color}\n<b>Mashina ishlab chiqarilgan yili</b> ${car.year}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "✏️ Update",
                      callback_data: `upd_${car.id}`,
                    },
                    {
                      text: "🗑️ Delete",
                      callback_data: `del_${car.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }
    } catch (error) {
      console.log("onCommandMyCars error", error);
    }
  }

  async onClickCarUpdate(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];
      const car = await this.carsModel.findByPk(car_id);
      await ctx.replyWithHTML(
        `<b>Mashina raqami</b> ${car?.car_number}\n<b>Mashina modeli</b> ${car?.model}\n<b>Mashina rangi</b> ${car?.color}\n<b>Mashina ishlab chiqarilgan yili</b> ${car?.year}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Raqami",
                  callback_data: `carnumber_${car?.id}`,
                },
                {
                  text: "Model",
                  callback_data: `model_${car?.id}`,
                },
              ],
              [
                {
                  text: "Rangi",
                  callback_data: `color_${car?.id}`,
                },
                {
                  text: "Yili",
                  callback_data: `year_${car?.id}`,
                },
              ],
            ],
          },
        }
      );
    } catch (error) {
      console.log("onClickCarUpdate error", error);
    }
  }

  async onChangeModel(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const contextAction = ctx.callbackQuery!["data"];
        const car_id = contextAction.split("_")[1];
        const property = contextAction.split("_")[0];
        const car = await this.carsModel.findByPk(car_id);
        user!.last_edit_carId = car_id;
        car!.edit_session = property;
        await user?.save();
        await car?.save();
        await ctx.reply("Yangi model nomini kiriting");
      }
    } catch (error) {
      console.log("onChangeModel error", error);
    }
  }

  async onChangeCarNumber(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const contextAction = ctx.callbackQuery!["data"];
        const car_id = contextAction.split("_")[1];
        const property = contextAction.split("_")[0];
        const car = await this.carsModel.findByPk(car_id);
        user!.last_edit_carId = car_id;
        car!.edit_session = property;
        await user?.save();
        await car?.save();
        await ctx.reply("Yangi raqamni kiriting");
      }
    } catch (error) {
      console.log("onChangeCarNumber error", error);
    }
  }

  async onChangeColor(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const contextAction = ctx.callbackQuery!["data"];
        const car_id = contextAction.split("_")[1];
        const property = contextAction.split("_")[0];
        const car = await this.carsModel.findByPk(car_id);
        user!.last_edit_carId = car_id;
        car!.edit_session = property;
        await user?.save();
        await car?.save();
        await ctx.reply("Yangi rangni kiriting");
      }
    } catch (error) {
      console.log("onChangeColor error", error);
    }
  }

  async onChangeYear(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const contextAction = ctx.callbackQuery!["data"];
        const car_id = contextAction.split("_")[1];
        const property = contextAction.split("_")[0];
        const car = await this.carsModel.findByPk(car_id);
        user!.last_edit_carId = car_id;
        car!.edit_session = property;
        await user?.save();
        await car?.save();
        await ctx.reply("Yangi yilni kiriting");
      }
    } catch (error) {
      console.log("onChangeYear error", error);
    }
  }

  async onClickCarDelete(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];
      const car = await this.carsModel.findByPk(car_id);
      const deletedcar = await this.carsModel.destroy({
        where: { id: car_id },
      });
      await ctx.reply("Quyidagi mashina o'chirildi");
      await ctx.replyWithHTML(
        `<b>Mashina raqami</b> ${car?.car_number}\n<b>Mashina modeli</b> ${car?.model}\n<b>Mashina rangi</b> ${car?.color}\n<b>Mashina ishlab chiqarilgan yili</b> ${car?.year}`
      );
    } catch (error) {
      console.log("onClickCarDelete error", error);
    }
  }
}
