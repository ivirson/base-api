import Sequelize, { Model } from "sequelize";
import database from "../../../database/db";

export default class UserToken extends Model {}

UserToken.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "UserToken",
  }
);
