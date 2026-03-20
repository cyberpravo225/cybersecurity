(function(){
  const canvas = document.getElementById('theme-network');
  if (!canvas) return;
  if (canvas.dataset.networkInit === '1') return;
  canvas.dataset.networkInit = '1';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let frame = 0;
  let stars = [];
  let giantStars = [];
  let nodes = [];
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const isHomePage = document.body?.dataset?.page === 'home';
  const homeStarBoost = isHomePage ? 1.28 : 1;

  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const isMobile = () => window.innerWidth < 720;

  function resize(){
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createScene();
  }

  function createScene(){
    const starCount = isMobile() ? 320 : 680;
    const giantStarCount = 5;
    const nodeCount = isMobile() ? 44 : 88;

    stars = Array.from({ length: starCount }, () => {
      const z = Math.random();
      const isLarge = Math.random() > 0.72;
      const isXL = isLarge && Math.random() > 0.6;
      const cycle = isXL ? (12 + Math.random() * 8) : (6 + Math.random() * 6);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        orbit: 10 + Math.random() * 10,
        ellipse: 0.7 + Math.random() * 0.6,
        drift: (Math.PI * 2) / cycle,
        phase: Math.random() * Math.PI * 2,
        size: isXL ? (4.4 + z * 4.8) : (isLarge ? (2.2 + z * 3.8) : (0.9 + z * 2.4)),
        alpha: 0.25 + Math.random() * 0.55,
        parallax: 0.12 + z * 0.88,
        isLarge,
        isXL
      };
    });

    giantStars = Array.from({ length: giantStarCount }, () => {
      const z = 0.82 + Math.random() * 0.18;
      const cycle = 16 + Math.random() * 8;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        orbit: 14 + Math.random() * 14,
        ellipse: 0.7 + Math.random() * 0.5,
        drift: (Math.PI * 2) / cycle,
        phase: Math.random() * Math.PI * 2,
        size: 8 + Math.random() * 5,
        alpha: 0.22 + Math.random() * 0.22,
        parallax: 0.65 + Math.random() * 0.3
      };
    });

    nodes = Array.from({ length: nodeCount }, () => {
      const z = Math.random();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * (0.08 + z * 0.12),
        vy: (Math.random() - 0.5) * (0.08 + z * 0.12),
        pulse: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  function starColor(alpha, bright){
    return isDark()
      ? `rgba(${bright ? '255,255,255' : '186,230,253'},${alpha})`
      : `rgba(${bright ? '255,255,255' : '148,163,184'},${alpha})`;
  }

  function lineColor(alpha){
    return isDark()
      ? `rgba(125,211,252,${alpha})`
      : `rgba(59,130,246,${alpha})`;
  }

  function drawStars(time){
    for (const star of stars){
      const orbit = star.orbit * (0.9 + star.z * 0.2);
      const x = star.x + Math.sin(time * star.drift + star.phase) * orbit - pointer.x * star.parallax * 2.5;
      const y = star.y + Math.cos(time * star.drift + star.phase * 0.9) * orbit * star.ellipse - pointer.y * star.parallax * 1.8;
      const twinkle = star.alpha + Math.sin(time * star.drift + star.phase) * 0.1;
      const alpha = Math.max(0.15, Math.min(1, twinkle * homeStarBoost));
      ctx.beginPath();
      ctx.fillStyle = starColor(alpha, star.z > 0.74);
      ctx.shadowBlur = (star.isXL ? (24 + star.z * 12) : (star.isLarge ? (18 + star.z * 10) : (star.z > 0.8 ? 10 : 0))) * (isHomePage ? 1.12 : 1);
      ctx.shadowColor = starColor(alpha, true);
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const star of giantStars){
      const orbit = star.orbit * (0.85 + star.z * 0.22);
      const x = star.x + Math.sin(time * star.drift + star.phase) * orbit - pointer.x * star.parallax * 3.5;
      const y = star.y + Math.cos(time * star.drift + star.phase * 0.95) * orbit * star.ellipse - pointer.y * star.parallax * 2.5;
      const twinkle = star.alpha + Math.sin(time * star.drift * 0.9 + star.phase) * 0.05;
      const alpha = Math.max(0.16, Math.min(0.64, twinkle * homeStarBoost));
      ctx.beginPath();
      ctx.fillStyle = starColor(alpha, true);
      ctx.shadowBlur = (34 + star.z * 24) * (isHomePage ? 1.16 : 1);
      ctx.shadowColor = starColor(Math.min(alpha + 0.08, 0.62), true);
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function moveNodes(time){
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;

    for (const node of nodes){
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.02;

      if (node.x < -40) node.x = width + 40;
      if (node.x > width + 40) node.x = -40;
      if (node.y < -40) node.y = height + 40;
      if (node.y > height + 40) node.y = -40;

      node.drawX = node.x - pointer.x * (0.4 + node.z * 0.8) + Math.sin(time * 0.8 + node.phase) * (4 + node.z * 8);
      node.drawY = node.y - pointer.y * (0.3 + node.z * 0.7) + Math.cos(time * 0.72 + node.phase) * (4 + node.z * 8);
    }
  }

  function drawNetwork(time){
    const maxDist = isMobile() ? 180 : 260;

    for (let i = 0; i < nodes.length; i++){
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++){
        const b = nodes[j];
        const dx = a.drawX - b.drawX;
        const dy = a.drawY - b.drawY;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) continue;

        const depth = (a.z + b.z) * 0.5;
        const shimmer = 0.7 + (Math.sin(time * (1.4 + depth) + i * 0.7 + j * 0.4) + 1) * 0.2;
        const flicker = Math.sin(time * (5 + depth * 2.3) + i * 0.6 + j * 0.9) > 0.95 ? 1.35 : 1;
        const alpha = (1 - dist / maxDist) * (isDark() ? 0.32 : 0.2) * shimmer * flicker;

        const dashA = 2 + depth * 3;
        const dashB = 8 + depth * 10;
        ctx.beginPath();
        ctx.moveTo(a.drawX, a.drawY);
        ctx.lineTo(b.drawX, b.drawY);
        ctx.setLineDash([dashA, dashB]);
        ctx.lineDashOffset = -((time * (22 + depth * 24)) % (dashA + dashB));
        ctx.lineWidth = 0.6 + depth * 0.9;
        ctx.strokeStyle = lineColor(alpha);
        ctx.shadowBlur = 8 + depth * 8;
        ctx.shadowColor = lineColor(alpha * 0.85);
        ctx.stroke();
        ctx.setLineDash([]);

        if ((1 - dist / maxDist) * depth > 0.26){
          const signal = (time * (0.2 + depth * 0.22) + i * 0.13 + j * 0.17) % 1;
          const sx = a.drawX + (b.drawX - a.drawX) * signal;
          const sy = a.drawY + (b.drawY - a.drawY) * signal;
          const glowAlpha = Math.min(0.95, 0.3 + depth * 0.6);

          ctx.beginPath();
          ctx.fillStyle = starColor(glowAlpha, true);
          ctx.shadowBlur = 14 + depth * 12;
          ctx.shadowColor = lineColor(glowAlpha);
          ctx.arc(sx, sy, 0.8 + depth * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (const node of nodes){
      const pulse = (Math.sin(node.pulse) + 1) * 0.5;
      const radius = 0.9 + node.z * 1.9 + pulse * 0.35;
      const alpha = 0.5 + node.z * 0.4;
      ctx.beginPath();
      ctx.fillStyle = starColor(alpha, node.z > 0.7);
      ctx.shadowBlur = 10 + node.z * 10;
      ctx.shadowColor = lineColor(alpha);
      ctx.arc(node.drawX, node.drawY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function render(){
    const time = performance.now() * 0.001;
    ctx.clearRect(0, 0, width, height);
    drawStars(time);
    moveNodes(time);
    drawNetwork(time);
    frame = requestAnimationFrame(render);
  }

  resize();
  render();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    resize();
    render();
  }, { passive: true });

  window.addEventListener('pointermove', (event) => {
    pointer.tx = (event.clientX / Math.max(width, 1) - 0.5) * 2;
    pointer.ty = (event.clientY / Math.max(height, 1) - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    pointer.tx = 0;
    pointer.ty = 0;
  }, { passive: true });
})();
