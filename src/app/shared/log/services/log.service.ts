import { AppError } from "../../models/error.model";
import Log from "../models/log.model";
import LogRepository from "../repositories/log.repository";

const logRepository = new LogRepository();

export default class LogService {
  public async findAll(): Promise<Log[]> {
    try {
      return await logRepository.findAll();
    } catch (error) {
      throw new AppError("There was an error querying the data.", 500);
    }
  }

  public async findById(id: string): Promise<Log | null> {
    try {
      const log = await logRepository.findById(id);
      if (!log) {
        throw new AppError("Log not found.");
      }
      return log;
    } catch (error) {
      throw error || new AppError("There was an error querying the data.", 500);
    }
  }

  public async save(log: Partial<Log>): Promise<Log> {
    try {
      return await logRepository.save(log);
    } catch (error) {
      throw new AppError("There was an error saving the data.", 500);
    }
  }
}
