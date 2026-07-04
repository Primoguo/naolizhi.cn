import { Globe, Headphones, Moon } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Globe,
    title: "网页链接一键朗读",
    description:
      "在 Safari 里看到好文章？通过分享扩展直接发送到挠荔枝，自动提取正文内容并开始朗读。无需复制粘贴，一键搞定。",
    image: (
      <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" strokeWidth={1} />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-medium">
              naolizhi.cn
            </span>
            <span>→</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              开始朗读
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Headphones,
    title: "后台播放，解放双眼",
    description:
      "锁屏后继续朗读，锁屏界面显示播放控件。通勤路上、健身时、睡前——让耳朵代替眼睛，随时随地吸收知识。",
    reversed: true,
    image: (
      <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
        <div className="text-center space-y-3">
          <Headphones className="h-16 w-16 text-primary mx-auto" strokeWidth={1} />
          <div className="flex items-center justify-center gap-3">
            {[16, 24, 8, 20, 14].map((h, i) => (
              <div
                key={i}
                className="w-2 rounded-full bg-primary animate-pulse"
                style={{
                  height: `${h}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">后台播放中 · 锁屏可控</p>
        </div>
      </div>
    ),
  },
  {
    icon: Moon,
    title: "明暗主题，随心切换",
    description:
      "跟随系统自动切换，或手动选择白天/暗黑模式。无论白天办公还是深夜阅读，都有最舒适的色彩体验。",
    image: (
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden flex">
        <div className="w-1/2 bg-white flex items-center justify-center">
          <Moon className="h-12 w-12 text-amber-500" fill="currentColor" />
        </div>
        <div className="w-1/2 bg-neutral-900 flex items-center justify-center">
          <Moon className="h-12 w-12 text-indigo-400" fill="currentColor" />
        </div>
      </div>
    ),
  },
];

export default function Highlights() {
  return (
    <section className="py-24 sm:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            不止于<span className="text-primary">朗读</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            精心打磨每一个细节，让阅读体验更流畅、更舒适。
          </p>
        </div>

        <div className="space-y-20">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                item.reversed ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className={item.reversed ? "lg:order-2" : ""}>
                {item.image}
              </div>

              {/* Text */}
              <div className={item.reversed ? "lg:order-1" : ""}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
