import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  // 粒子类型: 'orbit' 星环 | 'atmosphere' 大气层 | 'headphone' 耳麦 | 'spark' 火花
  type: "orbit" | "atmosphere" | "headphone" | "spark";
  angle: number;    // 轨道角度
  radius: number;   // 轨道半径
  speed: number;    // 轨道速度
}

/**
 * 火星 + 大耳麦 粒子背景
 * 
 * 火星球体：中心发光圆，带陨石坑纹理
 * 大耳麦：弧形头梁 + 两侧耳罩
 * 粒子系统：星环轨道粒子 + 大气层粒子 + 耳麦微光粒子 + 随机火花
 */

export default function EarParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // 计算火星中心（页面中心偏上一点，给耳麦头梁留空间）
    const getMarsCenter = () => ({
      cx: window.innerWidth / 2,
      cy: window.innerHeight / 2 - 20,
    });

    const marsRadius = () => Math.min(window.innerWidth, window.innerHeight) * 0.2;

    const createParticle = (cx: number, cy: number, r: number): Particle => {
      const rand = Math.random();

      if (rand < 0.45) {
        // 星环粒子 - 椭圆轨道
        const angle = Math.random() * Math.PI * 2;
        const ringRadius = r * (1.3 + Math.random() * 1.0);
        return {
          x: cx + Math.cos(angle) * ringRadius * 1.5,
          y: cy + Math.sin(angle) * ringRadius * 0.4,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.2 + 0.3,
          alpha: 0,
          maxAlpha: Math.random() * 0.5 + 0.2,
          life: Math.random() * 300,
          maxLife: 300,
          type: "orbit",
          angle,
          radius: ringRadius,
          speed: (Math.random() * 0.003 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        };
      } else if (rand < 0.70) {
        // 大气层粒子 - 火星表面附近
        const angle = Math.random() * Math.PI * 2;
        const dist = r * (0.85 + Math.random() * 0.3);
        return {
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          alpha: 0,
          maxAlpha: Math.random() * 0.35 + 0.15,
          life: Math.random() * 200,
          maxLife: 200,
          type: "atmosphere",
          angle,
          radius: dist,
          speed: (Math.random() - 0.5) * 0.004,
        };
      } else if (rand < 0.90) {
        // 耳麦粒子 - 头梁和耳罩上
        const isLeft = Math.random() > 0.5;
        const sideSign = isLeft ? -1 : 1;
        const headphoneAngle = Math.random() * Math.PI * 2;
        const earCupDist = r * (0.95 + Math.random() * 0.2);
        // 耳罩位置在火星两侧
        const cupX = cx + sideSign * (r + 25 + Math.random() * 30);
        const cupY = cy + (Math.random() - 0.5) * r * 0.6;
        return {
          x: cupX,
          y: cupY,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.0 + 0.3,
          alpha: 0,
          maxAlpha: Math.random() * 0.4 + 0.2,
          life: Math.random() * 150,
          maxLife: 150,
          type: "headphone",
          angle: headphoneAngle,
          radius: earCupDist,
          speed: 0,
        };
      } else {
        // 随机火花
        const angle = Math.random() * Math.PI * 2;
        const dist = r * (1.0 + Math.random() * 2.0);
        return {
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 0.8 + 0.2,
          alpha: 0,
          maxAlpha: Math.random() * 0.7 + 0.3,
          life: Math.random() * 80,
          maxLife: 80,
          type: "spark",
          angle,
          radius: dist,
          speed: 0,
        };
      }
    };

    const initParticles = () => {
      const { cx, cy } = getMarsCenter();
      const r = marsRadius();
      return Array.from({ length: 1800 }, () => createParticle(cx, cy, r));
    };

    let particles = initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      resize();
      const { cx, cy } = getMarsCenter();
      const r = marsRadius();
      particles = Array.from({ length: 1800 }, () => createParticle(cx, cy, r));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    /**
     * 绘制火星球体
     */
    const drawMars = (cx: number, cy: number, r: number) => {
      // 外层光晕
      const outerGlow = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.3);
      outerGlow.addColorStop(0, "rgba(212, 75, 61, 0.15)");
      outerGlow.addColorStop(0.5, "rgba(212, 75, 61, 0.05)");
      outerGlow.addColorStop(1, "rgba(212, 75, 61, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 火星球体主体 - 多层渐变模拟球体光照
      const bodyGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.05, cx, cy, r);
      bodyGrad.addColorStop(0, "rgba(240, 100, 60, 0.25)");   // 高光
      bodyGrad.addColorStop(0.3, "rgba(212, 75, 61, 0.18)");
      bodyGrad.addColorStop(0.6, "rgba(180, 45, 35, 0.12)");
      bodyGrad.addColorStop(0.85, "rgba(120, 25, 20, 0.06)");
      bodyGrad.addColorStop(1, "rgba(60, 10, 10, 0)");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // 火星边缘暗环
      const edgeGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r);
      edgeGrad.addColorStop(0, "transparent");
      edgeGrad.addColorStop(1, "rgba(212, 75, 61, 0.06)");
      ctx.fillStyle = edgeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // 陨石坑（随机分布几个暗色椭圆）
      const craters = [
        { rx: r * 0.35, ry: r * 0.3, ax: r * 0.25, ay: -r * 0.1, rot: 0.2 },
        { rx: r * 0.15, ry: r * 0.12, ax: r * 0.3, ay: r * 0.35, rot: -0.3 },
        { rx: r * 0.12, ry: r * 0.1, ax: -r * 0.2, ay: r * 0.25, rot: 0.5 },
        { rx: r * 0.2, ry: r * 0.16, ax: -r * 0.3, ay: -r * 0.3, rot: -0.15 },
        { rx: r * 0.08, ry: r * 0.07, ax: r * 0.1, ay: -r * 0.5, rot: 0.4 },
        { rx: r * 0.1, ry: r * 0.09, ax: -r * 0.4, ay: r * 0.1, rot: -0.6 },
        { rx: r * 0.06, ry: r * 0.05, ax: r * 0.45, ay: -r * 0.2, rot: 0.1 },
      ];

      for (const crater of craters) {
        ctx.save();
        ctx.translate(cx + crater.ax, cy + crater.ay);
        ctx.rotate(crater.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, crater.rx, crater.ry, 0, 0, Math.PI * 2);
        const craterGrad = ctx.createRadialGradient(0, 0, crater.rx * 0.1, 0, 0, crater.rx);
        craterGrad.addColorStop(0, "rgba(80, 15, 10, 0.12)");
        craterGrad.addColorStop(1, "rgba(212, 75, 61, 0.04)");
        ctx.fillStyle = craterGrad;
        ctx.fill();
        ctx.restore();
      }
    };

    /**
     * 绘制大耳麦
     */
    const drawHeadphone = (cx: number, cy: number, r: number) => {
      const headphoneColor = "rgba(180, 180, 190, 0.15)";

      // 头梁 - 弧形从火星顶部跨过
      const headbandRadius = r * 1.15;

      ctx.save();
      ctx.strokeStyle = headphoneColor;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.25, headbandRadius, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();

      // 头梁内层（更亮）
      ctx.strokeStyle = "rgba(200, 200, 210, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.25, headbandRadius + 3, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
      ctx.restore();

      // 左侧耳罩
      drawEarcup(cx - r - 15, cy, r * 0.35);
      // 右侧耳罩
      drawEarcup(cx + r + 15, cy, r * 0.35);

      // 连接臂（从头梁到耳罩）
      ctx.save();
      ctx.strokeStyle = headphoneColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      // 左连接臂
      const leftBandAngle = Math.PI * 1.05;
      const leftBandX = cx + Math.cos(leftBandAngle) * headbandRadius;
      const leftBandY = cy - r * 0.25 + Math.sin(leftBandAngle) * headbandRadius;
      ctx.beginPath();
      ctx.moveTo(leftBandX, leftBandY);
      ctx.lineTo(cx - r - 15, cy - r * 0.2);
      ctx.stroke();

      // 右连接臂
      const rightBandAngle = Math.PI * 1.95;
      const rightBandX = cx + Math.cos(rightBandAngle) * headbandRadius;
      const rightBandY = cy - r * 0.25 + Math.sin(rightBandAngle) * headbandRadius;
      ctx.beginPath();
      ctx.moveTo(rightBandX, rightBandY);
      ctx.lineTo(cx + r + 15, cy - r * 0.2);
      ctx.stroke();

      ctx.restore();
    };

    /**
     * 绘制单个耳罩
     */
    const drawEarcup = (x: number, y: number, size: number) => {
      // 耳罩外框（圆角矩形）
      ctx.save();
      ctx.fillStyle = "rgba(50, 50, 60, 0.12)";
      ctx.strokeStyle = "rgba(180, 180, 190, 0.15)";
      ctx.lineWidth = 2;
      const cupW = size * 0.7;
      const cupH = size * 1.1;
      roundRect(x - cupW / 2, y - cupH / 2, cupW, cupH, cupW * 0.4);

      // 耳罩内圈
      ctx.fillStyle = "rgba(30, 30, 40, 0.1)";
      ctx.strokeStyle = "rgba(212, 75, 61, 0.1)";
      ctx.lineWidth = 1.5;
      roundRect(x - cupW * 0.35, y - cupH * 0.35, cupW * 0.7, cupH * 0.7, cupW * 0.3);

      // 耳罩连接环
      ctx.fillStyle = "rgba(150, 150, 160, 0.08)";
      ctx.strokeStyle = "rgba(180, 180, 190, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y - cupH * 0.45, cupW * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    /**
     * 绘制圆角矩形路径
     */
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const { cx, cy } = getMarsCenter();
      const r = marsRadius();
      time++;

      // 拖尾效果
      ctx.fillStyle = "rgba(5, 5, 5, 0.32)";
      ctx.fillRect(0, 0, width, height);

      // 绘制火星球体
      drawMars(cx, cy, r);

      // 绘制大耳麦
      drawHeadphone(cx, cy, r);

      // 更新和绘制粒子
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 根据类型更新位置
        if (p.type === "orbit") {
          p.angle += p.speed;
          p.x = cx + Math.cos(p.angle) * p.radius * 1.5;
          p.y = cy + Math.sin(p.angle) * p.radius * 0.4;
        } else if (p.type === "headphone") {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.99;
          p.vy *= 0.99;
        } else if (p.type === "atmosphere") {
          p.angle += p.speed;
          p.x += p.vx + Math.cos(p.angle) * 0.1;
          p.y += p.vy + Math.sin(p.angle) * 0.1;
          p.vx *= 0.99;
          p.vy *= 0.99;
        } else if (p.type === "spark") {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.02; // 轻微重力
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        // 鼠标交互
        const dxMouse = p.x - mouseX;
        const dyMouse = p.y - mouseY;
        const distMouse = Math.sqrt(dxMouse ** 2 + dyMouse ** 2);
        const interactionRadius = 150;
        if (distMouse < interactionRadius && distMouse > 0) {
          const force = (interactionRadius - distMouse) / interactionRadius;
          p.x += (dxMouse / distMouse) * force * 2;
          p.y += (dyMouse / distMouse) * force * 2;
        }

        p.life--;
        const fadeIn = Math.min(p.life / 30, 1);
        const fadeOut = p.type === "spark"
          ? 1
          : Math.min((p.maxLife - p.life) / 50, 1);
        p.alpha = Math.min(fadeIn, fadeOut) * p.maxAlpha;

        // 重置死掉的粒子
        if (p.life <= 0) {
          const newP = createParticle(cx, cy, r);
          particles[i] = newP;
        }

        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

          if (p.type === "orbit") {
            const brightness = 160 + Math.random() * 80;
            ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.4}, ${brightness * 0.2}, ${p.alpha})`;
          } else if (p.type === "atmosphere") {
            const r2 = 212 + Math.random() * 43;
            const g = 55 + Math.random() * 50;
            const b = 35 + Math.random() * 30;
            ctx.fillStyle = `rgba(${r2}, ${g}, ${b}, ${p.alpha})`;
          } else if (p.type === "headphone") {
            const brt = 150 + Math.random() * 80;
            ctx.fillStyle = `rgba(${brt}, ${brt}, ${brt + 20}, ${p.alpha})`;
          } else {
            ctx.fillStyle = `rgba(255, 180, 100, ${p.alpha})`;
          }
          ctx.fill();

          // 大粒子光晕
          if (p.size > 0.8 && p.type !== "spark") {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = p.type === "orbit"
              ? `rgba(255, 150, 80, ${p.alpha * 0.08})`
              : `rgba(212, 75, 61, ${p.alpha * 0.06})`;
            ctx.fill();
          }
        }
      }

      // 耳麦微光脉冲
      if (time % 120 < 60) {
        const pulseAlpha = 0.03 * (1 - (time % 60) / 60);
        const leftPulse = ctx.createRadialGradient(cx - r - 15, cy, 0, cx - r - 15, cy, r * 0.3);
        leftPulse.addColorStop(0, `rgba(212, 75, 61, ${pulseAlpha})`);
        leftPulse.addColorStop(1, "transparent");
        ctx.fillStyle = leftPulse;
        ctx.beginPath();
        ctx.arc(cx - r - 15, cy, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        const rightPulse = ctx.createRadialGradient(cx + r + 15, cy, 0, cx + r + 15, cy, r * 0.3);
        rightPulse.addColorStop(0, `rgba(212, 75, 61, ${pulseAlpha})`);
        rightPulse.addColorStop(1, "transparent");
        ctx.fillStyle = rightPulse;
        ctx.beginPath();
        ctx.arc(cx + r + 15, cy, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "#050505" }}
    />
  );
}
