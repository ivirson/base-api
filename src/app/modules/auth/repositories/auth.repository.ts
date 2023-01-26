import UserToken from "../../users/models/user-token.model";

export default class AuthRepository {
  public async createUserToken(userId: string): Promise<UserToken> {
    return await UserToken.create({ userId });
  }
}
