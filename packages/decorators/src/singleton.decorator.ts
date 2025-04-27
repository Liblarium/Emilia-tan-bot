import { container } from 'tsyringe';

export function Singleton() {
  return (target: any) => {
    container.registerSingleton(target);
  };
}
