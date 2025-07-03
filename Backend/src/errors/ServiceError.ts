// src/utils/errors/ServiceError.ts
export class ServiceError extends Error {
  constructor(message: string, public readonly code: string = "SERVICE_ERROR") {
    super(message);
    this.name = "ServiceError";
  }
}
