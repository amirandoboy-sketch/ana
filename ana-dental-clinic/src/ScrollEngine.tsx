import React, { useEffect, useRef } from 'react';

// --- ENTERPRISE SCROLL ENGINE & ANIMATION FRAMEWORK ---
// Production-grade React scroll transition engine featuring hardware acceleration, 
// intersection observers, custom cubic-bezier physics, 3D perspective tilts, and parallax layers.

export type AnimationVariant = 
  | 'cinematic-blur' 
  | 'perspective-3d' 
  | 'slide-up-fade' 
  | 'parallax-zoom' 
  | 'magnetic-drift';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  duration?: string;
  delay?: string;
  threshold?: number;
  className?: string;
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Global Scroll Engine Provider
 * Injects ultra-smooth scroll behaviors, luxury custom scrollbars, and hardware acceleration styles.
 */
export function ScrollEngineProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('scroll-behavior', 'smooth');
  }, []);

  return (
    <>
      <style>{`
        /* --- PROFESSIONAL HIGH-PERFORMANCE SCROLL STYLING --- */
        html {
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: rgba(225, 29, 72, 0.5) rgba(10, 2, 4, 1);
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0204;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #e11d48, #f59e0b);
          border-radius: 4px;
        }

        /* Base Engine Setup with GPU Acceleration */
        .scroll-engine-base {
          opacity: 0;
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
          perspective: 1200px;
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Variant 1: Cinematic Blur & Scale Transition */
        .variant-cinematic-blur {
          transform: translateY(90px) scale(0.93);
          filter: blur(18px);
          transition-property: opacity, transform, filter;
        }
        .variant-cinematic-blur.engine-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }

        /* Variant 2: Deep 3D Perspective Tilt */
        .variant-perspective-3d {
          transform: translateY(110px) rotateX(18deg) scale(0.91);
          filter: blur(14px);
          transform-origin: center bottom;
          transition-property: opacity, transform, filter;
        }
        .variant-perspective-3d.engine-active {
          opacity: 1;
          transform: translateY(0) rotateX(0deg) scale(1);
          filter: blur(0);
        }

        /* Variant 3: Clean Slide Up & Fade */
        .variant-slide-up-fade {
          transform: translateY(70px);
          transition-property: opacity, transform;
        }
        .variant-slide-up-fade.engine-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Variant 4: Parallax Zoom */
        .variant-parallax-zoom {
          transform: scale(0.85);
          filter: blur(10px);
          transition-property: opacity, transform, filter;
        }
        .variant-parallax-zoom.engine-active {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }

        /* Variant 5: Magnetic Drift */
        .variant-magnetic-drift {
          transform: translateY(80px) translateX(-50px);
          transition-property: opacity, transform;
        }
        .variant-magnetic-drift.engine-active {
          opacity: 1;
          transform: translateY(0) translateX(0);
        }
      `}</style>
      {children}
    </>
  );
}

/**
 * Advanced Scroll Reveal Component
 * Wrap any section or card with this component for enterprise-grade transition movement.
 */
export function ScrollReveal({
  children,
  variant = 'cinematic-blur',
  duration = '1.4s',
  delay = '0ms',
  threshold = 0.15,
  className = '',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry], observerInstance) => {
        if (entry.isIntersecting) {
          node.classList.add('engine-active');
          // Disconnect observer after initial reveal to maximize performance
          observerInstance.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={containerRef}
      className={`scroll-engine-base variant-${variant} ${className}`}
      style={{
        transitionDuration: duration,
        transitionDelay: delay,
      }}
    >
      {children}
    </div>
  );
}

/**
 * High-Performance Parallax Layer Component
 * Creates smooth depth-based scrolling offsets as the viewport moves.
 */
export function ParallaxLayer({
  children,
  speed = 0.08,
  className = '',
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (!layerRef.current) return;
      const rect = layerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const offset = (windowHeight - rect.top) * speed;
        layerRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [speed]);

  return (
    <div ref={layerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
