import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../shared/models/error.model";

const verifyToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token = request.headers["authorization"];

  if (!token) {
    return response
      .status(403)
      .json(new AppError("A token must to be passed in the request."));
  }

  try {
    jwt.verify(token, process.env.TOKEN_KEY!);
    return next();
  } catch (error) {
    return response.status(401).json(new AppError("Invalid token"));
  }
};

export default verifyToken;
