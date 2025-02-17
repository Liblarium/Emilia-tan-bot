import { PrismaClient } from "@prisma/client";
import { emiliaError, Transforms, Decorators } from "@utils";

/**
 * Abstract base class for all repositories.
 * 
 * A repository is a layer of abstraction between the application logic and the database.
 * It provides a common interface for accessing and manipulating data in the database.
 * 
 * @abstract
 * @example
 * ```ts
 * class SomeRepository extends AbstractRepository<SomeModel> {
 *  constructor() {
 *    super(db, "someModel");
 *  };
 * }
 * 
 * const someModel = new SomeModel();
 * console.log(someModel.findById("123")); // -> { id: 123 }; // and other properties
 * ```
 */
export class AbstractRepository<T> {
  protected db: PrismaClient;
  protected model: keyof PrismaClient;

  /**
   * @param db - The Prisma Client instance to use for the database operations.
   * @param model - The name of the model to use for the database operations.
   * @example
   * ```ts
   * import { Abstract } from "@constants";
   * import { User } from "@prisma/client";
   * 
   * class UserRepository extends Abstract.AbstractRepository<User> {
   *  constructor() {
   *   super(db, "user");
   *  };
   * }
   * 
   * const userRepository = new UserRepository(db, "User");
   * ```
   */
  constructor(db: PrismaClient, model: keyof PrismaClient) {
    this.db = db;
    this.model = model;
  }

  /**
   * Gets the Prisma Client model instance associated with this repository.
   * @returns The Prisma Client model instance associated with this repository.
   * @example
   * 
   */
  private getModel(): any {
    return this.db[this.model];
  }

  /**
   * Creates a new record in the database.
   * @param data - The data to create a new record with.
   * @returns The created record.
   * @example
   * ```ts
   * userRepository.create({ id: BigInt(123) });
   * ```
   */
  @Decorators.logCaller()
  public async create(data: Partial<T>): Promise<T> {
    return await this.getModel().create({ data }) as T;
  }

  /**
   * Finds a record in the database by its ID.
   * @param id - The ID of the record to find.
   * @returns The found record, or null if not found.
   * @example
   * ```ts
   * userRepository.findById("123");
   * ```
   */
  @Decorators.logCaller()
  public async findById(id: string): Promise<T | null> {
    if (!id) return null;

    return await this.getModel().findUnique({
      where: { id: Transforms.stringToBigInt(id) }
    }) as T;
  }


  /**
   * Finds multiple records in the database by their IDs.
   * @param ids - An array of IDs of the records to find.
   * @returns An array of found records. Returns an empty array if no records are found or if the input array is empty.
   * @example
   * ```ts
   * userRepository.findManyByIds(["123", "456", "789"]);
   * ```
   */
  @Decorators.logCaller()
  public async findManyByIds(ids: string[]): Promise<T[]> {
    if (!ids || ids.length === 0) return [];

    return await this.getModel().findMany({ where: { id: { in: ids.map((id) => Transforms.stringToBigInt(id)) } } }) as T[];
  }

  /**
   * Updates a record in the database.
   * @param id - The ID of the record to update.
   * @param data - The new data to update the record with.
   * @returns The updated record, or null if not found.
   * @example
   * ```ts
   * userRepository.update("123", { name: "John", age: "13" }); // -> { id: "123", name: "John", age: "13" }
   * ```
   */
  @Decorators.logCaller()
  public async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!data || Object.keys(data).length === 0) throw emiliaError("Where is the new data to update?");

    return await this.getModel().update({
      where: { id: Transforms.stringToBigInt(id) },
      data
    }) as T;
  }

  /**
   * Deletes a record from the database.
   * @param id - The ID of the record to delete.
   * @example
   * ```ts
   * userRepository.delete("123");
   * ```
   */
  @Decorators.logCaller()
  public async delete(id: string): Promise<void> {
    await this.getModel().delete({
      where: { id: Transforms.stringToBigInt(id) }
    });
  }
}