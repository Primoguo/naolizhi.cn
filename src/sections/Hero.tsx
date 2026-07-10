import { useState, useCallback, useRef } from "react";
import { ArrowDown } from "lucide-react";
import ParticleText from "../components/ParticleText";

// 磁吸效果 Hook
function useMagnetic(magneticStrength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxDistance = 150;
    if (distance < maxDistance) {
      const strength = (1 - distance / maxDistance) * magneticStrength;
      setOffset({ x: dx * strength, y: dy * strength });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, [magneticStrength]);

  const onMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return { ref, offset, onMouseMove, onMouseLeave };
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 全屏粒子文字 — 视觉中心 */}
      <div className="relative w-full max-w-[1600px] mx-auto px-4">
        <ParticleText />

        {/* 播放进度条 */}
        <div className="mt-4 px-8 sm:px-16 lg:px-24">
          <div className="relative h-[2px] w-full rounded-full bg-white/8 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: '35%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.2) 100%)',
                boxShadow: '0 0 8px rgba(255,255,255,0.4), 0 0 16px rgba(255,255,255,0.2)',
                animation: 'progress-flow 8s ease-in-out infinite',
              }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-[5px] w-[5px] rounded-full bg-white"
              style={{
                left: '35%',
                boxShadow: '0 0 6px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)',
                animation: 'progress-dot 8s ease-in-out infinite',
              }}
            />
          </div>
          <div className="flex justify-between mt-2.5 text-[11px] sm:text-xs text-white/25 font-mono tracking-wider">
            <span>02:34</span>
            <span className="text-white/20">认知觉醒 · 8.2 万字</span>
            <span>08:42</span>
          </div>
        </div>

        {/* 底部标语 — 逐字流动 */}
        <div className="text-center mt-6">
          <p className="text-sm sm:text-base tracking-widest font-light flex justify-center gap-1">
            {['让', '知', '识', '在', '声', '音', '中', '流', '动'].map((char, i) => (
              <span
                key={i}
                className="text-flow-char inline-block"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* 下方引导区 */}
      <div className="relative z-10 mt-6 sm:mt-8 text-center px-4">
        <div className="group relative inline-block cursor-default mb-6">
          {/* 悬停发光边框 */}
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white/0 via-white/0 to-white/0 group-hover:from-white/10 group-hover:via-white/20 group-hover:to-white/10 transition-all duration-500 opacity-0 group-hover:opacity-100" />
          {/* 背景光晕 */}
          <div className="absolute -inset-4 rounded-2xl bg-white/[0.03] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
          <div className="relative rounded-xl border border-white/[0.06] group-hover:border-white/[0.12] bg-white/[0.02] group-hover:bg-white/[0.05] px-8 py-4 backdrop-blur-sm transition-all duration-500">
            <p className="text-lg sm:text-xl font-bold text-white/60 group-hover:text-white/90 max-w-md leading-relaxed tracking-wider transition-colors duration-500">
              导入文档，用耳朵阅读世界
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <MagneticButton />
          <a
            href="#features"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
          >
            了解更多
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>

      {/* 底部渐变消隐 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </section>
  );
}

// 磁吸按钮组件
function MagneticButton() {
  const { ref, offset, onMouseMove, onMouseLeave } = useMagnetic(0.35);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <a
        href="#download"
        className="inline-flex rounded-md shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
      >
        <img
          src="/app-store-badge-white.svg"
          alt="Download on the App Store"
          className="h-10"
        />
      </a>
    </div>
  );
}
