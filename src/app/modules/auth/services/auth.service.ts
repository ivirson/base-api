import UserToken from "../../users/models/user-token.model";
import AuthRepository from "../repositories/auth.repository";
import nodemailer, { SentMessageInfo } from "nodemailer";
import MailMessage from "nodemailer/lib/mailer/mail-message";
import User from "../../users/models/user.model";
import { resolve } from "path";

const authRepository = new AuthRepository();

export default class AuthService {
  public async createUserToken(userId: string): Promise<UserToken | null> {
    return await authRepository.createUserToken(userId);
  }

  public async sendMail(user: User, link: string): Promise<void> {
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
      to: user.dataValues.email,
      subject: "[App Repertoire] Recuperação de Senha",
      html: `
        <div class='message-content'>
          <p>Olá ${user.dataValues.name}!</p>
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
          <p>Equipe Repertoire</p>
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
          return reject(error);
        });
    });
  }

  public async getUserToken(token: string): Promise<UserToken | null> {
    return await authRepository.getUserToken(token);
  }
}
