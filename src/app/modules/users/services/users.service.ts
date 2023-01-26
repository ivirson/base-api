import bcrypt from "bcrypt";
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

  public async update(id: string, user: any): Promise<User | null> {
    return await usersRepository.update(id, user);
  }

  public async delete(id: string): Promise<void> {
    await usersRepository.delete(id);
  }
}
