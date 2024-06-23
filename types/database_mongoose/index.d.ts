import { DeleteResult } from "mongodb";
import { Document, Model, QueryOptions, UpdateQuery, UpdateWriteOpResult, FilterQuery } from "mongoose";
import { ModelsName, ModelsTable } from "../../srcTs/database_mongoose/shemas";

export type ModelType<T extends ModelsName> = Model<ModelsTable[T]>;
export type UpdateOptionType<T extends ModelsName> = UpdateQuery<ModelsTable[T]>;
export type UpdateType<T extends ModelsName> = QueryOptions<ModelsTable[T]>;
export type FilterType<T extends ModelsName> = FilterQuery<Partial<ModelsTable[T]>>;
export type CreateType<T extends ModelsName> = Document<unknown, object, ModelsTable[T]>;
export type ErrorResultTypes = { error: null | string };
export type FindResult<T extends ModelsName> = ErrorResultTypes & { res: ModelsTable[T] | null };
export type FindArrayResult<T extends ModelsName> = ErrorResultTypes & { res: ModelsTable[T][] | [] };
export type CreateResult<T extends ModelsName> = ErrorResultTypes & { res: CreateType<T> | null };
export type DeletedResult = ErrorResultTypes & { res: DeleteResult | null };
export type UpdateResult = ErrorResultTypes & { res: UpdateWriteOpResult | null };
export type findOneAndUpdateOrCreateResult<T extends ModelsName> = ErrorResultTypes & { res: CreateType<T> | ModelsTable[T] | null; created: boolean | null };

export interface IDatabase {
  findOne: <T extends ModelsName>(filter: FilterType<T>, tableName: T) => Promise<{ error: null | string; res: ModelsTable[T] | null }>;
  find: <T extends ModelsName>(filter: FilterType<T>, tableName: T) => Promise<{ error: null | string; res: ModelsTable[T][] | [] }>;
  create: <T extends ModelsName>(document: ModelsTable[T], tableName: T) => Promise<{ error: null | string; res: Document<unknown, object, ModelsTable[T]> | null }>;
  deleteOne: <T extends ModelsName>(filter: FilterType<T>, tableName: T) => Promise<{ error: null | string; res: DeleteResult | null }>;
  deleteMany: <T extends ModelsName>(filter: FilterType<T>, tableName: T) => Promise<{ error: null | string; res: DeleteResult | null }>;
  findOneOrCreate: <T extends ModelsName>(filter: FilterType<T>, document: ModelsTable[T], tableName: T) => Promise<{ error: null | string; res: ModelsTable[T] | Document<unknown, object, ModelsTable[T]> | null; created: boolean | null }>;
  findOneAndUpdateOrCreate<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, document: ModelsTable[T], TableName: T, updOptions?: UpdateOptionType<T>): Promise<{ error: null | string; res: ModelsTable[T] | Document<unknown, object, ModelsTable[T]> | null; created: boolean | null }>;
  updateOne: <T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateOptionType<T>) => Promise<{ error: null | string; res: UpdateWriteOpResult | null }>;
  updateMany: <T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateOptionType<T>) => Promise<{ error: null | string; res: UpdateWriteOpResult | null }>;
  findOneAndUpdate: <T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateType<T>) => Promise<{ error: null | string; res: ModelsTable[T] | null }>;
}