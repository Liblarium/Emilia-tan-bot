import { inject } from 'tsyringe';

export function Inject(service: any) {
  return (target: any, propertyKey?: string | symbol, parameterIndex = 0) => {
    inject(service)(target, propertyKey, parameterIndex);
  };
}