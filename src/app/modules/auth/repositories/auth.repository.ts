import User from "../../users/models/user.model";

export default class AuthRepository {
  public async findByEmail(email: string): Promise<User | null> {
    return await User.scope("withPassword").findOne({
      where: {
        email,
      },
    });
  }
}
