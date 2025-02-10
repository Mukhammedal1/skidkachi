import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { User } from "./users/models/user.model";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { DiscountTypeModule } from "./discount_type/discount_type.module";
import { DiscountType } from "./discount_type/models/discount_type.model";
import { CategoryModule } from "./category/category.module";
import { Category } from "./category/models/category.model";
import { SocialLinkModule } from "./social_link/social_link.module";
import { SocialLink } from "./social_link/models/social_link.model";
import { RegionModule } from "./region/region.module";
import { Region } from "./region/models/region.model";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/models/admin.model";
import { AdminAuthModule } from "./admin_auth/admin_auth.module";
import { DistrictModule } from "./district/district.module";
import { District } from "./district/models/district.model";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { StoreModule } from "./store/store.module";
import { Store } from "./store/models/store.models";
import { StoreSubscribeModule } from "./store_subscribe/store_subscribe.module";
import { StoreSubscribe } from "./store_subscribe/models/store_subscribe.model";
import { StoreSocialLinkModule } from "./store_social_link/store_social_link.module";
import { StoreSocialLink } from "./store_social_link/models/store_social_link.model";
import { Bot } from "./bot/models/bot.model";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN || "12345",
        middlewares: [],
        include: [BotModule],
      }),
    }),
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        DiscountType,
        Category,
        SocialLink,
        Region,
        Admin,
        District,
        Store,
        StoreSubscribe,
        StoreSocialLink,
        Bot
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    DiscountTypeModule,
    CategoryModule,
    SocialLinkModule,
    RegionModule,
    AdminModule,
    AdminAuthModule,
    DistrictModule,
    BotModule,
    StoreModule,
    StoreSubscribeModule,
    StoreSocialLinkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
