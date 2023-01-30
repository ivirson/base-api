import { Request, Response } from "express";
import { Error } from "sequelize";
import { AppError } from "../../../shared/models/error.model";
import UsersService from "../services/users.service";

const usersService = new UsersService();

export default class UsersController {
  /**
   * @swagger
   * /users:
   *  get:
   *    tags:
   *      - Users
   *    summary: Get users
   *    responses:
   *      200:
   *        description: Returns all users
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/User'
   */
  public async findAll(
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const users = await usersService.findAll();
      return response.status(200).json(users);
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error querying the data.",
            error.errors ? error.errors.map((e: Error) => e.message) : error
          )
        );
    }
  }

  /**
   * @swagger
   * /users/{:id}:
   *  get:
   *    tags:
   *      - Users
   *    summary: Get user by id
   *    parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to retrieve.
   *         schema:
   *           type: integer
   *    responses:
   *      200:
   *        description: Returns a user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   *      404:
   *        description: User not found
   */
  public async findById(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;
    try {
      const user = await usersService.findById(id);

      if (!user) {
        return response.status(404).json(new AppError("User not found."));
      }

      return response.status(200).json(user);
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error querying the data.",
            error.errors ? error.errors.map((e: Error) => e.message) : error
          )
        );
    }
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     tags:
   *       - Users
   *     summary: Save user
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
  public async save(request: Request, response: Response): Promise<Response> {
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
            error.errors ? error.errors.map((e: Error) => e.message) : error
          )
        );
    }
  }

  /**
   * @swagger
   * /users/{:id}:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update user
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to update.
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: Updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   */
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user = request.body;

    try {
      const user = await usersService.findById(id);

      if (!user) {
        return response.status(404).json(new AppError("User not found."));
      }

      const updatedUser = await usersService.update(id, user);
      return response.status(200).json(updatedUser);
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error updating the data.",
            error.errors ? error.errors.map((e: Error) => e.message) : error
          )
        );
    }
  }

  /**
   * @swagger
   * /users/{:id}/avatar:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update user avatar
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to update.
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserAvatar'
   *     responses:
   *       200:
   *         description: Updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   */
  public async updateAvatar(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;
    console.log(request.body);

    const avatar = request.file?.filename as string;

    console.log(avatar);

    try {
      const user = await usersService.findById(id);

      if (!user) {
        return response.status(404).json(new AppError("User not found."));
      }

      const updatedUser = await usersService.updateAvatar(id, avatar);
      return response.status(200).json(updatedUser);
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error updating the data.",
            error.errors ? error.errors.map((e: Error) => e.message) : error
          )
        );
    }
  }

  /**
   * @swagger
   * /users/{:id}:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Delete user
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to delete.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Deleted
   */
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      await usersService.delete(id);
      return response.status(200).json();
    } catch (error: Error | any) {
      return response
        .status(500)
        .json(
          new AppError(
            "There was an error removing the data.",
            error.errors ? error.errors.map((e: Error) => e.message) : error
          )
        );
    }
  }
}
