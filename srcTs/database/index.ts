import type { EntityTarget, FindManyOptions, FindOptionsWhere, Repository, SaveOptions, UpdateResult } from "typeorm";
import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { сonnectionInfo } from "../client";
import { type SchemaNames, type SchemaTable, schemasMap } from "./schemas";


export const missModelError = "Вы уверены, что эта таблица (модель) существует? Проверьте имя таблицы(модели) снова";
export const createOrUpdateError = "Прозиошла ошибка при создании/обновлении записи. Загляни в терминал/консоль.";
export const findError = "По указанным данным - ничего не было найдено";

type Repositories = { [key in SchemaNames]: Repository<SchemaTable[key]> };

/** Класс для работы с базой данный через typeorm */
export class Database {
  private readonly model: { [key in SchemaNames]: EntityTarget<SchemaTable[key]> } = schemasMap;

  /**
   * Приватный метод для получения нужной нам схемы
   * @param name
   * @returns
   */
  private action<T extends SchemaNames>(name: T): Repositories[T] | undefined {
    return name in this.model ? (сonnectionInfo.getRepository(this.model[name]) as unknown as Repositories[T]) : undefined;
  }

  /**
   * Метод для вывода всех данных указанной схемы (таблицы)
   * @param name имя схемы
   * @param [options] дополнительные настройки для поиска.
   * @returns
   */
  async find<T extends SchemaNames>(name: T, options?: FindManyOptions<SchemaTable[T]>): Promise<{ res: SchemaTable[T][] | []; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: [], error: missModelError };

