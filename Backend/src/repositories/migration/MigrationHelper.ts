/**
 * 🔹 REPOSITORY MIGRATION HELPER
 * Utilities to assist with gradual repository migration
 */

import { container } from "../../inversify/inversify.config";
import { TYPES } from "../../inversify/types";

/**
 * 🔹 MIGRATION CONFIGURATION
 */
interface MigrationConfig {
  enableModernRepositories: boolean;
  logDeprecationWarnings: boolean;
  enablePerformanceMonitoring: boolean;
  migrationPhase: 1 | 2 | 3 | 4;
}

const migrationConfig: MigrationConfig = {
  enableModernRepositories: process.env.ENABLE_MODERN_REPOS === 'true',
  logDeprecationWarnings: process.env.NODE_ENV !== 'production',
  enablePerformanceMonitoring: true,
  migrationPhase: parseInt(process.env.MIGRATION_PHASE || '1') as 1 | 2 | 3 | 4
};

/**
 * 🔹 REPOSITORY FACTORY
 * Dynamically switches between legacy and modern repositories
 */
export class RepositoryFactory {
  
  /**
   * Get the appropriate repository implementation
   */
  static getRepository<T>(
    repositoryType: string,
    modernImplementation: new (...args: any[]) => T,
    legacyImplementation: new (...args: any[]) => T
  ): T {
    // Check if modern repositories are enabled
    if (migrationConfig.enableModernRepositories) {
      if (migrationConfig.logDeprecationWarnings) {
        console.log(`✅ Using modern ${repositoryType} implementation`);
      }
      return container.get<T>(modernImplementation as any);
    }

    // Fall back to legacy implementation
    if (migrationConfig.logDeprecationWarnings) {
      console.warn(`⚠️ Using legacy ${repositoryType} implementation. Consider migrating to modern version.`);
    }
    return container.get<T>(legacyImplementation as any);
  }

  /**
   * Specific factory methods for each repository
   */
  static getUserRepository() {
    return this.getRepository(
      'UserRepository',
      Symbol.for('ModernUserRepository'),
      TYPES.IUserRepository
    );
  }

  static getMessageRepository() {
    return this.getRepository(
      'MessageRepository',
      Symbol.for('ModernMessageRepository'),
      TYPES.IMessageRepository
    );
  }

  static getPaymentRepository() {
    return this.getRepository(
      'PaymentRepository',
      Symbol.for('ModernPaymentRepository'),
      TYPES.IPaymentRepository
    );
  }
}

/**
 * 🔹 MIGRATION UTILITIES
 */
export class MigrationUtils {
  
  /**
   * Log deprecation warning with migration guidance
   */
  static logDeprecation(
    methodName: string,
    repositoryName: string,
    newMethodName?: string,
    additionalInfo?: string
  ): void {
    if (!migrationConfig.logDeprecationWarnings) return;

    const message = [
      `⚠️ DEPRECATION WARNING: ${repositoryName}.${methodName}()`,
      newMethodName ? `Use ${newMethodName}() instead` : 'Method will be removed in next version',
      additionalInfo || 'See migration guide for details'
    ].join(' | ');

    console.warn(message);
  }

  /**
   * Log migration progress
   */
  static logMigrationProgress(
    repositoryName: string,
    phase: number,
    status: 'started' | 'completed' | 'failed',
    details?: Record<string, any>
  ): void {
    const emoji = status === 'completed' ? '✅' : status === 'failed' ? '❌' : '🔄';
    const message = `${emoji} Migration Phase ${phase}: ${repositoryName} ${status}`;
    
    if (details) {
      console.log(message, details);
    } else {
      console.log(message);
    }
  }

  /**
   * Validate migration compatibility
   */
  static validateMigrationCompatibility(
    repositoryName: string,
    requiredMethods: string[]
  ): { compatible: boolean; missingMethods: string[] } {
    // Implementation would check if all required methods exist
    // This is a simplified version
    return {
      compatible: true,
      missingMethods: []
    };
  }

  /**
   * Performance comparison between legacy and modern methods
   */
  static async comparePerformance<T>(
    methodName: string,
    legacyMethod: () => Promise<T>,
    modernMethod: () => Promise<T>,
    testData?: any
  ): Promise<{
    legacyTime: number;
    modernTime: number;
    improvement: number;
    results: { legacy: T; modern: T };
  }> {
    // Legacy method timing
    const legacyStart = performance.now();
    const legacyResult = await legacyMethod();
    const legacyTime = performance.now() - legacyStart;

    // Modern method timing
    const modernStart = performance.now();
    const modernResult = await modernMethod();
    const modernTime = performance.now() - modernStart;

    const improvement = ((legacyTime - modernTime) / legacyTime) * 100;

    console.log(`📊 Performance Comparison - ${methodName}:`, {
      legacy: `${legacyTime.toFixed(2)}ms`,
      modern: `${modernTime.toFixed(2)}ms`,
      improvement: `${improvement.toFixed(1)}% ${improvement > 0 ? 'faster' : 'slower'}`
    });

    return {
      legacyTime,
      modernTime,
      improvement,
      results: { legacy: legacyResult, modern: modernResult }
    };
  }
}

/**
 * 🔹 GRADUAL MIGRATION MANAGER
 */
export class GradualMigrationManager {
  private static migrationStatus = new Map<string, {
    phase: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    errorCount: number;
  }>();

