import { useState, useCallback, useRef } from "react";
import { ArrowDown, Star } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";

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

  // 手机屏幕中的动态文本 - 来自 Knowledge PRD 功能介绍
  const prdText = `挠荔枝是一款专为深度阅读设计的 iOS 有声阅读器。支持 PDF、EPUB、Word 等 9 种格式一键导入，18 种语言智能朗读，后台播放、锁屏控制、智能高亮跟随——让文档像音乐一样被聆听。`;
  
  const { displayedText } = useTypewriter(prdText, 25, 1500);

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
                <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-2xl">
                  {/* 左侧高光边框 */}
                  <div className="absolute left-0 top-[3.5rem] bottom-[3.5rem] w-[3px] bg-gradient-to-b from-white/60 via-white/30 to-transparent" />
                  {/* 右侧阴影边框 */}
                  <div className="absolute right-0 top-[3.5rem] bottom-[3.5rem] w-[3px] bg-gradient-to-b from-black/30 via-black/15 to-transparent" />
                  {/* 顶部高光 */}
                  <div className="absolute top-0 left-[3.5rem] right-[3.5rem] h-[3px] bg-gradient-to-r from-white/40 via-white/20 to-transparent" />
                  {/* 底部阴影 */}
                  <div className="absolute bottom-0 left-[3.5rem] right-[3.5rem] h-[3px] bg-gradient-to-r from-black/25 via-black/15 to-transparent" />
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
                  
                  {/* 屏幕内容 — 参考 Knowledge App 播放器界面 */}
                  <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0c]">
                    {/* 顶部导航栏 */}
                    <div className="flex items-center justify-between px-5 pt-14 pb-2">
                      {/* AI 伴读按钮 */}
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-semibold text-white/90">正在播放</p>
                      {/* AI 总结按钮 */}
                      <div className="w-7 h-7 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                        </svg>
                      </div>
                    </div>

                    {/* 文档信息头部 */}
                    <div className="flex items-center gap-3 px-5 py-3">
                      {/* 文档图标 */}
                      <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-blue-500/70 to-purple-500/50 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-white truncate">认知觉醒</p>
                        <p className="text-[10px] text-white/40">PDF · 8.2万字</p>
                      </div>
                    </div>

                    {/* 高亮文本区域 - 动态打字机效果 */}
                    <div className="flex-1 mx-4 rounded-xl bg-white/[0.04] overflow-hidden px-4 py-3">
                      <div className="space-y-2.5">
                        <p className="text-[10px] text-white/60 leading-relaxed font-serif min-h-[60px]">
                          {displayedText}
                          {!displayedText && (
                            <span className="inline-block w-1 h-3 ml-0.5 bg-blue-400 animate-pulse" />
                          )}
                        </p>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="px-5 pt-3 pb-1">
                      <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="w-[35%] h-full rounded-full bg-blue-500" />
                      </div>
                      <div className="flex justify-between text-[9px] text-white/35 font-mono mt-1">
                        <span>02:35</span>
                        <span>08:42</span>
                      </div>
                    </div>

                    {/* 播放控制 */}
                    <div className="flex items-center justify-center gap-7 py-3">
                      {/* 快退 15s */}
                      <div className="w-9 h-9 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                        </svg>
                      </div>
                      {/* 播放/暂停 */}
                      <div className="w-14 h-14 rounded-full bg-blue-500/15 flex items-center justify-center">
                        <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      </div>
                      {/* 快进 30s */}
                      <div className="w-9 h-9 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                        </svg>
                      </div>
                    </div>

                    {/* 语速快捷档位 */}
                    <div className="flex items-center justify-center gap-2 pb-8">
                      {["0.7x", "1x", "1.2x", "1.5x", "2x"].map((speed, i) => (
                        <div
                          key={speed}
                          className={`px-2.5 py-1 rounded-md text-[9px] font-semibold ${
                            i === 2
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-white/[0.06] text-white/40"
                          }`}
                        >
                          {speed}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 屏幕反光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                </div>
                
                {/* 侧面按钮（音量键 + 电源键）*/}
                <div className="absolute -left-[2px] top-[120px] w-[4px] h-[40px] bg-gradient-to-r from-gray-300 to-gray-400 rounded-l-md border-l border-white/20" />
                <div className="absolute -left-[2px] top-[180px] w-[4px] h-[40px] bg-gradient-to-r from-gray-300 to-gray-400 rounded-l-md border-l border-white/20" />
                <div className="absolute -right-[2px] top-[160px] w-[4px] h-[60px] bg-gradient-to-l from-gray-300 to-gray-400 rounded-r-md border-r border-white/20" />
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
