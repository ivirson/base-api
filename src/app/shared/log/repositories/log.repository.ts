import Log from "../models/log.model";

export default class LogRepository {
  public async findAll(): Promise<Log[]> {
    return await Log.findAll();
  }

  public async findById(id: string): Promise<Log | null> {
    return await Log.findByPk(id);
  }

  public async save(user: any): Promise<Log> {
    return await Log.create(user);
  }
}