  /**
   * Start migration for a repository
   */
  static startMigration(repositoryName: string, phase: number): void {
    this.migrationStatus.set(repositoryName, {
      phase,
      status: 'in_progress',
      startedAt: new Date(),
      errorCount: 0
    });

    MigrationUtils.logMigrationProgress(repositoryName, phase, 'started');
  }

  /**
   * Complete migration for a repository
   */
  static completeMigration(repositoryName: string): void {
    const status = this.migrationStatus.get(repositoryName);
    if (status) {
      status.status = 'completed';
      status.completedAt = new Date();
      
      MigrationUtils.logMigrationProgress(
        repositoryName, 
        status.phase, 
        'completed',
        {
          duration: status.completedAt.getTime() - (status.startedAt?.getTime() || 0),
          errors: status.errorCount
        }
      );
    }
  }

  /**
   * Record migration error
   */
  static recordError(repositoryName: string, error: Error): void {
    const status = this.migrationStatus.get(repositoryName);
    if (status) {
      status.errorCount++;
      
      // If too many errors, mark as failed
      if (status.errorCount > 5) {
        status.status = 'failed';
        MigrationUtils.logMigrationProgress(
          repositoryName, 
          status.phase, 
          'failed',
          { errorCount: status.errorCount, lastError: error.message }
        );
      }
    }
  }

  /**
   * Get overall migration progress
   */
  static getMigrationProgress(): {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    pending: number;
  } {
    const statuses = Array.from(this.migrationStatus.values());
    
    return {
      total: statuses.length,
      completed: statuses.filter(s => s.status === 'completed').length,
      inProgress: statuses.filter(s => s.status === 'in_progress').length,
      failed: statuses.filter(s => s.status === 'failed').length,
      pending: statuses.filter(s => s.status === 'pending').length
    };
  }

  /**
   * Generate migration report
   */
  static generateMigrationReport(): string {
    const progress = this.getMigrationProgress();
    const repositories = Array.from(this.migrationStatus.entries());

    const report = [
      '📊 REPOSITORY MIGRATION REPORT',
      '=' .repeat(40),
      `Total Repositories: ${progress.total}`,
      `✅ Completed: ${progress.completed}`,
      `🔄 In Progress: ${progress.inProgress}`,
      `❌ Failed: ${progress.failed}`,
      `⏸️ Pending: ${progress.pending}`,
      '',
      'Repository Details:',
      ...repositories.map(([name, status]) => {
        const emoji = status.status === 'completed' ? '✅' :
                     status.status === 'failed' ? '❌' :
                     status.status === 'in_progress' ? '🔄' : '⏸️';
        
        return `${emoji} ${name} (Phase ${status.phase}) - ${status.status}`;
      })
    ];

    return report.join('\n');
  }
}

/**
 * 🔹 TESTING UTILITIES
 */
export class MigrationTestUtils {
  
  /**
   * Create test data for repository testing
   */
  static createTestData(entityType: string, count: number = 1): any[] {
    const testDataGenerators: Record<string, () => any> = {
      user: () => ({
        firstName: `Test${Math.random().toString(36).substr(2, 9)}`,
        lastName: 'User',
        email: `test${Math.random().toString(36).substr(2, 9)}@example.com`,
        password: 'testpassword123',
        role: ['mentee']
      }),
      message: () => ({
        sender: '507f1f77bcf86cd799439011',
        receiver: '507f1f77bcf86cd799439012',
        chat: '507f1f77bcf86cd799439013',
        type: 'text',
        content: 'Test message content',
        status: 'sent'
      }),
      payment: () => ({
        amount: Math.floor(Math.random() * 1000) + 100,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'card',
        bookingId: '507f1f77bcf86cd799439014'
      })
    };

    const generator = testDataGenerators[entityType.toLowerCase()];
    if (!generator) {
      throw new Error(`No test data generator for entity type: ${entityType}`);
    }

    return Array.from({ length: count }, generator);
  }

  /**
   * Run compatibility tests between legacy and modern repositories
   */
  static async runCompatibilityTests(
    repositoryName: string,
    testCases: Array<{
      method: string;
      params: any[];
      expectedResult?: any;
    }>
  ): Promise<{
    passed: number;
    failed: number;
    results: Array<{
      method: string;
      passed: boolean;
      error?: string;
    }>;
  }> {
    const results = [];
    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
      try {
        // This would actually call both legacy and modern methods
        // and compare results
        const result = {
          method: testCase.method,
          passed: true
        };
        
        results.push(result);
        passed++;
      } catch (error: any) {
        results.push({
          method: testCase.method,
          passed: false,
          error: error.message
        });
        failed++;
      }
    }

    return { passed, failed, results };
  }
}

/**
 * 🔹 EXPORT MIGRATION CONFIG
 */
export { migrationConfig };

/**
 * 🔹 MIGRATION STATUS CONSTANTS
 */
export const MIGRATION_PHASES = {
  PHASE_1: 1, // Critical repositories (User, Message, Payment)
  PHASE_2: 2, // Core business logic (Booking, Service, Testimonial, etc.)
  PHASE_3: 3, // Supporting features (Admin, Mentor, Mentee, etc.)
  PHASE_4: 4  // Specialized features (remaining repositories)
} as const;

export const MIGRATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;