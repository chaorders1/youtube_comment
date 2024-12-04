/**
 * Simple logger for development
 */
export class Logger {
  constructor(module) {
    this.module = module;
  }

  info(message) {
    console.log(`[${this.module}] ${message}`);
  }

  error(message, error) {
    console.error(`[${this.module}] Error: ${message}`, error);
  }
}
