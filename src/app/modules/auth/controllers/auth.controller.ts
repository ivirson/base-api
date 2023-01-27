import bcrypt from "bcrypt";
import { addHours, isAfter } from "date-fns";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Error } from "sequelize";
import { AppError } from "../../../shared/models/error.model";
import UsersService from "../../users/services/users.service";
import AuthService from "../services/auth.service";

const authService = new AuthService();
const usersService = new UsersService();

export default class AuthController {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Login user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLogin'
   *     responses:
   *       200:
   *         description: Logged in
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserToken'
   *       404:
   *         description: User not found
   *       401:
   *         description: Incorrect password
   */
  public async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    try {
      const user = await usersService.findByEmail(email);

      if (!user) {
        return response.status(404).json(new AppError("User not found."));
      }

      if (!(await bcrypt.compare(password, user.dataValues.password))) {
        return response.status(401).json(new AppError("Incorrect password."));
      }

      const token = jwt.sign(
        {
          userId: user.dataValues.id,
          email,
        },
        process.env.TOKEN_KEY!
      );

      return response.status(200).json({
        user: {
          id: user.dataValues.id,
          name: user.dataValues.name,
          email: user.dataValues.email,
        },
        token,
      });
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error querying the data.",
            error.errors.map((e: Error) => e.message) || error
          )
        );
    }
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Register user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewUser'
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  public async register(
    request: Request,
    response: Response
  ): Promise<Response> {
    const user = request.body;

    try {
      const createdUser = await usersService.save(user);
      return response.status(201).json(createdUser);
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error saving the data.",
            error.errors.map((e: Error) => e.message) || error
          )
        );
    }
  }

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Forgot password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ForgotPassword'
   *     responses:
   *       200:
   *         description: Recovery link was sent
   *       404:
   *         description: User not found
   */
  public async forgotPassword(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { email } = request.body;

    try {
      const user = await usersService.findByEmail(email);

      if (!user) {
        return response.status(404).json(new AppError("User not found"));
      }

      const userToken = await authService.createUserToken(user.dataValues.id);
      const link = `${process.env.API_ROOT}/reset-password?token=${userToken?.dataValues.token}`;

      await authService.sendMail(user, link);

      return response.status(200).json();
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error querying the data.",
            error.errors.map((e: Error) => e.message) || error
          )
        );
    }
  }

  /**
   * @swagger
   * /auth/reset-password:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Reset password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPassword'
   *     responses:
   *       200:
   *         description: Password updated
   *       404:
   *         description: User or User Token not found
   *       401:
   *         description: Token expired
   */
  public async resetPassword(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { password, token } = request.body;

    try {
      const userToken = await authService.getUserToken(token);

      if (!userToken) {
        return response.status(404).json(new AppError("User Token not found"));
      }

      const user = await usersService.findById(userToken.dataValues.userId);

      if (!user) {
        return response.status(404).json(new AppError("User not found"));
      }

      const tokenCreatedAt = userToken.dataValues.created_at;
      const compareDate = addHours(tokenCreatedAt, 2);

      if (isAfter(Date.now(), compareDate)) {
        return response.status(401).json(new AppError("Token expired"));
      }

      usersService.update(user.dataValues.id, { ...user, password });

      return response.status(200).json();
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error querying the data.",
            error.errors.map((e: Error) => e.message) || error
          )
        );
    }
  }
}
