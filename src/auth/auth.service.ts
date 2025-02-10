import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInDto } from "./dto/signIn-dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException("Bunday foydalanuvchi mavjud");
    }
    const newuser = await this.userService.create(createUserDto);
    const response = {
      message:
        "Tabriklayman tizimga qo'shildingiz. Akkauntni faollashtirish uchun emailga xat yuborildi",
      userId: newuser.id,
    };
    return response;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const user = await this.userService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException("Eamil yoki password noto'g'ri");
    }
    if (!user.is_active) {
      throw new BadRequestException("User is not active");
    }
    const isvalidPassword = await bcrypt.compare(
      signInDto.password,
      user.hashed_password
    );

    if (!isvalidPassword) {
      throw new UnauthorizedException("Eamil yoki password noto'g'ri");
    }
    const tokens = await this.userService.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.userService.updateRefreshToken(
      user.id,
      hashed_refresh_token
    );
    if (!updatedUser) {
      throw new InternalServerErrorException("Tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // process.env.COOKIE_TIME
      httpOnly: true,
    });
    const response = {
      message: "User logged in",
      userId: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException("User not verified");
    }
    const hashed_refresh_token = null;
    await this.userService.updateRefreshToken(
      userData.id,
      hashed_refresh_token
    );
    res.clearCookie("refresh_token");
    const response = {
      message: "User logged out succesfully",
    };
    return response;
  }

  async refreshToken(userId:number,refreshToken:string,res:Response){
    const decodedToken=await this.jwtService.decode(refreshToken)
    if(userId !== decodedToken["id"]){
      throw new BadRequestException("Ruxsat etilmagan")
    }
    const user=await this.userService.findOne(userId)
    if(!user || !user.hashed_refresh_token){
      throw new BadRequestException("user not found")
    }
    const tokenMatch=await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token
    )
    if(!tokenMatch){
      throw new ForbiddenException("Forbidden")
    }
    const tokens = await this.userService.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.userService.updateRefreshToken(
      user.id,
      hashed_refresh_token
    );
   
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // process.env.COOKIE_TIME
      httpOnly: true,
    });
    const response = {
      message: "User refreshed",
      user: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }


}
