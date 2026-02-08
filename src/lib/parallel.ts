import Parallel from 'parallel-web';

let client: Parallel | null = null;

export function getParallelClient() {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) return null;

  if (!client) {
    client = new Parallel({
      apiKey,
      timeout: 12_000,
      maxRetries: 1
    });
  }

  return client;
}

export function getParallelProcessor() {
  return process.env.PARALLEL_PROCESSOR ?? 'base';
}