    return { res: await model.find(options), error: null };
  }

  /**
   * Метод для получения данных по указанному фильтру
   * @param name имя схемы
   * @param filter фильтр для поиска указанных данных
   * @returns
   */
  async findBy<T extends SchemaNames>(name: T, filter: FindOptionsWhere<SchemaTable[T]> | FindOptionsWhere<SchemaTable[T]>[]): Promise<{ res: SchemaTable[T][] | []; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: [], error: missModelError };

    return { res: await model.findBy(filter), error: null };
  }

  /**
   * Метод для получения данных (1) по указаному фильтру
   * @param name имя схемы
   * @param filter фильтр для поиска указанных данных
   * @returns
   */
  async findOneBy<T extends SchemaNames>(name: T, filter: FindOptionsWhere<SchemaTable[T]> | FindOptionsWhere<SchemaTable[T]>[]): Promise<{ res: SchemaTable[T] | null; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: null, error: missModelError };

    const res = await model.findOneBy(filter);

    return res == null ? { res: null, error: findError } : { res, error: null };
  }

  /**
   * Метод для вывода данных в указанной схеме (таблице)
   *
   * Выводит данные по указанному запросу и количество полученных данных
   *
   * Ах да. `count: -1` будет в том случае, если вы указали несуществующую схему в названии или забыли её добавить к остальным в тип и массив (не тут)
   * @param name имя схемы
   * @param [options] дополнительные 2 аргумента для поиска `skip` и `take`
   * @returns
   */
  async findAndCount<T extends SchemaNames>(name: T, options?: FindManyOptions<SchemaTable[T]>): Promise<{ res: SchemaTable[T][] | []; count: number; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: [], count: -1, error: missModelError };

    const [res, count] = await model.findAndCount(options);

    return { res, count, error: null };
  }

  /**
   * Метод для поиска данных по указанному фильтру (столбику или столбикам)
   *
   * Выводит данные по указанному запросу и количество полученных данных
   *
   * Ах да. `count: -1` будет в том случае, если вы указали несуществующую схему в названии или забыли её добавить к остальным в тип и массив (не тут)
   * @param name имя схемы
   * @param filter фильтр для поиска
   * @returns
   */
  async findAndCountBy<T extends SchemaNames>(name: T, filter: FindOptionsWhere<SchemaTable[T]> | FindOptionsWhere<SchemaTable[T]>[]): Promise<{ res: SchemaTable[T][] | []; count: number; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: [], count: -1, error: missModelError };

    const [res, count] = await model.findAndCountBy(filter);

    return { res, count, error: null };
  }

  /**
   * Метод для "сырого" **SQL** запроса к БД типа **SQL**.
   *
   * **NoSQL** (`mongodb` или другие) не будут работать с этим методом!
   * @param name имя схемы
   * @param query SQL запрос
   * @param [parameters] дополнительные парамерты для SQL запроса (в массиве)
   * @returns
   */
  async query<T extends SchemaNames>(name: T, query: string, parameters?: unknown[]): Promise<{ res: object | null; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: null, error: missModelError };

    const res: unknown = await model.query(query, parameters).catch((e: unknown) => {
      console.error(e);

      return { res: null, error: (e as Error).message };
    });

    return ((res as { error: string | null }).error != null ? res : { res, error: null }) as { res: object | null; error: string | null };
  }

  /**
   * Метод для создания записи в Базе Данных. Используется create() и save()
   * @param name имя схемы
   * @param document объект с данными для создания таблицы
   * @param [saveOptions] дополнительные опции для save
   * @returns
   */
  async create<T extends SchemaNames>(name: T, document: SchemaTable[T], saveOptions?: SaveOptions): Promise<{ res: SchemaTable[T] | null; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: null, error: missModelError };

    try {
      const create = model.create(document);
      return { res: await model.save(create, saveOptions), error: null };
    } catch (e) {
      console.error(e);
      return { res: null, error: createOrUpdateError };
    }
  }

  /** 
   * Метод для нахождения записи или создание оной в случае отсуствия 
   * @param options параметры
   * @param options.name имя схемы
   * @param options.filter что ищем
   * @param options.document данные для создания, Если нет такой записи
   * @param [options.saveOptions] дополнительные опции для сохранения
   * @returns
   */
  async findOneOrCreate<T extends SchemaNames>({ name, filter, document, saveOptions }: { name: T; filter: FindOptionsWhere<SchemaTable[T]> | FindOptionsWhere<SchemaTable[T]>[]; document: SchemaTable[T]; saveOptions?: SaveOptions }): Promise<{ res: SchemaTable[T] | null; created: boolean | null; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: null, created: null, error: missModelError };

    const find = await this.findOneBy(name, filter);

    return find.error != null ? { created: true, ...(await this.create(name, document, saveOptions)) } : { created: false, ...find };
  }

  /**
   * Метод для обновления данных. Тут используется метод update(), а не save()
   * @param name имя схемы
   * @param filter какие данные нужно обновить
   * @param update данные на изменения
   * @returns
   */
  async update<T extends SchemaNames>(name: T, filter: FindOptionsWhere<SchemaTable[T]>, update: QueryDeepPartialEntity<SchemaTable[T]>): Promise<{ res: UpdateResult | null; error: null | string }> {
    const model = this.action(name);

    if (!model) return { res: null, error: missModelError };

    const upd = await model.update(filter, update).catch((e: unknown) => {
      console.error(e);
      return { res: null, error: (e as Error).message };
    });

    return "error" in upd ? upd : { res: upd, error: null };
  }

  /** 
   * Метод для обновления одной записи или создание оной в случае отсуствия 
   * @param options параметры
   * @param options.name имя таблицы
   * @param options.filter поиск по указаным данным
   * @param options.document данные для создания, если нет указанных данных
   * @param options.update то, что нужно обновить, если оно есть
   * @param [options.saveOptions] параметры для сохранения, если нет записи
   * @returns
   */
  async findOneAndUpdateOrCreate<T extends SchemaNames>({ name, filter, document, update, saveOptions }: { name: T; filter: FindOptionsWhere<SchemaTable[T]>; document: SchemaTable[T]; update: QueryDeepPartialEntity<SchemaTable[T]>; saveOptions?: SaveOptions }): Promise<{ res: SchemaTable[T] | UpdateResult | null; created: boolean | null; error: null | string }> {
    const model = this.action(name);

    if (!model) return { error: missModelError, res: null, created: null };
    if (!document) return { error: "Вы не указали данные для создания таблицы, если её нет!", res: null, created: null };

    const find = await this.findOneBy(name, filter);

    return find.error != null ? { created: true, ...(await this.create(name, document, saveOptions)) } : { created: false, ...(await this.update(name, filter, update)) };
  }

  /**
   * Реализация getRepository от Typeorm, дабы делать изменения напрямую (например - создать билдер для SQL запроса).
   *
   * Разница от основного - в том, что тут нужно ввести только имя схемы, а не кидать саму схему в аргументы
   * @param name Имя схемы. С малой буквы
   * @returns
   */
  getRepository<T extends SchemaNames>(name: T): { res: Repositories[T] | null; error: null | string } {
    const model = this.action(name);

    return model === undefined ? { res: null, error: missModelError } : { res: model, error: null };
  }
}
