import { useEffect, useRef } from "react";

export default function BlackHoleVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 500;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const blackHoleRadius = 70;

    interface Particle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
      trail: { x: number; y: number; alpha: number }[];
    }

    const particles: Particle[] = [];
    const colors = [
      "#f97316",
      "#fb923c",
      "#fbbf24",
      "#a78bfa",
      "#c084fc",
      "#f472b6",
    ];

    for (let i = 0; i < 80; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 180 + Math.random() * 60,
        speed: 0.01 + Math.random() * 0.02,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    }

    let time = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      time += 0.016;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        blackHoleRadius * 1.5,
        centerX,
        centerY,
        size / 2
      );
      outerGlow.addColorStop(0, "rgba(249, 115, 22, 0.1)");
      outerGlow.addColorStop(0.5, "rgba(168, 85, 247, 0.05)");
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, size, size);

      // Accretion disk - outer
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = blackHoleRadius + 40 + ring * 35;
        const rotationSpeed = 0.3 + ring * 0.2;
        const ringAlpha = 0.4 + ring * 0.15;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * rotationSpeed * (ring % 2 === 0 ? 1 : -1));

        const gradient = ctx.createLinearGradient(
          -ringRadius,
          0,
          ringRadius,
          0
        );
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.3, `rgba(249, 115, 22, ${ringAlpha * 0.5})`);
        gradient.addColorStop(0.5, `rgba(251, 191, 36, ${ringAlpha})`);
        gradient.addColorStop(0.7, `rgba(168, 85, 247, ${ringAlpha * 0.7})`);
        gradient.addColorStop(1, "transparent");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 12 + ring * 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 1.6);
        ctx.stroke();

        ctx.restore();
      }

      // Particles spiraling in
      particles.forEach((p) => {
        p.angle += p.speed;
        p.radius -= 0.3 + p.speed * 10;

        if (p.radius < blackHoleRadius + 5) {
          p.radius = 200 + Math.random() * 40;
          p.angle = Math.random() * Math.PI * 2;
          p.trail = [];
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        p.trail.unshift({ x, y, alpha: 1 });
        if (p.trail.length > 15) p.trail.pop();

        p.trail.forEach((point, i) => {
          const alpha = (1 - i / p.trail.length) * 0.6;
          const size = p.size * (1 - i / p.trail.length);
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Black hole center
      const bhGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        blackHoleRadius * 1.3
      );
      bhGradient.addColorStop(0, "#000000");
      bhGradient.addColorStop(0.6, "#000000");
      bhGradient.addColorStop(0.85, "rgba(0,0,0,0.7)");
      bhGradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = bhGradient;
      ctx.fill();

      // Event horizon glow
      const pulseScale = 1 + Math.sin(time * 2) * 0.05;
      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius * pulseScale, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.5 + Math.sin(time * 2) * 0.2})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#f97316";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius * 1.1 * pulseScale, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 + Math.sin(time * 2 + 1) * 0.15})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <canvas ref={canvasRef} className="max-w-full" />
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-xl shadow-primary/50">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
            <svg className="w-7 h-7 text-white ml-0.5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
          <p className="text-base font-bold text-white mb-1">认知觉醒</p>
          <p className="text-xs text-white/50">8.2万字 · AI 伴读</p>
        </div>
      </div>
    </div>
  );
}
