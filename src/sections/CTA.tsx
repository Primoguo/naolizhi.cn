import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="download" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary to-red-600 overflow-hidden">
          {/* Decorative */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 blur-[60px]" />
          </div>

          <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              开始用耳朵阅读
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-lg mx-auto">
              免费下载挠荔枝 Knowledge，导入你的第一份文档，体验全新的阅读方式。
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://apps.apple.com/app/id6742556743"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="rounded-full bg-white hover:bg-white/90 text-primary text-base px-8 py-6 shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <img
                    src="/app-store-badge.svg"
                    alt="App Store"
                    className="h-10"
                  />
                </Button>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium transition-colors"
              >
                查看功能介绍
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-white/60 text-sm">
              <span>iOS 17.0+</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>免费下载</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>9 种格式支持</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
