import Sequelize, { Model } from "sequelize";
import database from "./../../../database/db";

export default class User extends Model {}

User.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "User",
    defaultScope: {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    },
    scopes: {
      withPassword: {
        attributes: { exclude: [] },
      },
    },
    hooks: {
      afterCreate: (record) => {
        delete record.dataValues.password;
        delete record.dataValues.createdAt;
        delete record.dataValues.updatedAt;
      },
      afterUpdate: (record) => {
        delete record.dataValues.password;
        delete record.dataValues.createdAt;
        delete record.dataValues.updatedAt;
      },
    },
  }
);
