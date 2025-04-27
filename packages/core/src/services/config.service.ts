import { Injectable } from "@emilia-tan/decorators/src/barrel";
import * as dotenv from "dotenv";
import type { ConfigService } from "../interfaces/config";

// Loading configurations from .env
dotenv.config();

@Injectable()
export class ConfigServiceImpl implements ConfigService {
  get(key: string): string | undefined {
    return process.env[key];
  }

  getNumber(key: string): number | undefined {
    const value = this.get(key);
    return value ? Number.parseInt(value, 10) : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const value = this.get(key);
    return value ? value.toLowerCase() === "true" : undefined;
  }
}
