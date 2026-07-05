import { ArrowDown, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
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
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 rounded-[3rem] bg-primary/20 blur-[60px] scale-90" />
              {/* Phone frame */}
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] rounded-[2.5rem] border-4 border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[28%] h-5 bg-black rounded-full z-10 flex items-center gap-2 px-2">
                  <svg className="w-1.5 h-2 text-primary shrink-0 animate-pulse" viewBox="0 0 6 8" fill="currentColor" style={{ animationDuration: "1.2s" }}>
                    <polygon points="0,0 6,4 0,8" />
                  </svg>
                  <div className="flex items-end gap-px h-2 flex-1">
                    {[3, 5, 2, 6, 3, 4, 2, 5, 3, 6, 2, 4, 3, 5, 2, 4, 3, 6].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 rounded-full bg-primary animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
                {/* Screen placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-white/5">
                  <div className="text-center px-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-primary"
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
                    <p className="text-sm font-semibold text-white">正在朗读中...</p>
                    <p className="text-xs text-white/60 mt-1">Chapter 1 · 02:35</p>
                    {/* Fake waveform */}
                    <div className="flex items-end justify-center gap-0.5 mt-4 h-8">
                      {[4, 8, 5, 10, 6, 12, 8, 14, 9, 11, 7, 6, 3].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-primary animate-pulse"
                          style={{
                            height: `${h * 2}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
