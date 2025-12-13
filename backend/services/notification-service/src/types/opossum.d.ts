declare module 'opossum' {
  interface CircuitBreakerOptions {
    timeout?: number;
    errorThresholdPercentage?: number;
    resetTimeout?: number;
    rollingCountTimeout?: number;
    rollingCountBuckets?: number;
  }

  class CircuitBreaker<T> {
    constructor(action: () => Promise<T>, options?: CircuitBreakerOptions);
    fire(...args: any[]): Promise<T>;
    fallback(fallback: () => T | Promise<T>): void;
    on(event: 'open' | 'halfOpen' | 'close', handler: () => void): void;
  }

  export = CircuitBreaker;
}

