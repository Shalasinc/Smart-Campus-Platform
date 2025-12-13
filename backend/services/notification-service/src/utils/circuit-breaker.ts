import CircuitBreaker from 'opossum';
import axios from 'axios';

const options = {
  timeout: 3000, // 3 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000, // 30 seconds
  rollingCountTimeout: 10000,
  rollingCountBuckets: 10,
};

// Create circuit breaker for HTTP requests
export const createCircuitBreaker = (url: string) => {
  const breaker = new CircuitBreaker(async () => {
    const response = await axios.get(url, {
      timeout: 3000,
    });
    
    return response.data;
  }, options);

  breaker.on('open', () => {
    console.log(`🔴 Circuit breaker opened for ${url}`);
  });

  breaker.on('halfOpen', () => {
    console.log(`🟡 Circuit breaker half-open for ${url}`);
  });

  breaker.on('close', () => {
    console.log(`🟢 Circuit breaker closed for ${url}`);
  });

  breaker.fallback(() => {
    console.log(`⚠️ Circuit breaker fallback for ${url}`);
    return { error: 'Service temporarily unavailable', fallback: true };
  });

  return breaker;
};

