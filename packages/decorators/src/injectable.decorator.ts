import { container } from 'tsyringe';

/**
 * Marks a class as injectable and registers it in the DI container.
 */
export function Injectable(): ClassDecorator {
  return (target) => {
    container.register(target as any, { useClass: target as any });
  };
}

