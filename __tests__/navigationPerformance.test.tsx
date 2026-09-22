import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Navbar from '@/components/TheNavbar';
import SpecularButton from '@/components/SpecularButton';

vi.mock('@/lib/haptic', () => ({ haptic: vi.fn() }));
const route = vi.hoisted(() => ({ pathname: '/words' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('@/components/ThemeToggle', () => ({ default: () => null }));
vi.mock('@/components/LanguageSelector', () => ({ default: () => null }));
vi.mock('ogl', () => ({
  Renderer: class {
    gl = { canvas: document.createElement('canvas'), clearColor() {}, enable() {}, blendFunc() {}, getExtension() {} };
    setSize() {}
    render() {}
  },
  Triangle: class { attributes = {}; },
  Program: class {
    uniforms;
    constructor(_gl: unknown, options: { uniforms: unknown }) { this.uniforms = options.uniforms; }
  },
  Mesh: class {},
  Color: class { r = 1; g = 1; b = 1; set() {} },
}));

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it.each(['/words', '/words/example', '/projects'])('links to the projects page from %s on desktop and mobile', (pathname) => {
  route.pathname = pathname;
  render(<Navbar />);
  for (const link of screen.getAllByText('navbar.projects')) {
    expect(link.getAttribute('href')).toBe('/projects');
  }
});

it('preserves the projects section link on the home page', () => {
  route.pathname = '/';
  render(<Navbar />);
  for (const link of screen.getAllByText('navbar.projects')) {
    expect(link.getAttribute('href')).toBe('#projects');
  }
});

it.each([false, true])('only keeps rendering an idle button when autoAnimate is enabled (%s)', (autoAnimate) => {
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  let intersect: IntersectionObserverCallback;
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('pointer: fine') }));
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) { intersect = callback; }
    observe() {} disconnect() {}
  });
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; });
  vi.stubGlobal('cancelAnimationFrame', (key: number) => frames.delete(key));
  const { container } = render(<SpecularButton autoAnimate={autoAnimate}>Test</SpecularButton>);
  // O WebGL só nasce quando o botão chega perto da viewport...
  expect(container.querySelector('canvas')).toBeNull();
  act(() => intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(container.querySelector('canvas')).not.toBeNull();
  // ...e então o observer de visibilidade passa a controlar o render.
  act(() => intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
  const start = performance.now();
  for (let frame = 1; frame <= 180; frame++) {
    const pending = [...frames.values()];
    frames.clear();
    act(() => pending.forEach(callback => callback(start + frame * 16.67)));
  }
  expect(frames.size).toBe(autoAnimate ? 1 : 0);
  act(() => intersect([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(frames.size).toBe(0);
});
