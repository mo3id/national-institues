/**
 * Vitest setup file – configures jest-dom matchers globally.
 *
 * Add to vite.config.ts:
 *   test: {
 *     environment: 'jsdom',
 *     globals: true,
 *     setupFiles: ['./tests/unit/setup.ts'],
 *   }
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Stub window.matchMedia (not implemented in jsdom)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Stub IntersectionObserver (used by ScrollReveal / framer-motion)
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

// Stub ResizeObserver
const mockResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
window.ResizeObserver = mockResizeObserver;
