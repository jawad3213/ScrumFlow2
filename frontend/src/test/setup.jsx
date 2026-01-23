import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock IntersectionObserver
class IntersectionObserver {
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
}

window.IntersectionObserver = IntersectionObserver;

// Mock Lottie/dotlottie-web and dotlottie-react
vi.mock('@lottiefiles/dotlottie-web', () => ({
    DotLottie: class {
        constructor() { }
        load() { }
        play() { }
        pause() { }
        stop() { }
        destroy() { }
        addEventListener() { }
        removeEventListener() { }
    }
}));

vi.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: () => <div data-testid="lottie-animation" />
}));
