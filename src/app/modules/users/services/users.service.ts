import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import uploadConfig from "../../../middlewares/upload";
import { AppError } from "../../../shared/models/error.model";
import User from "../models/user.model";
import UsersRepository from "../repositories/users.repository";

const usersRepository = new UsersRepository();

export default class UsersService {
  public async findAll(): Promise<User[]> {
    try {
      return await usersRepository.findAll();
    } catch (error) {
      console.log(error);
      throw new AppError("There was an error querying the data.", 500);
    }
  }

  public async findById(id: string): Promise<User | null> {
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw new AppError("User not found.");
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error querying the data.", 500);
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await usersRepository.findByEmail(email);
      if (!user) {
        throw new AppError("User not found.");
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error querying the data.", 500);
    }
  }

  public async save(user: any): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(user.password, salt);

      return await usersRepository.save({
        ...user,
        password: encryptedPassword,
      });
    } catch (error) {
      console.log(error);
      throw new AppError("There was an error saving the data.", 500);
    }
  }

  public async update(id: string, user: User): Promise<User | null> {
    try {
      const userExist = await usersRepository.findById(id);
      if (!userExist) {
        throw new AppError("User not found.");
      }

      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(user.password, salt);
        user.password = encryptedPassword;
      }
      return await usersRepository.update(id, user);
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error updating the data.", 500);
    }
  }

  public async updateAvatar(id: string, avatar: string): Promise<User | null> {
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw new AppError("User not found.");
      }

      if (user?.avatar) {
        const userAvatarFilePath = path.join(
          uploadConfig.directory,
          user.avatar
        );

        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
      }

      return await usersRepository.update(id, {
        ...user?.dataValues,
        avatar,
      });
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error updating the data.", 500);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw new AppError("User not found.");
      }
      await usersRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error deleting the data.", 500);
    }
  }
}
