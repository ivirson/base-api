import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { addHours, isAfter } from "date-fns";
import nodemailer, { SentMessageInfo } from "nodemailer";
import { AppError } from "../../../shared/models/error.model";
import UserToken from "../../users/models/user-token.model";
import User from "../../users/models/user.model";
import UsersRepository from "../../users/repositories/users.repository";
import AuthRepository from "../repositories/auth.repository";

const authRepository = new AuthRepository();
const usersRepository = new UsersRepository();

export default class AuthService {
  public async login(
    email: string,
    password: string
  ): Promise<{ user: Partial<User>; token: string } | null> {
    try {
      const user = await usersRepository.findByEmail(email);
      if (!user) {
        throw new AppError("User not found.");
      }

      if (!(await bcrypt.compare(password, user.password!))) {
        throw new AppError("Incorrect password.");
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email,
        },
        process.env.TOKEN_KEY!
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error on login.", 500);
    }
  }

  public async createUserToken(userId: string): Promise<UserToken | null> {
    try {
      return await authRepository.createUserToken(userId);
    } catch (error) {
      console.log(error);
      throw new AppError("There was an error saving the data.", 500);
    }
  }

  public async sendMail(user: User, link: string): Promise<void> {
    try {
      const { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, SMTP_SENDER } =
        process.env;

      const smtpTransport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        },
      });

      const mail = {
        from: SMTP_SENDER,
        to: user.email,
        subject: "[App Budget+] Recuperação de Senha",
        html: `
          <div class='message-content'>
            <p>Olá ${user.name}!</p>
            <br />
            <p>Recebemos uma solicitação de redefinição de senha para a sua conta de
              usuário.</p>
            <p>Se realmente foi você quem solicitou, clique no link abaixo para cadastrar
              uma nova senha:</p>
            <p>
              <a href='${link}'>Resetar minha senha</a>
            </p>
            <p>Caso você não tenha realizado essa solicitação, por favor, descarte esse
              email.</p>
            <br />
            <p>Obrigado!</p>
            <p>Equipe Budget+</p>
          </div>
        `,
      };

      return new Promise((resolve, reject) => {
        smtpTransport
          .sendMail(mail)
          .then((response: SentMessageInfo) => {
            smtpTransport.close();
            return resolve(response);
          })
          .catch((error) => {
            smtpTransport.close();
            throw reject(error);
          });
      });
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error sending the email.", 500);
    }
  }

  public async resetPassword(token: string, password: string): Promise<void> {
    try {
      const userToken = await authRepository.getUserToken(token);

      if (!userToken) {
        throw new AppError("User Token not found");
      }

      const user = await usersRepository.findById(userToken.userId);

      if (!user) {
        throw new AppError("User not found");
      }

      const tokenCreatedAt = userToken!.createdAt as Date;
      const compareDate = addHours(tokenCreatedAt, 2);

      if (isAfter(Date.now(), compareDate)) {
        throw new AppError("Token expired");
      }

      user.password = password;
      usersRepository.update(user.id, user);
    } catch (error) {
      console.log(error);
      throw error || new AppError("There was an error querying the data.", 500);
    }
  }
}
