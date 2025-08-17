/**
 * 🔹 DIP COMPLIANCE: Modern Dependency Injection Container
 * This file now exports the proper Inversify container
 * Replaced manual singleton pattern with proper DI framework
 */

export { container as DIContainer } from "./inversify.config";
export { TYPES } from "./types";

// Re-export for backward compatibility during migration
export default class LegacyDIContainer {
  /**
   * @deprecated Use the new Inversify container instead
   * This class is kept for backward compatibility during migration
   */
  static getDeprecationWarning() {
    console.warn(
      "⚠️  LegacyDIContainer is deprecated. Use the new Inversify container instead."
    );
  }
}
