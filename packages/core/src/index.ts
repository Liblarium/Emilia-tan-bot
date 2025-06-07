import "reflect-metadata";
import "dotenv/config";
import { Container } from "inversify";

export const container = new Container();
export * from "./decorators/barrel";
