import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import uploadConfig from "../../../middlewares/upload";
import User from "../models/user.model";
import UsersRepository from "../repositories/users.repository";

const usersRepository = new UsersRepository();

export default class UsersService {
  public async findAll(): Promise<User[]> {
    return await usersRepository.findAll();
  }

  public async findById(id: string): Promise<User | null> {
    return await usersRepository.findById(id);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await usersRepository.findByEmail(email);
  }

  public async save(user: any): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(user.password, salt);

    return await usersRepository.save({
      ...user,
      password: encryptedPassword,
    });
  }

  public async update(id: string, user: User): Promise<User | null> {
    if (user.dataValues.password) {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(
        user.dataValues.password,
        salt
      );
      user.dataValues.password = encryptedPassword;
    }
    return await usersRepository.update(id, user);
  }

  public async updateAvatar(id: string, avatar: string): Promise<User | null> {
    const user = await this.findById(id);

    if (user?.dataValues.avatar) {
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        user.dataValues.avatar
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
  }

  public async delete(id: string): Promise<void> {
    await usersRepository.delete(id);
  }
}
