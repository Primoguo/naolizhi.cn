import { CardContent } from "@/components/ui/card";
import { FileText, Mic, Settings } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSpotlight } from "@/hooks/use-spotlight";

const FEATURES = [
  {
    icon: FileText,
    title: "多格式导入",
    description:
      "支持 PDF、EPUB、Word、Excel、PPT、Markdown、TXT 和网页链接，覆盖你所有的阅读场景。",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Mic,
    title: "智能朗读",
    description:
      "18 种语言自动检测，阅读位置实时高亮跟随。支持快进快退、语速调节，像听播客一样听文档。",
    color: "from-primary to-red-400",
    bgColor: "bg-primary/10",
  },
  {
    icon: Settings,
    title: "随心配置",
    description:
      "8 档语速、音高和音量自由调节。支持明暗主题切换，锁屏控制中心，后台持续播放。",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
];

// 单个卡片组件（内置聚光灯效果）
function FeatureCard({ feature }: { feature: typeof FEATURES[number] }) {
  const { spotRef, onMouseMove } = useSpotlight();

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
          className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <feature.icon
            className={`h-7 w-7 text-transparent bg-gradient-to-br ${feature.color} bg-clip-text`}
            strokeWidth={1.5}
          />
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
        <div ref={cardsRef} className="reveal-stagger grid md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
