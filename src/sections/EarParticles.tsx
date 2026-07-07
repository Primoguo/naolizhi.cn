import { useEffect, useRef } from "react";

// ============== 类型定义 ==============

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;         // 预计算颜色字符串
  hasCross: boolean;     // 是否有十字星芒
  crossColor: string;    // 星芒颜色
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  trail: { x: number; y: number; alpha: number }[];
  color: string;
  life: number;
}

interface MouseTrail {
  x: number;
  y: number;
  alpha: number;
}

// ============== 常量 ==============

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

const getParticleCounts = () => {
  if (isMobile()) return { stars: 180, dust: 200 }; // 移动端也增加密度
  return { stars: 600, dust: 450 }; // 桌面端大幅增加
};

const STAR_COUNT = () => getParticleCounts().stars;
const DUST_COUNT = () => getParticleCounts().dust;
const TRAIL_LENGTH = 16;
const MOUSE_TRAIL_MAX = 8;
const MOUSE_INFLUENCE = 120;
const METEOR_MIN_INTERVAL = 120; // 帧（流星间隔缩短，频率提高一倍）
const METEOR_MAX_INTERVAL = 280;

// 预计算颜色
const STAR_COLORS: { color: string; crossColor: string }[] = [
  { color: "rgba(255,255,255,", crossColor: "rgba(255,255,255," },
  { color: "rgba(220,230,255,", crossColor: "rgba(220,230,255," },
  { color: "rgba(200,220,255,", crossColor: "rgba(200,220,255," },
  { color: "rgba(255,245,220,", crossColor: "rgba(255,245,220," },
  { color: "rgba(255,220,180,", crossColor: "rgba(255,220,180," },
  { color: "rgba(255,200,160,", crossColor: "rgba(255,200,160," },
  { color: "rgba(200,210,255,", crossColor: "rgba(200,210,255," },
  { color: "rgba(255,255,240,", crossColor: "rgba(255,255,240," },
  { color: "rgba(255,230,200,", crossColor: "rgba(255,230,200," },
  { color: "rgba(240,240,255,", crossColor: "rgba(240,240,255," },
];

const DUST_COLORS: string[] = [
  "rgba(255,200,150,",
  "rgba(255,180,120,",
  "rgba(255,220,170,",
  "rgba(255,160,100,",
  "rgba(255,240,200,",
  "rgba(255,140,80,",
  "rgba(212,75,61,",     // 品牌荔枝红
];

const METEOR_COLORS: string[] = [
  "rgba(255,255,255,",
  "rgba(220,230,255,",
  "rgba(255,240,220,",
  "rgba(255,220,180,",
];

// ============== 工具函数 ==============

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ============== 组件 ==============

