import { useEffect, useRef } from "react";

export default function AudioWaveRing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 460;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const ringRadius = 150;
    const bars = 80;
    const barWidth = (Math.PI * 2 * ringRadius) / bars * 0.55;

    const barHeights: number[] = [];
    const barTargets: number[] = [];
    const barVelocities: number[] = [];

    for (let i = 0; i < bars; i++) {
      barHeights[i] = 8;
      barTargets[i] = 8;
      barVelocities[i] = 0;
    }

    let time = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      time += 0.016;

      // Background glow
      const bgGlow = ctx.createRadialGradient(
        centerX, centerY, ringRadius * 0.5,
        centerX, centerY, ringRadius * 1.4
      );
      bgGlow.addColorStop(0, "rgba(249, 115, 22, 0.06)");
      bgGlow.addColorStop(0.5, "rgba(168, 85, 247, 0.04)");
      bgGlow.addColorStop(1, "transparent");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, size, size);

      // Update target heights with wave pattern
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const wave1 = Math.sin(time * 2 + angle * 3) * 0.5 + 0.5;
        const wave2 = Math.sin(time * 1.5 + angle * 2 + 1) * 0.3 + 0.3;
        const wave3 = Math.sin(time * 3 + angle * 5 + 2) * 0.2 + 0.2;
        const baseHeight = 8;
        const maxHeight = 45;
        barTargets[i] = baseHeight + (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * maxHeight;
      }

      // Spring animation for smooth motion
      const spring = 0.15;
      const damping = 0.85;

      for (let i = 0; i < bars; i++) {
        const force = (barTargets[i] - barHeights[i]) * spring;
        barVelocities[i] += force;
        barVelocities[i] *= damping;
        barHeights[i] += barVelocities[i];
      }

      // Draw wave bars
      ctx.save();
      ctx.translate(centerX, centerY);

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
        const height = barHeights[i];
        const innerRadius = ringRadius - height * 0.3;
        const outerRadius = ringRadius + height * 0.7;

        // Gradient color from orange to purple
        const hue = 25 + (i / bars) * 40;
        const glowColor = `hsla(${hue}, 90%, 60%, 0.4)`;

        ctx.save();
        ctx.rotate(angle);

        // Glow
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 12;

        // Bar body
        ctx.beginPath();
        ctx.roundRect(-barWidth / 2, -outerRadius, barWidth, outerRadius - innerRadius, barWidth / 2);
        
        const gradient = ctx.createLinearGradient(0, -outerRadius, 0, -innerRadius);
        gradient.addColorStop(0, `hsla(${hue + 10}, 95%, 70%, 1)`);
        gradient.addColorStop(0.5, `hsla(${hue}, 90%, 60%, 0.95)`);
        gradient.addColorStop(1, `hsla(${hue + 20}, 85%, 55%, 0.8)`);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();

      // Inner ring line
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius - 15, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer ring line
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius + 40, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Subtle rotating gradient ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.3);
      
      const ringGradient = ctx.createLinearGradient(-ringRadius - 50, 0, ringRadius + 50, 0);
      ringGradient.addColorStop(0, "transparent");
      ringGradient.addColorStop(0.4, "rgba(249, 115, 22, 0.08)");
      ringGradient.addColorStop(0.5, "rgba(251, 191, 36, 0.12)");
      ringGradient.addColorStop(0.6, "rgba(168, 85, 247, 0.08)");
      ringGradient.addColorStop(1, "transparent");
      
      ctx.strokeStyle = ringGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius + 25, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();

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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/25 to-transparent" />
            <svg className="w-9 h-9 text-white ml-1 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
          <p className="text-lg font-bold text-white mb-1">认知觉醒</p>
          <p className="text-xs text-white/40">8.2万字 · AI 智能伴读</p>
        </div>
      </div>
    </div>
  );
}
