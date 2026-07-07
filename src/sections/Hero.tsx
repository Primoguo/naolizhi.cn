import { useState, useCallback, useRef } from "react";
import { ArrowDown, Star } from "lucide-react";

// 磁吸效果 Hook
function useMagnetic(magneticStrength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    // 计算鼠标距离按钮中心的距离
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 只有在一定范围内才产生磁吸效果（150px）
    const maxDistance = 150;
    if (distance < maxDistance) {
      // 距离越近，吸引力越强
      const strength = (1 - distance / maxDistance) * magneticStrength;
      setOffset({
        x: dx * strength,
        y: dy * strength,
      });
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // 将鼠标位置转换为 -1 ~ 1 的范围
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    // 最大倾斜角度 16 度，空间感更强烈
    setTilt({ x: ny * -16, y: nx * 16 });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-primary text-sm font-medium mb-8">
              <Star className="h-4 w-4 fill-primary" />
              支持 9 种文档格式 · 18 种语言朗读
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              用耳朵，
              <br />
              <span className="text-primary">读世界</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              导入 PDF、Word、网页或电子书，挠荔枝将它变成专属有声书。后台播放、锁屏控制、智能高亮——像听音乐一样听文档。
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <MagneticButton />
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                了解更多
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </a>
            </div>
          </div>

          {/* Right: Device mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative transition-transform duration-400 ease-out"
              style={{
                perspective: "1000px",
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              {/* 外层光晕 */}
              <div className="absolute -inset-8 rounded-[3.5rem] bg-primary/15 blur-[80px] scale-90" />
              
              {/* iPhone 17 Pro Max 机身 */}
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] group">
                {/* 钛金属边框（多层渐变模拟立体感）*/}
                <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 shadow-2xl">
                  {/* 左侧高光边框 */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3.5rem] bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
                  {/* 右侧阴影边框 */}
                  <div className="absolute right-0 top-0 bottom-0 w-[3px] rounded-r-[3.5rem] bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                  {/* 顶部高光 */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[3.5rem] bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
                  {/* 底部阴影 */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[3.5rem] bg-gradient-to-r from-black/30 via-black/20 to-transparent" />
                </div>
                
                {/* 屏幕区域 */}
                <div className="absolute inset-[8px] rounded-[3rem] bg-black overflow-hidden">
                  {/* 屏幕内发光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
                  
                  {/* Dynamic Island（灵动岛）*/}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-20 flex items-center justify-between px-4 border border-white/[0.08] shadow-lg shadow-black/50">
                    {/* 左侧播放图标 */}
                    <svg className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDuration: "1.2s" }}>
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                    {/* 中间波形 */}
                    <div className="flex items-end gap-[2px] h-3 flex-1 justify-center">
                      {[4, 7, 3, 9, 5, 8, 4, 10, 6, 9, 4, 7, 5, 8, 3, 6, 4, 9].map((h, i) => (
                        <div
                          key={i}
                          className="w-[2px] rounded-full bg-primary animate-pulse"
                          style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
                        />
                      ))}
                    </div>
                    {/* 右侧信号点 */}
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400/80 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                  </div>
                  
                  {/* 屏幕内容 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-neutral-900 to-slate-950">
                    <div className="text-center px-8 space-y-6">
                      {/* App 图标 */}
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-3xl scale-[2]" />
                        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/40 via-primary/20 to-purple-500/30 border border-white/10 flex items-center justify-center shadow-xl shadow-primary/20">
                          <svg
                            className="w-10 h-10 text-white drop-shadow-lg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                            />
                          </svg>
                        </div>
                      </div>
                      
                      {/* 文本信息 */}
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-white tracking-wide">正在朗读中...</p>
                        <p className="text-xs text-white/50 font-medium">Chapter 1 · 02:35</p>
                      </div>
                      
                      {/* 音频波形可视化 */}
                      <div className="flex items-end justify-center gap-[3px] h-12 pt-2">
                        {[5, 10, 7, 14, 9, 16, 11, 18, 12, 15, 10, 13, 8, 11, 6, 9, 5, 12, 8, 14, 10, 16, 12, 18, 14, 11, 9, 13, 7, 10].map((h, i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-full bg-gradient-to-t from-primary/80 to-primary/40 animate-pulse"
                            style={{
                              height: `${h * 2}px`,
                              animationDelay: `${i * 0.06}s`,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* 底部进度条 */}
                      <div className="pt-4 px-4">
                        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="w-2/5 h-full rounded-full bg-gradient-to-r from-primary to-purple-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 屏幕反光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                </div>
                
                {/* 侧面按钮（音量键 + 电源键）*/}
                <div className="absolute -left-[2px] top-[120px] w-[4px] h-[40px] bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-md border-l border-white/10" />
                <div className="absolute -left-[2px] top-[180px] w-[4px] h-[40px] bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-md border-l border-white/10" />
                <div className="absolute -right-[2px] top-[160px] w-[4px] h-[60px] bg-gradient-to-l from-gray-600 to-gray-700 rounded-r-md border-r border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 独立的磁吸按钮组件
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
        className="inline-flex rounded-md shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
      >
        <img
          src="/app-store-badge.svg"
          alt="Download on the App Store"
          className="h-10"
        />
      </a>
    </div>
  );
}
