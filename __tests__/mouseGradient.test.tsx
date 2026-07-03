import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import MouseGradient from '@/components/MouseGradient';

describe('MouseGradient', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
  });

  it('starts hidden before the first pointer movement', () => {
    const { container } = render(<MouseGradient />);
    const gradient = container.firstElementChild as HTMLDivElement;

    expect(gradient.style.opacity).toBe('0');
  });

  it('becomes visible and tracks the pointer when over a glass box', async () => {
    const box = document.createElement('div');
    box.className = 'liquid-glass';
    document.body.appendChild(box);

    const { container } = render(<MouseGradient />);
    const gradient = container.firstElementChild as HTMLDivElement;

    box.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 120,
        clientY: 160,
        bubbles: true,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(gradient.style.opacity).toBe('1');
    expect(gradient.style.getPropertyValue('--mouse-x')).toBe('120px');
    expect(gradient.style.getPropertyValue('--mouse-y')).toBe('160px');

    document.body.removeChild(box);
  });

  it('stays hidden when the pointer is not over a glass box', async () => {
    const plain = document.createElement('div');
    document.body.appendChild(plain);

    const { container } = render(<MouseGradient />);
    const gradient = container.firstElementChild as HTMLDivElement;

    plain.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 120,
        clientY: 160,
        bubbles: true,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(gradient.style.opacity).toBe('0');

    document.body.removeChild(plain);
  });
});
