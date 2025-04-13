import type { PrimitiveType } from "@enum/ValidationEnums";

export interface ValidationOptions {
  strict?: boolean;
  nullable?: boolean;
  path?: string;
}

export interface ValidationError {
  path: string;
  expected: string;
  received: unknown;
  message: string;
}

export type CustomValidator = (
  value: unknown,
  options?: ValidationOptions,
) => boolean;
export type ComplexCheck<T extends object> =
  | ArrayTypeCheck<T>
  | ObjectTypeCheck<T>;

export type TypeCheck<T extends object = object> =
  | PrimitiveType
  | CustomValidator
  | ComplexCheck<T>
  | {
    type: string;
    elementCheck?: PrimitiveType;
  };

export interface ArrayTypeCheck<T> extends ValidationOptions {
  type: "array";
  array: TypeCheck<T>;
  elementCheck: TypeCheck<T>;
}

export interface ObjectTypeCheck<T extends object> extends ValidationOptions {
  type: "object";
  object: TypeCheck;
  checks: Record<string, TypeCheck<T>>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface CacheEntry {
  result: ValidationResult;
  timestamp: number;
}
