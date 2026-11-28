'use client';

import { useEffect, useRef, useState } from 'react';

type SceneController = { start: () => void; stop: () => void; dispose: () => void };

// The artwork is deliberately progressive: the CSS illustration is the no-JS,
// reduced-motion and WebGL-failure fallback, and is never needed for navigation.
export default function ImmersiveScene() {
  const container = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) document.documentElement.dataset.motionPaused = 'true';
    else delete document.documentElement.dataset.motionPaused;
    return () => {
      delete document.documentElement.dataset.motionPaused;
    };
  }, [paused]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scene: SceneController | undefined;
    let visible = false;
    let loading = false;
    let disposed = false;
    let generation = 0;

    function destroy() {
      generation++;
      scene?.dispose();
      scene = undefined;
      element?.removeAttribute('data-webgl');
    }
    function sync() {
      if (disposed || motion.matches || paused) {
        destroy();
        return;
      }
      if (!visible || document.hidden) {
        scene?.stop();
        return;
      }
      if (scene) {
        scene.start();
        return;
      }
      if (loading) return;
      loading = true;
      const version = generation;
      import('./immersive-renderer')
        .then(({ createImmersiveRenderer }) => {
          if (disposed || motion.matches || paused || version !== generation) return;
          scene = createImmersiveRenderer(element!) ?? undefined;
          if (scene) {
            element!.setAttribute('data-webgl', 'ready');
            if (visible && !document.hidden) scene.start();
          }
        })
        .catch(() => {
          // Static fallback remains visible if WebGL or the module is unavailable.
        })
        .finally(() => {
          loading = false;
          // The preference may have changed while the module was loading.
          if (!disposed && visible && !motion.matches && !paused && version !== generation) sync();
        });
    }

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              sync();
            },
            { threshold: 0.05 },
          )
        : null;
    if (observer) observer.observe(element);
    else {
      visible = true;
      sync();
    }
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true;
      observer?.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      destroy();
    };
  }, [paused]);

  return (
    <>
      <div className="immersive-art" ref={container} aria-hidden="true">
        <div className="immersive-fallback">
          <span />
          <span />
          <span />
          <b>
            K<span>.</span>
          </b>
        </div>
      </div>
      <button
        className="immersive-motion-control"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((current) => !current)}
      >
        {paused ? 'Resume motion' : 'Pause motion'}
      </button>
    </>
  );
}
