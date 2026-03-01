import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { OAuth2Client } from "google-auth-library";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../errors/AppError";
import { IUser } from "../types/schema.types";
import { UserService } from "./user.service";

const JWT_SECRET = process.env["JWT_SECRET"] ?? "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env["JWT_EXPIRES_IN"] ?? "7d";
const googleClient = new OAuth2Client(process.env["GOOGLE_CLIENT_ID"]);

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
}

export const AuthService = {
  async register(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: Partial<IUser>; tokens: AuthTokens }> {
    const existing = await UserModel.findOne({ email: input.email });
    if (existing) throw new ValidationError("Email already in use");

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await UserModel.create({
      ...input,
      password: hashedPassword,
    });

    const tokens = AuthService.generateTokens(user);

    const userObj = user.toObject() as IUser & { password?: string };
    //  if (userObj.password) delete userObj.password;

    return { user: userObj as Partial<IUser>, tokens };
  },

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ user: Omit<IUser, "password">; tokens: AuthTokens }> {
    const user = await UserModel.findOne({ email: input.email }).select(
      "+password",
    );
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password");

    if (!user.isActive) throw new AppError("Account is deactivated", 403);

    const tokens = AuthService.generateTokens(user);

    const userObj = user.toObject() as IUser & { password?: string };
    // delete userObj.password;

    return { user: userObj as Omit<IUser, "password">, tokens };
  },

  async getMe(id: string): Promise<IUser> {
    const user = await UserModel.findById(id).select("-__v");
    if (!user) throw new NotFoundError("User");
    return user;
  },

  generateTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      id: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    return { accessToken };
  },

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  },

  async verifyGoogleToken(idToken: string) {
    console.log(idToken, "in verifyGoogleToken service");
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload() as {
      name: string;
      email: string;
      sub: string;
      picture: string;
    };
    if (!payload) {
      throw new UnauthorizedError("Invalid Google token");
    }

    return payload;
  },

  async googleLogin(idToken: string) {
    console.log(idToken, "in googleLogin service");
    const payload = await this.verifyGoogleToken(idToken);
    const { email, name, sub, picture } = payload;
    if (!email) throw new ValidationError("Google account has no email");
    let user = await UserService.getUserByEmail(email);
    if (!user) {
      user = await UserService.createUser({
        name,
        email,
        password: "",
        photo: picture,
        role: "user",
        provider: "google",
        googleId: sub,
      });
    }

    const { accessToken } = this.generateTokens(user);

    const { password, ...safeUser } = user;

    return { user: safeUser, accessToken };
  },
};
