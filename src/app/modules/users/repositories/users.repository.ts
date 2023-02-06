import User from "../models/user.model";

export default class UsersRepository {
  public async findAll(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.scope("withPassword").findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async save(user: any): Promise<User> {
    try {
      return await User.create(user);
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, user: any): Promise<User | null> {
    try {
      await User.update(user, {
        where: { id },
      });

      return await User.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await User.destroy({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
