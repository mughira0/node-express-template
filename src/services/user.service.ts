import { NotFoundError, ValidationError } from "../errors/AppError";
import { UserModel } from "../models/user.model";
import { IUser } from "../types/schema.types";

export const UserService = {
  async getAllUsers(): Promise<IUser[]> {
    return UserModel.find({ isActive: true }).select("-__v");
  },

  async getUserById(id: string): Promise<IUser> {
    const user = await UserModel.findById(id).select("-__v");
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async getUserByEmail(email: string, isError = false): Promise<IUser | null> {
    const user = await UserModel.findOne({ email }).lean();
    if (!user && isError) throw new NotFoundError("User");
    return user;
  },

  async createUser(input: Partial<IUser>): Promise<IUser> {
    const existing = await UserModel.findOne({ email: input.email });
    if (existing) throw new ValidationError("Email already in use");

    const user = await UserModel.create(input);
    // strip password from the returned object
    const result = user.toObject() as IUser & { password?: string };
    // delete result.password;
    return result as IUser;
  },

  async updateUser(id: string, input: Partial<IUser>): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!user) throw new NotFoundError("User");
    return user;
  },

  async deleteUser(id: string): Promise<void> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );
    if (!user) throw new NotFoundError("User");
  },

  async hardDeleteUser(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundError("User");
  },
};
