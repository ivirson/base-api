import UserToken from "../../users/models/user-token.model";

export default class AuthRepository {
  public async createUserToken(userId: string): Promise<UserToken> {
    try {
      return await UserToken.create({ userId });
    } catch (error) {
      throw error;
    }
  }

  public async getUserToken(token: string): Promise<UserToken | null> {
    try {
      return await UserToken.findOne({
        where: {
          token,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
