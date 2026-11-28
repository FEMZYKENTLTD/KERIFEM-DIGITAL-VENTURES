'use client';

import Image from 'next/image';
import { useRef } from 'react';
import type { PointerEvent } from 'react';

// Decorative illustration only: the code and panels do not represent a live system.
export default function Workstation() {
  const scene = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== 'mouse' ||
      document.documentElement.dataset.motionPaused === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    scene.current?.style.setProperty('--scene-x', `${x * 9}deg`);
    scene.current?.style.setProperty('--scene-y', `${y * -7}deg`);
  }

  function reset() {
    scene.current?.style.removeProperty('--scene-x');
    scene.current?.style.removeProperty('--scene-y');
  }

  return (
    <div
      className="workstation-stage"
      ref={scene}
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      <div className="workstation-orbit workstation-orbit-one" />
      <div className="workstation-orbit workstation-orbit-two" />
      <div className="workstation-scene">
        <div className="workstation-frame">
          <div className="workstation-frame-top">
            <span className="workstation-dots">
              <i />
              <i />
              <i />
            </span>
            <span>KERIFEM / DIGITAL STUDIO</span>
            <span>✳</span>
          </div>
          <div className="workstation-image">
            <Image
              src="/workstation/kerifem-studio.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 760px) 90vw, 650px"
            />
            <div className="workstation-image-shade" />
            <div className="workstation-image-caption">
              <span>IDEAS INTO INTERFACES</span>
              <span>01 — 03</span>
            </div>
          </div>
          <div className="workstation-frame-bottom">
            <span>DESIGN / BUILD / CONNECT</span>
            <span>✦</span>
          </div>
        </div>
        <div className="workstation-code">
          <div className="workstation-code-top">
            <span>✳</span> project.ts <span>···</span>
          </div>
          <div className="workstation-code-body">
            <div>
              <b>01</b>
              <span>
                <em>const</em> vision = {'{'}
              </span>
            </div>
            <div>
              <b>02</b>
              <span>
                  design: <i>&apos;intentional&apos;</i>,
              </span>
            </div>
            <div>
              <b>03</b>
              <span>
                  build: <i>&apos;for people&apos;</i>,
              </span>
            </div>
            <div>
              <b>04</b>
              <span>
                  impact: <i>&apos;real world&apos;</i>
              </span>
            </div>
            <div>
              <b>05</b>
              <span>
                {'}'}; <span className="workstation-cursor">▌</span>
              </span>
            </div>
          </div>
        </div>
        <div className="workstation-note">
          <span>✳</span>
          <div>
            <small>THE KERIFEM APPROACH</small>
            <strong>Built with intention.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
