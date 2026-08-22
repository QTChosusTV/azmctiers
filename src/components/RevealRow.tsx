// RevealRow.tsx
// Wraps a row/card so it fades+slides in once scrolled into view.
// Delay is index * 10ms (capped) so long lists don't take forever to finish animating.

import { useEffect, useRef, useState, type ElementType } from 'react';

const DELAY_STEP_MS = 100;
const MAX_DELAY_MS = 400; // cap so item #100 doesn't wait 1s

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-reveal-row', '');
  styleEl.textContent = `
    .reveal-row {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .reveal-row--visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .reveal-row {
        transition: none;
        opacity: 1;
        transform: none;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

export function RevealRow({
  index,
  children,
  as: Tag = 'div',
  className = '',
  style,
  ...rest
}: {
  index: number;
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    ensureStyles();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already visible (e.g. above the fold on mount) — reveal immediately, no observer needed.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delay = Math.min(index * DELAY_STEP_MS, MAX_DELAY_MS);

  return (
    <Tag
      ref={ref as any}
      className={`reveal-row ${visible ? 'reveal-row--visible' : ''} ${className}`}
      style={{
        ...style,
        transitionDelay: visible ? `${delay}ms` : '0ms',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}