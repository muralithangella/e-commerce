import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);


vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady:        [false, vi.fn()],
    needRefresh:         [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));
