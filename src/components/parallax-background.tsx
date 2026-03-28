'use client';

import { cx } from 'cva.config';
import { useEffect, useRef } from 'react';

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
};

type ParallaxBackgroundProps = Readonly<{
  src: string;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  speed?: number;
  overscan?: number;
  backgroundPosition?: string;
}>;

export default function ParallaxBackground({
  src,
  className,
  imageClassName,
  overlayClassName,
  speed = 0.12,
  overscan = 24,
  backgroundPosition = 'center',
}: ParallaxBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const layer = layerRef.current;
    if (!root || !layer) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const legacyReducedMotionQuery = reducedMotionQuery as LegacyMediaQueryList;

    const updatePosition = () => {
      frameRef.current = null;

      if (reducedMotionQuery.matches) {
        layer.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      // Move the background layer more slowly than the section itself.
      const rect = root.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const translateY = Math.round((viewportCenter - sectionCenter) * speed);

      layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updatePosition);
    };

    const handleReducedMotionChange = () => {
      requestUpdate();
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    if ('addEventListener' in reducedMotionQuery) {
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    } else {
      legacyReducedMotionQuery.addListener?.(handleReducedMotionChange);
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);

      if ('removeEventListener' in reducedMotionQuery) {
        reducedMotionQuery.removeEventListener(
          'change',
          handleReducedMotionChange,
        );
      } else {
        legacyReducedMotionQuery.removeListener?.(handleReducedMotionChange);
      }
    };
  }, [speed]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      <div
        ref={layerRef}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `-${overscan}%`, bottom: `-${overscan}%` }}
      >
        <div
          className={cx(
            'absolute inset-0 scale-110 bg-cover bg-no-repeat',
            imageClassName,
          )}
          style={{
            backgroundImage: `url("${src}")`,
            backgroundPosition,
          }}
        />
      </div>

      {overlayClassName ? (
        <div className={cx('absolute inset-0', overlayClassName)} />
      ) : null}
    </div>
  );
}
