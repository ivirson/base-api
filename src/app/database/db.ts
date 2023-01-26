import { Sequelize } from "sequelize";

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './src/app/database/db.sqlite'
});

export default database;
