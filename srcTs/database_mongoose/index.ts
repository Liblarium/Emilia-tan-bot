import { DeleteResult } from "mongodb";
import { Document, UpdateWriteOpResult } from "mongoose";
import { modelsMap, ModelsName, ModelsTable } from "./shemas";
import { FilterType, IDatabase, ModelType, UpdateType, UpdateOptionType } from "../../types/database_mongoose";

export const missModelError = `Вы уверены, что эта таблица (модель) существует? Проверьте имя таблицы(модели) снова`;
export const createOrUpdateError = `Прозиошла ошибка при создании/обновлении записи. Загляни в терминал/консоль.`;
export const findError = `По указанным данным - ничего не было найдено`;

export class Database implements IDatabase {
  private readonly model = modelsMap;

  private action<T extends ModelsName>(name: T): ModelType<T> | undefined {
    return name in this.model ? (this.model[name] as unknown as ModelType<T>) : undefined;
  }

  async findOne<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: ModelsTable[T] | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    const find = await model.findOne(filter);

    return find == null ? { error: findError, res: null } : { error: null, res: find };
  }

  async find<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: ModelsTable[T][] | [] }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: [] };

    return { error: null, res: await model.find(filter) };
  }

  async create<T extends ModelsName>(document: ModelsTable[T], tableName: T): Promise<{ error: null | string; res: Document<unknown, object, ModelsTable[T]> | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    try {
      const created: Document<unknown, object, ModelsTable[T]> = new model(document);
      created.save();
      return { error: null, res: created };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }

  async deleteOne<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: DeleteResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    return { error: null, res: await model.deleteOne(filter) };
  }

  async deleteMany<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: DeleteResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    return { error: null, res: await model.deleteMany(filter) };
  }

  async findOneOrCreate<T extends ModelsName>(filter: FilterType<T>, document: ModelsTable[T], tableName: T): Promise<{ error: null | string; res: ModelsTable[T] | Document<unknown, object, ModelsTable[T]> | null; created: boolean | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null, created: null };

    const find = await this.findOne(filter, tableName);

    return find.error != null ? { created: true, ...(await this.create(document, tableName)) } : { created: false, ...find };
  }

  async  findOneAndUpdateOrCreate<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, document: ModelsTable[T], tableName: T, updOptions?: UpdateOptionType<T>): Promise<{ error: null | string; res: ModelsTable[T] | Document<unknown, object, ModelsTable[T]> | null; created: boolean | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null, created: null };
    if (!document) return { error: `Вы не указали данные для создания таблицы, если её нет!`, res: null, created: null };

    const find = await this.findOne(filter, tableName);

    
    return find.error != null ? { created: true, ...(await this.create(document, tableName)) } : { created: false, ...(await this.findOneAndUpdate(filter, update, tableName, updOptions)) };
  }

  async updateOne<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateOptionType<T>): Promise<{ error: null | string; res: UpdateWriteOpResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    try {
      const updated = await model.updateOne(filter, update, options);

      return { error: null, res: updated };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }

  async updateMany<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateOptionType<T>): Promise<{ error: null | string; res: UpdateWriteOpResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: createOrUpdateError, res: null };

    try {
      const updated = await model.updateMany(filter, update, options);

      return { error: null, res: updated };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }

  async findOneAndUpdate<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateType<T>): Promise<{ error: null | string; res: ModelsTable[T] | null }> {
    const model = this.action(tableName);

    if (!model) return { error: createOrUpdateError, res: null };

    try {
      const updated = await model.findOneAndUpdate(filter, update, options);

      return { error: null, res: updated };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }
}
