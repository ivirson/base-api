import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../../../database/db";

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password?: string;
  declare avatar: CreationOptional<string>;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
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
