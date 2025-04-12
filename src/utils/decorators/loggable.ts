// import { Log } from "@log";
// import type { LogOptions } from "@type/log";

export function Loggable<T extends new (...args: any[]) => {}>(options: { logger: any }) {
  return (constructor: T) => class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      options.logger.log(`Создан экземпляр класса ${constructor.name}`);
    }
  };
}









//






























































//




























//

// import { LogType } from "@constants/enum/log";
// import type { Log } from "@log";
// import { ConsoleLogger } from "@log/ConsoleLogger";
// import { FileLogger } from "@log/FileLogger";
// import { LogFormatter } from "@utils/formatters/LogFormatter";
// import { JSONWriter } from "@utils/json/JSONWriter";

// /**
//  * Декоратор для автоматического логирования методов класса.
//  *
//  * @param LogClass - Класс логирования (например, Log).
//  * @param logArgs - Аргументы для конструктора класса логирования.
//  * @returns Декоратор класса.
//  */
// export function Loggable(
//   LogClass: typeof Log,
//   logArgs: ConstructorParameters<typeof Log>,
// ) {
//   return <T extends { new(...args: any[]): {} }>(constructor: T): T =>
//     class extends constructor {
//       private readonly logger = new LogClass(...logArgs);
//       private readonly consoleLogger = new ConsoleLogger(LogFormatter);
//       private readonly fileLogger = new FileLogger(
//         "logs/app.log",
//         new JSONWriter(),
//         new LogFormatter(),
//         new LogFormatter(),
//       );

//       constructor(...args: any[]) {
//         super(...args);

//         // Перебираем все методы класса
//         Object.getOwnPropertyNames(constructor.prototype).forEach(
//           (methodName) => {
//             const originalMethod = this[methodName];

//             if (
//               typeof originalMethod === "function" &&
//               methodName !== "constructor"
//             ) {
//               this[methodName] = async (...methodArgs: any[]) => {
//                 try {
//                   // Логируем вызов метода
//                   await this.logger.logProcessing({
//                     text: `Вызов метода ${methodName} с аргументами: ${JSON.stringify(methodArgs)}`,
//                     type: LogType.Info,
//                     categories: ["method_call"],
//                     consoleLogger: this.consoleLogger,
//                     fileLogger: this.fileLogger,
//                     logFormatter: this.
//                   });

//                   // Вызываем оригинальный метод
//                   const result = await originalMethod.apply(this, methodArgs);

//                   // Логируем успешное выполнение
//                   await this.logger.logProcessing({
//                     text: `Метод ${methodName} выполнен успешно. Результат: ${JSON.stringify(result)}`,
//                     type: LogType.Info,
//                     categories: ["method_success"],
//                     consoleLogger: this.consoleLogger,
//                     fileLogger: this.fileLogger,
//                   });

//                   return result;
//                 } catch (error) {
//                   // Логируем ошибку
//                   await this.logger.logProcessing({
//                     text: `Ошибка в методе ${methodName}: ${error instanceof Error ? error.message : String(error)}`,
//                     type: LogType.Error,
//                     categories: ["method_error"],
//                     consoleLogger: this.consoleLogger,
//                     fileLogger: this.fileLogger,
//                   });

//                   throw error;
//                 }
//               };
//             }
//           },
//         );
//       }
//     };
// }
