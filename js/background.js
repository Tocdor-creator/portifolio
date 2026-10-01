// Fundo animado: rede de pontos que se ligam quando estão próximos (Three.js)

const NODE_COUNT = window.innerWidth < 900 ? 60 : 110;
const BOUNDS = { x: 900, y: 600, z: 300 };
const LINK_DISTANCE = 150;
const PARTY_DURATION = 4000;

// Com "reduzir animações" ativo no sistema, o fundo se move mais devagar
const speed = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.35 : 1;

function createDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;

  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

const randomBetween = (min, max) => min + Math.random() * (max - min);

export function initBackground(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 600;

  // Pontos
  const positions = new Float32Array(NODE_COUNT * 3);
  const velocities = new Float32Array(NODE_COUNT * 3);
  const colors = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i++) {
    positions.set([
      randomBetween(-BOUNDS.x, BOUNDS.x),
      randomBetween(-BOUNDS.y, BOUNDS.y),
      randomBetween(-BOUNDS.z, BOUNDS.z),
    ], i * 3);
    velocities.set([randomBetween(-0.175, 0.175), randomBetween(-0.175, 0.175), randomBetween(-0.1, 0.1)], i * 3);
  }

  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  nodeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const nodes = new THREE.Points(nodeGeometry, new THREE.PointsMaterial({
    size: 9,
    map: createDotTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));

  // Linhas: o buffer comporta todos os pares possíveis; desenhamos só os próximos
  const maxLinks = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linkPositions = new Float32Array(maxLinks * 6);
  const linkColors = new Float32Array(maxLinks * 6);

  const linkGeometry = new THREE.BufferGeometry();
  linkGeometry.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
  linkGeometry.setAttribute("color", new THREE.BufferAttribute(linkColors, 3));

  const links = new THREE.LineSegments(linkGeometry, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));

  const network = new THREE.Group();
  network.add(nodes, links);
  scene.add(network);

  // As cores vêm das variáveis CSS do tema atual
  function applyPalette() {
    const styles = getComputedStyle(document.documentElement);
    const palette = ["--purple", "--pink", "--cyan"].map(
      (name) => new THREE.Color(styles.getPropertyValue(name).trim())
    );

    for (let i = 0; i < NODE_COUNT; i++) {
      const color = palette[i % palette.length];
      colors.set([color.r, color.g, color.b], i * 3);
    }
    nodeGeometry.attributes.color.needsUpdate = true;
  }

  let partyUntil = 0;

  function moveNodes() {
    const boost = performance.now() < partyUntil ? 12 : 1;
    const limits = [BOUNDS.x, BOUNDS.y, BOUNDS.z];

    for (let i = 0; i < NODE_COUNT * 3; i++) {
      positions[i] += velocities[i] * speed * boost;
      if (Math.abs(positions[i]) > limits[i % 3]) velocities[i] *= -1;
    }
    nodeGeometry.attributes.position.needsUpdate = true;
  }

  function connectNodes() {
    let count = 0;

    for (let a = 0; a < NODE_COUNT; a++) {
      for (let b = a + 1; b < NODE_COUNT; b++) {
        const dx = positions[a * 3] - positions[b * 3];
        const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
        const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
        const distance = Math.hypot(dx, dy, dz);
        if (distance > LINK_DISTANCE) continue;

        // quanto mais perto, mais forte a linha
        const strength = 1 - distance / LINK_DISTANCE;
        for (let axis = 0; axis < 3; axis++) {
          linkPositions[count * 6 + axis] = positions[a * 3 + axis];
          linkPositions[count * 6 + 3 + axis] = positions[b * 3 + axis];
          linkColors[count * 6 + axis] = colors[a * 3 + axis] * strength;
          linkColors[count * 6 + 3 + axis] = colors[b * 3 + axis] * strength;
        }
        count++;
      }
    }

    linkGeometry.setDrawRange(0, count * 2);
    linkGeometry.attributes.position.needsUpdate = true;
    linkGeometry.attributes.color.needsUpdate = true;
  }

  // Interação: a rede inclina com o mouse e acompanha a rolagem
  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    moveNodes();
    connectNodes();

    network.rotation.y += (mouse.x * 0.25 - network.rotation.y) * 0.03;
    network.rotation.x += (mouse.y * 0.15 - network.rotation.x) * 0.03;
    network.position.y = window.scrollY * 0.15;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  applyPalette();
  animate();

  return {
    applyPalette,
    party: () => (partyUntil = performance.now() + PARTY_DURATION),
  };
}