export default function EarParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true); // 用于在动画循环中判断是否可见

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // IntersectionObserver：canvas 不可见时暂停动画，节省 CPU/GPU
    let intersectionObserver: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisibleRef.current = entries[0].isIntersecting;
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(canvas);
    }

    let animationId = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let time = 0;
    let nextMeteorAt = randInt(METEOR_MIN_INTERVAL, METEOR_MAX_INTERVAL);

    // 鼠标柔光跟随（lerp 插值，模拟流体延迟感）
    let glowX = -1000;
    let glowY = -1000;
    const GLOW_LERP = 0.08; // 跟随速度，越小延迟越大
    const GLOW_RADIUS = 120; // 光晕半径

    // ========== Resize ==========
    const resize = () => {
      const mobile = isMobile();
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ========== 初始化 ==========
    const createStar = (): Star => {
      const colorData = pick(STAR_COLORS);
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: rand(0.2, 2.8),       // 尺寸范围稍大，有更多大小变化
        alpha: 0,
        baseAlpha: rand(0.25, 1.0), // 基础亮度下限降低，更多暗星
        twinkleSpeed: rand(0.015, 0.1), // 闪烁速度范围更大
        twinklePhase: Math.random() * Math.PI * 2,
        color: colorData.color,
        hasCross: Math.random() < 0.12,   // 十字星芒概率稍增
        crossColor: colorData.crossColor,
      };
    };

    const createDust = (): DustParticle => {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35, // 漂移速度稍快
        vy: (Math.random() - 0.5) * 0.35,
        size: rand(0.2, 1.2),             // 光粒尺寸范围更大
        alpha: 0,
        baseAlpha: rand(0.15, 0.7),       // 亮度更低，更柔和
        life: randInt(180, 550),          // 寿命稍短，更新更快
        maxLife: randInt(350, 750),
        color: pick(DUST_COLORS),
      };
    };

    const createMeteor = (): Meteor => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const angle = rand(-0.4, -0.2); // 左上到右下
      const speed = rand(6, 12);
      const startX = rand(w * 0.1, w * 0.9);
      const startY = rand(0, h * 0.3);
      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: rand(1.0, 2.0),
        alpha: 1,
        trail: [],
        color: pick(METEOR_COLORS),
        life: randInt(30, 55),
      };
    };

    let stars: Star[] = Array.from({ length: STAR_COUNT() }, createStar);
    let dustParticles: DustParticle[] = Array.from({ length: DUST_COUNT() }, createDust);
    let meteors: Meteor[] = [];
    let mouseTrails: MouseTrail[] = [];

    // ========== 事件处理 ==========
    const handlePointerMove = (clientX: number, clientY: number) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = clientX;
      mouseY = clientY;

      // 在路径上留下光点
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5 && prevMouseX > 0) {
        const steps = Math.min(Math.floor(dist / 8), 5);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          mouseTrails.push({
            x: prevMouseX + dx * t,
            y: prevMouseY + dy * t,
            alpha: 0.5 * (1 - t * 0.5),
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      resize();
      stars = Array.from({ length: STAR_COUNT() }, createStar);
      dustParticles = Array.from({ length: DUST_COUNT() }, createDust);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    // ========== 绘制 ==========
    const drawCosmicGlow = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // 极微弱的深蓝紫径向渐变
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "rgba(20,15,40,0.03)");
      grad.addColorStop(0.4, "rgba(10,8,25,0.02)");
      grad.addColorStop(1, "rgba(5,5,8,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    };

    const drawStar = (s: Star) => {
      const a = s.alpha;
      if (a < 0.02) return;

      // 星点本体
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color + a + ")";
      ctx.fill();

      // 十字星芒
      if (s.hasCross && s.size > 1.0) {
        const crossLen = s.size * 6;
        const crossA = a * 0.35;
        ctx.strokeStyle = s.crossColor + crossA + ")";
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(s.x - crossLen, s.y);
        ctx.lineTo(s.x + crossLen, s.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - crossLen);
        ctx.lineTo(s.x, s.y + crossLen);
        ctx.stroke();
      }

      // 亮星光晕
      if (s.size > 1.5) {
        const glowGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
        glowGrad.addColorStop(0, s.color + a * 0.25 + ")");
        glowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawDust = (d: DustParticle) => {
      if (d.alpha < 0.02) return;

      if (isMobile()) {
        // 移动端：简单圆点，性能优先
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = d.color + d.alpha + ")";
        ctx.fill();
        return;
      }

      // 桌面端：带光晕的粒子
      const glowGrad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size * 2.5);
      glowGrad.addColorStop(0, d.color + d.alpha + ")");
      glowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawMeteor = (m: Meteor) => {
      // 拖尾
      for (let i = 0; i < m.trail.length; i++) {
        const t = m.trail[i];
        const trailAlpha = (i / m.trail.length) * m.alpha;
        ctx.beginPath();
        ctx.arc(t.x, t.y, m.size * (0.3 + (i / m.trail.length) * 0.7), 0, Math.PI * 2);
        ctx.fillStyle = m.color + trailAlpha * 0.6 + ")";
        ctx.fill();
      }

      // 头部
      const headGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 4);
      headGrad.addColorStop(0, m.color + m.alpha + ")");
      headGrad.addColorStop(0.3, m.color + m.alpha * 0.5 + ")");
      headGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawMouseTrails = () => {
      for (const t of mouseTrails) {
        if (t.alpha < 0.01) continue;
        // 光晕半径随透明度缩小，产生收束感
        const glowRadius = 18 * t.alpha + 4;
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, glowRadius);
        grad.addColorStop(0, `rgba(212,75,61,${t.alpha * 0.6})`);   // 中心亮红
        grad.addColorStop(0.4, `rgba(212,75,61,${t.alpha * 0.2})`); // 中间衰减
        grad.addColorStop(1, `rgba(212,75,61,0)`);                   // 边缘透明
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // 鼠标柔光大光晕（始终跟随鼠标，有延迟）
    const drawCursorGlow = () => {
      // lerp 插值：光晕缓慢追向鼠标，产生流体延迟感
      glowX += (mouseX - glowX) * GLOW_LERP;
      glowY += (mouseY - glowY) * GLOW_LERP;

      // 鼠标不在视口内时不绘制
      if (glowX < -200 || glowY < -200) return;

      const grad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, GLOW_RADIUS);
      grad.addColorStop(0, "rgba(212,75,61,0.12)");    // 中心微亮
      grad.addColorStop(0.5, "rgba(212,75,61,0.04)");  // 中间淡出
      grad.addColorStop(1, "rgba(212,75,61,0)");         // 边缘完全透明
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(glowX, glowY, GLOW_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    };

    // ========== 动画循环 ==========
    const animate = () => {
      // 不可见时跳过绘制，但继续调度下一帧以保持响应
      if (!isVisibleRef.current) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      time++;

      // 透明清除 + 半透明暗色覆盖（让底层流体透出来）
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(5,5,8,0.65)";
      ctx.fillRect(0, 0, w, h);

      // 宇宙底色
      drawCosmicGlow();

      // --- 更新星空 ---
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed;
        s.alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.twinklePhase));
      }

      // --- 更新光粒 ---
      for (const d of dustParticles) {
        // 布朗运动
        d.vx += (Math.random() - 0.5) * 0.03;
        d.vy += (Math.random() - 0.5) * 0.03;
        d.vx *= 0.98;
        d.vy *= 0.98;

        if (!isMobile()) {
          // 桌面端：鼠标引力
          const dx = mouseX - d.x;
          const dy = mouseY - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_INFLUENCE && dist > 1) {
            const force = (1 - dist / MOUSE_INFLUENCE) * 0.08;
            d.vx += (dx / dist) * force;
            d.vy += (dy / dist) * force;
          }
        } else {
          // 移动端：微风效果
          d.vx += 0.005;
        }

        // 限制最大速度
        const spd = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        if (spd > 0.3) {
          d.vx = (d.vx / spd) * 0.3;
          d.vy = (d.vy / spd) * 0.3;
        }

        d.x += d.vx;
        d.y += d.vy;

        // 边界循环
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;

        // 生命周期淡入淡出
        d.life--;
        if (d.life <= 0) {
          const fresh = createDust();
          Object.assign(d, fresh);
          d.alpha = 0;
        }
        const fadeIn = Math.min(1, (d.maxLife - d.life) / 30);
        const fadeOut = Math.min(1, d.life / 40);
        d.alpha = d.baseAlpha * Math.min(fadeIn, fadeOut);
      }

      // --- 鼠标推开星星（仅桌面端）---
      if (!isMobile()) {
        for (const s of stars) {
          const dx = s.x - mouseX;
          const dy = s.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_INFLUENCE && dist > 1) {
            const force = (1 - dist / MOUSE_INFLUENCE) * 3;
            s.x += (dx / dist) * force;
            s.y += (dy / dist) * force;
          }
          if (s.x < -5 || s.x > w + 5) {
            s.x = Math.max(-5, Math.min(w + 5, s.x));
          }
          if (s.y < -5 || s.y > h + 5) {
            s.y = Math.max(-5, Math.min(h + 5, s.y));
          }
        }
      }

      // --- 流星 ---
      if (time >= nextMeteorAt) {
        meteors.push(createMeteor());
        nextMeteorAt = time + randInt(METEOR_MIN_INTERVAL, METEOR_MAX_INTERVAL);
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.trail.push({ x: m.x, y: m.y, alpha: m.alpha });
        if (m.trail.length > TRAIL_LENGTH) m.trail.shift();
        m.x += m.vx;
        m.y += m.vy;
        m.life--;
        if (m.life <= 0) {
          m.alpha -= 0.05;
        }
        if (m.alpha <= 0 || m.x < -20 || m.x > w + 20 || m.y > h + 20) {
          meteors.splice(i, 1);
        }
      }

      // --- 鼠标拖尾衰减 ---
      for (let i = mouseTrails.length - 1; i >= 0; i--) {
        mouseTrails[i].alpha -= 0.02;
        if (mouseTrails[i].alpha <= 0) {
          mouseTrails.splice(i, 1);
        }
      }
      // 限制鼠标拖尾数量
      while (mouseTrails.length > MOUSE_TRAIL_MAX) {
        mouseTrails.shift();
      }

      // ====== 绘制 ======
      // 1. 光粒（底层）
      for (const d of dustParticles) drawDust(d);

      // 2. 流星
      for (const m of meteors) drawMeteor(m);

      // 3. 星空
      for (const s of stars) drawStar(s);

      // 4. 鼠标光迹
      drawMouseTrails();

      // 5. 鼠标柔光大光晕（顶层，在星空之上）
      drawCursorGlow();

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      intersectionObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
