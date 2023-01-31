import { Request, Response } from "express";
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
    try {
      const { email, password } = request.body;
      const credentials = await authService.login(email, password);
      return response.status(200).json(credentials);
    } catch (error: AppError | any) {
      return response.status(error.statusCode || 500).json(error);
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
    try {
      const user = request.body;
      const createdUser = await usersService.save(user);
      return response.status(201).json(createdUser);
    } catch (error: AppError | any) {
      return response.status(error.statusCode || 500).json(error);
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
    try {
      const { email } = request.body;
      const user = await usersService.findByEmail(email);
      const userToken = await authService.createUserToken(user!.id);
      const link = `${process.env.API_ROOT}/reset-password?token=${userToken?.token}`;

      await authService.sendMail(user!, link);

      return response.status(200).json();
    } catch (error: AppError | any) {
      return response.status(error.statusCode || 500).json(error);
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
    try {
      const { password, token } = request.body;
      await authService.resetPassword(token, password);
      return response.status(200).json();
    } catch (error: AppError | any) {
      return error || response.status(error.statusCode || 500).json(error);
    }
  }
}
