import UserToken from "../../users/models/user-token.model";
import AuthRepository from "../repositories/auth.repository";

const authRepository = new AuthRepository();

export default class AuthService {
  public async createUserToken(userId: string): Promise<UserToken | null> {
    return await authRepository.createUserToken(userId);
  }

  // public async sendMail(email: string): Promise<null> {}
}
