import * as THREE from 'three';

/** A decorative scene: no live data, services or metrics are represented here. */
export function createImmersiveRenderer(container: HTMLElement) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 8.8);
  const root = new THREE.Group();
  scene.add(root);
  const core = new THREE.Group();
  root.add(core);
  const objects: THREE.Object3D[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  function track<T extends THREE.BufferGeometry>(geometry: T): T {
    geometries.push(geometry);
    return geometry;
  }
  function material<T extends THREE.Material>(value: T): T {
    materials.push(value);
    return value;
  }

  const gem = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(1.12, 1)),
    material(
      new THREE.MeshPhysicalMaterial({
        color: 0x9dbde0,
        metalness: 0.72,
        roughness: 0.21,
        flatShading: true,
        clearcoat: 0.8,
      }),
    ),
  );
  core.add(gem);
  const wire = new THREE.LineSegments(
    track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(1.14, 1)))),
    material(new THREE.LineBasicMaterial({ color: 0xeed4a8, transparent: true, opacity: 0.52 })),
  );
  core.add(wire);
  const rings = [
    { radius: 1.7, tilt: [1.12, 0.2, 0.2], color: 0xe1c38b },
    { radius: 2.05, tilt: [0.35, 1.15, 0.35], color: 0x84a9d3 },
    { radius: 2.38, tilt: [0.8, -0.65, 0.1], color: 0x9db2c7 },
  ];
  rings.forEach(({ radius, tilt, color }, index) => {
    const group = new THREE.Group();
    group.rotation.set(tilt[0], tilt[1], tilt[2]);
    root.add(group);
    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(radius, 0.009, 5, 110)),
      material(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72 })),
    );
    group.add(ring);
    const bead = new THREE.Mesh(
      track(new THREE.IcosahedronGeometry(index === 0 ? 0.1 : 0.07, 1)),
      material(
        new THREE.MeshStandardMaterial({
          color,
          metalness: 0.5,
          roughness: 0.24,
          emissive: color,
          emissiveIntensity: 0.18,
        }),
      ),
    );
    bead.position.set(radius, 0, 0);
    group.add(bead);
    objects.push(group);
  });
  // Seeded points avoid layout-changing randomness between scene instances.
  const points = new Float32Array(110 * 3);
  let seed = 121;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < points.length; i += 3) {
    points[i] = (random() - 0.5) * 9;
    points[i + 1] = (random() - 0.5) * 7;
    points[i + 2] = (random() - 0.5) * 3 - 2;
  }
  const pointsGeometry = track(new THREE.BufferGeometry());
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  scene.add(
    new THREE.Points(
      pointsGeometry,
      material(
        new THREE.PointsMaterial({ color: 0xbdd2e6, size: 0.024, transparent: true, opacity: 0.6 }),
      ),
    ),
  );
  scene.add(new THREE.AmbientLight(0x90b6e2, 1.4));
  const warm = new THREE.PointLight(0xffcb82, 55, 20);
  warm.position.set(3, 4, 4);
  scene.add(warm);
  const blue = new THREE.PointLight(0x6fa8ff, 40, 18);
  blue.position.set(-4, -2, 3);
  scene.add(blue);

  let frame = 0;
  let running = false;
  let disposed = false;
  let lost = false;
  let pointerX = 0;
  let pointerY = 0;
  let previous = 0;
  let elapsed = 0;
  function render(time: number) {
    if (!running || disposed) return;
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    elapsed += delta;
    root.rotation.y += (pointerX * 0.3 - root.rotation.y) * 0.035;
    root.rotation.x += (pointerY * 0.22 - root.rotation.x) * 0.035;
    core.rotation.y = elapsed * 0.18;
    core.rotation.x = Math.sin(elapsed * 0.22) * 0.16;
    objects.forEach((object, index) => {
      object.rotation.z += delta * (index % 2 ? -0.14 : 0.17);
    });
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 480 ? 10 : 8.8;
    camera.updateProjectionMatrix();
  }
  function move(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;
    const bounds = container.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  }
  function reset() {
    pointerX = 0;
    pointerY = 0;
  }
  function stop() {
    running = false;
    previous = 0;
    cancelAnimationFrame(frame);
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    stop();
    container.removeAttribute('data-webgl');
  }
  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(container);
  window.addEventListener('resize', resize);
  container.addEventListener('pointermove', move);
  container.addEventListener('pointerleave', reset);
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  resize();
  return {
    start() {
      if (!disposed && !lost && !running) {
        running = true;
        frame = requestAnimationFrame(render);
      }
    },
    stop,
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', move);
      container.removeEventListener('pointerleave', reset);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((value) => value.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
