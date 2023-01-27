import UserToken from "../../users/models/user-token.model";

export default class AuthRepository {
  public async createUserToken(userId: string): Promise<UserToken> {
    return await UserToken.create({ userId });
  }

  public async getUserToken(token: string): Promise<UserToken | null> {
    return await UserToken.findOne({
      where: {
        token,
      },
    });
  }
}
