declare module "@emilia-tan/core" {
  declare class BotCore {
    start(): void;
  }

  declare interface ConfigService {
    /**
     * To retrieve a configuration value
     * @param key Configuration key
     */
    get(key: string): string | undefined;
    /**
     * To retrieve a number from the configuration
     * @param key Configuration key
     */
    getNumber(key: string): number | undefined;
    /**
     * To retrieve a boolean value
     * @param key Configuration key
     */
    getBoolean(key: string): boolean | undefined;
  }
}