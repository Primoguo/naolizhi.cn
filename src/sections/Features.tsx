import { CardContent } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSpotlight } from "@/hooks/use-spotlight";

const FEATURES = [
  {
    title: "多格式导入",
    description:
      "支持 PDF、EPUB、Word、Excel、PPT、Markdown、TXT 和网页链接，覆盖你所有的阅读场景。",
    iconClass: "text-amber-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        {/* 底层文件 */}
        <path d="M6 8h12v12H6z" rx="2" />
        {/* 中层文件（偏移）*/}
        <path d="M8 4h12v12H8z" rx="2" />
        {/* 顶层文件（再偏移）*/}
        <path d="M10 0h12v12H10z" rx="2" />
        {/* 右上角小角标表示“多” */}
        <circle cx="20" cy="4" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "智能朗读",
    description:
      "18 种语言自动检测，阅读位置实时高亮跟随。支持快进快退、语速调节，像听播客一样听文档。",
    iconClass: "text-red-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        {/* 播放三角形 */}
        <path d="M8 5v14l11-7z" strokeLinejoin="round" />
        {/* 右侧声波 */}
        <path d="M19 9c1.5 0 2.5-1 2.5-2.5S20.5 4 19 4" />
        <path d="M19 20c1.5 0 2.5-1 2.5-2.5S20.5 15 19 15" />
        <path d="M22 12c0-2-1.5-3.5-3.5-3.5" />
        <path d="M22 12c0 2-1.5 3.5-3.5 3.5" />
      </svg>
    ),
  },
  {
    title: "随心配置",
    description:
      "8 档语速、音高和音量自由调节。支持明暗主题切换，锁屏控制中心，后台持续播放。",
    iconClass: "text-green-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        {/* 上滑条 */}
        <line x1="4" y1="6" x2="20" y2="6" />
        <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
        {/* 中滑条 */}
        <line x1="4" y1="12" x2="20" y2="12" />
        <circle cx="14" cy="12" r="2" fill="currentColor" stroke="none" />
        {/* 下滑条 */}
        <line x1="4" y1="18" x2="20" y2="18" />
        <circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "AI 总结",
    description:
      "一键生成文档摘要，快速掌握核心要点。支持朗读摘要，让 AI 帮你提炼知识精华。",
    iconClass: "text-purple-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        {/* AI 芯片图标 */}
        <rect x="4" y="4" width="16" height="16" rx="3" />
        {/* 中心点 */}
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        {/* 连接线 - 上下左右 */}
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        {/* 四角连接 */}
        <line x1="6" y1="6" x2="4" y2="4" />
        <line x1="18" y1="6" x2="20" y2="4" />
        <line x1="6" y1="18" x2="4" y2="20" />
        <line x1="18" y1="18" x2="20" y2="20" />
      </svg>
    ),
  },
];

// 单个卡片组件（内置聚光灯效果）
function FeatureCard({ feature }: { feature: typeof FEATURES[number] }) {
  const { spotRef, onMouseMove } = useSpotlight();
  
  // 根据 iconClass 生成对应的背景色
  const getBgColor = (iconClass: string) => {
    if (iconClass.includes('amber')) return 'bg-amber-500/10';
    if (iconClass.includes('red')) return 'bg-red-500/10';
    if (iconClass.includes('green')) return 'bg-green-500/10';
    if (iconClass.includes('purple')) return 'bg-purple-500/10';
    return 'bg-white/10';
  };

  return (
    <div
      ref={spotRef}
      onMouseMove={onMouseMove}
      className="spotlight-card group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
    >
      {/* 聚光灯光晕层 */}
      <div className="spotlight-glow pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="relative p-8">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl ${getBgColor(feature.iconClass)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <div className={feature.iconClass}>
            {feature.icon}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
        <p className="text-white/70 leading-relaxed">{feature.description}</p>
      </CardContent>
    </div>
  );
}

export default function Features() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="reveal text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            一个 App，搞定所有
            <span className="text-primary">阅读</span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            无论是工作文档、学习资料还是网页文章，导入即听，随时随地。
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="reveal-stagger grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
