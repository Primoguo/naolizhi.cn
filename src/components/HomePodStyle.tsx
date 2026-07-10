import { useEffect, useRef } from "react";

export default function HomePodStyle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 480;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const podRadius = 140;

    let time = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      time += 0.008;

      // Ambient glow
      const ambientGlow = ctx.createRadialGradient(
        centerX, centerY, podRadius * 0.8,
        centerX, centerY, podRadius * 1.8
      );
      ambientGlow.addColorStop(0, "rgba(249, 115, 22, 0.08)");
      ambientGlow.addColorStop(0.5, "rgba(249, 115, 22, 0.03)");
      ambientGlow.addColorStop(1, "transparent");
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, size, size);

      // === HomePod body ===
      ctx.save();
      
      // Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;

      // Main body gradient (deep space gray)
      const bodyGradient = ctx.createRadialGradient(
        centerX - podRadius * 0.3, centerY - podRadius * 0.4, 0,
        centerX, centerY + podRadius * 0.2, podRadius
      );
      bodyGradient.addColorStop(0, "#3a3a3c");
      bodyGradient.addColorStop(0.3, "#2c2c2e");
      bodyGradient.addColorStop(0.6, "#1c1c1e");
      bodyGradient.addColorStop(1, "#0a0a0a");

      ctx.beginPath();
      ctx.arc(centerX, centerY, podRadius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      ctx.shadowColor = "transparent";

      // Fabric texture overlay (subtle)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, podRadius, 0, Math.PI * 2);
      ctx.clip();

      for (let i = 0; i < 60; i++) {
        const y = centerY - podRadius + (i / 60) * podRadius * 2;
        const alpha = 0.015 + Math.sin(i * 0.5) * 0.01;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - podRadius, y);
        ctx.lineTo(centerX + podRadius, y);
        ctx.stroke();
      }
      ctx.restore();

      // Top highlight
      const topHighlight = ctx.createRadialGradient(
        centerX - podRadius * 0.2, centerY - podRadius * 0.5, 0,
        centerX, centerY - podRadius * 0.3, podRadius * 0.6
      );
      topHighlight.addColorStop(0, "rgba(255, 255, 255, 0.12)");
      topHighlight.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
      topHighlight.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(centerX, centerY, podRadius, 0, Math.PI * 2);
      ctx.fillStyle = topHighlight;
      ctx.fill();

      // Bottom shadow overlay
      const bottomShadow = ctx.createRadialGradient(
        centerX, centerY + podRadius * 0.6, 0,
        centerX, centerY + podRadius * 0.5, podRadius * 0.7
      );
      bottomShadow.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomShadow.addColorStop(0.7, "rgba(0, 0, 0, 0.3)");
      bottomShadow.addColorStop(1, "rgba(0, 0, 0, 0.5)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, podRadius, 0, Math.PI * 2);
      ctx.fillStyle = bottomShadow;
      ctx.fill();

      ctx.restore();

      // === Sound waves on top ===
      const waveCount = 5;
      for (let w = 0; w < waveCount; w++) {
        const waveProgress = (time * 0.8 + w * 0.2) % 1;
        const waveRadius = podRadius * 0.3 + waveProgress * podRadius * 0.9;
        const waveAlpha = (1 - waveProgress) * 0.4;
        const waveWidth = 3 + waveProgress * 4;

        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(249, 115, 22, ${waveAlpha})`;
        ctx.lineWidth = waveWidth;
        ctx.shadowColor = "#f97316";
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // === Top waveform (Siri-like) ===
      const waveformCount = 24;
      const waveformRadius = podRadius * 0.55;

      for (let i = 0; i < waveformCount; i++) {
        const angle = (i / waveformCount) * Math.PI * 2 - Math.PI / 2;
        const wave1 = Math.sin(time * 3 + i * 0.5) * 0.5 + 0.5;
        const wave2 = Math.sin(time * 2 + i * 0.3 + 1) * 0.3 + 0.3;
        const intensity = wave1 * 0.6 + wave2 * 0.4;
        
        const barHeight = 4 + intensity * 25;
        const barWidth = 4;
        const distFromCenter = waveformRadius - barHeight * 0.3;

        const x = centerX + Math.cos(angle) * distFromCenter;
        const y = centerY + Math.sin(angle) * distFromCenter;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);

        const gradient = ctx.createLinearGradient(0, -barHeight / 2, 0, barHeight / 2);
        gradient.addColorStop(0, "rgba(251, 146, 60, 0.9)");
        gradient.addColorStop(0.5, "rgba(249, 115, 22, 0.8)");
        gradient.addColorStop(1, "rgba(234, 88, 12, 0.6)");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "#f97316";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, barWidth / 2);
        ctx.fill();

        ctx.restore();
      }

      // Center glow
      const centerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, podRadius * 0.35
      );
      centerGlow.addColorStop(0, "rgba(249, 115, 22, 0.15)");
      centerGlow.addColorStop(0.5, "rgba(249, 115, 22, 0.05)");
      centerGlow.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(centerX, centerY, podRadius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

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
      
      {/* Center play button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white/90 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
