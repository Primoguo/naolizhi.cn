import { useEffect, useRef } from "react";

interface Particle {
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
  phase: number;
  offsetX: number;
  offsetY: number;
  pulseX: number;
  pulseY: number;
  warmth: number;
  // 字母组索引（0-8，对应 "Knowledge" 的 9 个字母）
  letterIdx: number;
  // 每个字母独立的节奏参数
  bpmOffset: number;
  beatPhaseOffset: number;
  kickWeight: number;
  snareWeight: number;
  hihatWeight: number;
  swingAmount: number;
  grooveDelay: number;
}

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  phase: number;
  warmth: number;
}

export default function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = canvas.parentElement;
    const containerWidth = container ? container.clientWidth : window.innerWidth;

    const width = containerWidth;
    const isMobile = width < 768;
    const height = isMobile ? 420 : 600;
    const fontSize = isMobile ? Math.min(width * 0.15, 120) : 280;
    const sampleGap = isMobile ? 3 : 4;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const text = "Knowledge";
    const fontWeight = 700;
    const fontFamily =
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offscreen.width = width;
    offscreen.height = height;

    offCtx.fillStyle = "white";
    offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(text, width / 2, height / 2);

    const imageData = offCtx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const particles: Particle[] = [];

    // 检测字母边界：扫描每列的平均亮度，找到字母间的间隔
    const colAlpha = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let y = 0; y < height; y += 2) {
        const idx = (y * width + x) * 4;
        if (pixels[idx + 3] > 50) {
          sum += pixels[idx + 3];
          count++;
        }
      }
      colAlpha[x] = count > 0 ? sum / count : 0;
    }

    // 找到字母边界（连续低亮度的列）
    const letterBounds: number[] = [0]; // 起始位置
    let inGap = false;
    let gapStart = 0;
    const threshold = 5;
    for (let x = 0; x < width; x++) {
      if (colAlpha[x] < threshold) {
        if (!inGap) {
          inGap = true;
          gapStart = x;
        }
      } else {
        if (inGap) {
          inGap = false;
          letterBounds.push(Math.round((gapStart + x) / 2));
        }
      }
    }
    letterBounds.push(width);

    // 为 9 个字母生成独立的节奏特征
    // 每个字母有自己的 BPM 偏差、节拍偏移、频段偏好、摇摆感
    const letterCount = 9; // "Knowledge"
    const letterRhythms = [];
    for (let i = 0; i < letterCount; i++) {
      // 使用确定性随机（基于索引），保证每次加载一致
      const seed = (i * 137.5 + 42.7) % 1;
      const seed2 = (i * 73.3 + 91.2) % 1;
      const seed3 = (i * 51.9 + 17.4) % 1;
      letterRhythms.push({
        bpmOffset: (seed - 0.5) * 12,         // BPM ±6
        beatPhaseOffset: seed2 * 0.4,          // 节拍偏移 0-0.4
        kickWeight: 0.3 + seed * 0.5,          // 底鼓响应强度
        snareWeight: 0.2 + seed2 * 0.5,        // 军鼓响应
        hihatWeight: 0.1 + seed3 * 0.6,        // hi-hat 响应
        swingAmount: seed * 0.3,                // 摇摆感
        grooveDelay: seed2 * 0.08,             // 律动延迟（秒）
      });
    }

    // 根据 x 位置确定字母索引
    const getLetterIdx = (x: number): number => {
      for (let i = 0; i < letterBounds.length - 1; i++) {
        if (x >= letterBounds[i] && x < letterBounds[i + 1]) {
          return Math.min(i, letterCount - 1);
        }
      }
      return 0;
    };

    for (let y = 0; y < height; y += sampleGap) {
      for (let x = 0; x < width; x += sampleGap) {
        const idx = (y * width + x) * 4;
        const alpha = pixels[idx + 3];

        if (alpha > 80) {
          const angle = Math.random() * Math.PI * 2;
          const baseSpread = 10 + Math.random() * 22;
          const pulseSpread = 30 + Math.random() * 60;

          const letterIdx = getLetterIdx(x);

          particles.push({
            baseX: x + (Math.random() - 0.5) * 3,
            baseY: y + (Math.random() - 0.5) * 3,
            size: 1.2 + Math.random() * 3.5,
            alpha: 0.4 + Math.random() * 0.55,
            phase: Math.random() * Math.PI * 2,
            offsetX: Math.cos(angle) * baseSpread,
            offsetY: Math.sin(angle) * baseSpread,
            pulseX: Math.cos(angle) * pulseSpread,
            pulseY: Math.sin(angle) * pulseSpread,
            warmth: Math.random(),
            letterIdx,
            ...letterRhythms[letterIdx],
          });
        }
      }
    }

    // 环境星点粒子
    const ambientCount = isMobile ? 60 : 120;
    const ambientParticles: AmbientParticle[] = [];

    for (let i = 0; i < ambientCount; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2 - 0.1,
        size: 0.5 + Math.random() * 2,
        alpha: 0,
        maxAlpha: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        warmth: Math.random(),
      });
    }

    let time = 0;
    let animationId: number;
    let mouseX = -9999;
    let mouseY = -9999;
    let lastMouseMove = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMove < 16) return;
      lastMouseMove = now;

      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (width / rect.width);
      mouseY = (e.clientY - rect.top) * (height / rect.height);
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const mouseInfluenceRadius = isMobile ? 100 : 150;
    const mouseInfluenceStrength = isMobile ? 30 : 55;

    const getParticleColor = (warmth: number, alpha: number) => {
      // 纯灰阶：根据 warmth 分配不同灰度
      if (warmth < 0.6) {
        return `rgba(255, 255, 255, ${alpha})`;      // 亮白
      } else if (warmth < 0.85) {
        return `rgba(200, 200, 200, ${alpha})`;      // 中灰
      } else {
        return `rgba(150, 150, 150, ${alpha})`;      // 深灰
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // ====== 音乐节拍系统 ======
      // BPM 72 — 舒缓的 ambient 节奏
      const bpm = 72;
      const beatDuration = 60 / bpm; // 每拍时长（秒）
      const beatPhase = (time % beatDuration) / beatDuration; // 当前拍内位置 0-1

      // 底鼓：每拍一个重击，快速衰减
      const kickDecay = Math.exp(-beatPhase * 8);
      const kick = kickDecay * kickDecay;

      // 军鼓：第 2、4 拍（off-beat）
      const offBeatPhase = ((time + beatDuration) % beatDuration) / beatDuration;
      const snareDecay = Math.exp(-offBeatPhase * 6);
      const snare = snareDecay * snareDecay * 0.6;

      // Hi-hat：16 分音符碎拍
      const hihatPhase = (time % (beatDuration / 4)) / (beatDuration / 4);
      const hihat = Math.exp(-hihatPhase * 12) * 0.3;

      // 低频 Bass：缓慢起伏的正弦波
      const bass = (Math.sin(time * 0.4) + 1) * 0.5 * 0.4;

      // 综合节拍强度
      const beatIntensity = kick * 0.5 + snare * 0.25 + hihat * 0.15 + bass * 0.1;

      // 声波传播：从中心向外扩散的涟漪
      const waveSpeed = 180; // 像素/秒
      const waveFreq = 2.5;

      const time3 = time * 1.5;

      // ====== 绘制环境星点（跟随节拍闪烁）======
      for (let i = 0; i < ambientParticles.length; i++) {
        const ap = ambientParticles[i];

        ap.x += ap.vx;
        ap.y += ap.vy;

        if (ap.x < -10) ap.x = width + 10;
        if (ap.x > width + 10) ap.x = -10;
        if (ap.y < -10) ap.y = height + 10;
        if (ap.y > height + 10) ap.y = -10;

        // 环境粒子跟随 kick 节拍脉动
        const ambientPulse = 0.3 + kick * 0.5 + hihat * 0.3;
        const flicker = 0.5 + 0.5 * Math.sin(time * 2 + ap.phase * 3);
        ap.alpha = ap.maxAlpha * flicker * ambientPulse;

        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(ap.warmth, ap.alpha);
        ctx.fill();

        if (ap.size > 1.2) {
          ctx.beginPath();
          ctx.arc(ap.x, ap.y, ap.size * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            ap.x, ap.y, 0,
            ap.x, ap.y, ap.size * 3
          );
          glow.addColorStop(0, getParticleColor(ap.warmth, ap.alpha * 0.3));
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }

      // ====== 绘制文字粒子（每个字母独立律动）======
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 使用每个字母自己的 BPM 和节拍偏移
        const letterBpm = bpm + p.bpmOffset;
        const letterBeatDur = 60 / letterBpm;
        const t = time - p.grooveDelay; // 字母专属的律动时间

        // 每个字母独立的底鼓节奏
        const lBeatPhase = ((t + p.beatPhaseOffset * letterBeatDur) % letterBeatDur) / letterBeatDur;
        const lKickDecay = Math.exp(-lBeatPhase * 8);
        const lKick = lKickDecay * lKickDecay * p.kickWeight;

        // 每个字母独立的军鼓节奏（带摇摆感）
        const lOffBeat = ((t + p.beatPhaseOffset * 0.5 * letterBeatDur + letterBeatDur) % letterBeatDur) / letterBeatDur;
        const lSnareDecay = Math.exp(-lOffBeat * 6);
        const lSnare = lSnareDecay * lSnareDecay * 0.6 * p.snareWeight;

        // 每个字母独立的 hi-hat（带摇摆）
        const lHihatPhase = (t % (letterBeatDur / 4)) / (letterBeatDur / 4);
        const lHihat = Math.exp(-lHihatPhase * 12) * 0.3 * p.hihatWeight;

        // 低频 Bass（字母专属的相位偏移）
        const lBass = (Math.sin(t * 0.4 + p.phase) + 1) * 0.5 * 0.4;

        // 综合节拍强度（每个字母不同）
        const lBeatIntensity = lKick * 0.5 + lSnare * 0.25 + lHihat * 0.15 + lBass * 0.1;

        // 粒子在画布中的归一化位置
        const normX = p.baseX / width;
        const normY = p.baseY / height;

        // 声波涟漪：从中心向外扩散
        const cx = width / 2;
        const cy = height / 2;
        const dist = Math.sqrt((p.baseX - cx) ** 2 + (p.baseY - cy) ** 2);
        const waveDelay = dist / waveSpeed;
        const wavePhase = t * waveFreq - waveDelay;
        const waveRipple = Math.sin(wavePhase) * 0.5 + 0.5;

        // 不同区域响应不同频段
        const bassResponse = (1 - normX) * lBass;
        const hihatResponse = normX * lHihat;
        const snareResponse = (1 - Math.abs(normY - 0.5) * 2) * lSnare;

        // 综合运动（字母独立权重）
        const localBeat = lKick * 0.7 + snareResponse * 0.5 + bassResponse * 0.6 + hihatResponse * 0.5;
        const waveInfluence = waveRipple * lKick * 1.2;

        // 摇摆感：增加 hi-hat 节奏添加不规则偏移
        const swingOffset = Math.sin(t * 3.7 + p.phase * 2.1) * p.swingAmount * 5;

        const randomOffset = Math.sin(time3 + p.phase) * 5;
        const breathe = Math.sin(t * 0.3 + p.phase * 0.5) * 4;

        let px =
          p.baseX +
          p.offsetX * (0.8 + localBeat * 1.2) +
          p.pulseX * lBeatIntensity * 1.5 +
          (randomOffset + breathe) * localBeat +
          waveInfluence * p.pulseX * 0.6 +
          swingOffset;
        let py =
          p.baseY +
          p.offsetY * (0.8 + localBeat * 1.2) +
          p.pulseY * lBeatIntensity * 1.5 +
          (randomOffset + breathe) * localBeat * 0.6 +
          waveInfluence * p.pulseY * 0.6;

        if (mouseX > -1000) {
          const dx = p.baseX - mouseX;
          const dy = p.baseY - mouseY;
          const mouseDistSq = dx * dx + dy * dy;
          const radiusSq = mouseInfluenceRadius * mouseInfluenceRadius;

          if (mouseDistSq < radiusSq) {
            const mouseDist = Math.sqrt(mouseDistSq);
            const mouseInfluence = 1 - mouseDist / mouseInfluenceRadius;
            const eased = mouseInfluence * mouseInfluence;
            px += (dx / mouseDist) * eased * mouseInfluenceStrength;
            py += (dy / mouseDist) * eased * mouseInfluenceStrength;
          }
        }

        const pulseAlpha = p.alpha * (0.65 + lBeatIntensity * 0.55);
        const flicker = 0.85 + Math.sin(time * 5 + p.phase * 2.5) * 0.15;
        const finalAlpha = Math.min(1, pulseAlpha * flicker);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p.warmth, finalAlpha);
        ctx.fill();

        if (p.size > 2.5) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            px, py, 0,
            px, py, p.size * 2.5
          );
          glow.addColorStop(0, getParticleColor(p.warmth, finalAlpha * 0.25));
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
