export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#050508]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="挠荔枝" className="h-8 w-auto" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                挠荔枝 Knowledge
              </p>
              <p className="text-xs text-muted-foreground">用耳朵阅读</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground/90">
            <a href="#features" className="hover:text-foreground transition-colors">
              功能
            </a>
            <a href="#download" className="hover:text-foreground transition-colors">
              下载
            </a>
            <a
              href="https://github.com/Primoguo/naolizhi.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
            <a href="/privacy.html" className="hover:text-foreground transition-colors">
              隐私政策
            </a>
            <span className="w-px h-3 bg-muted-foreground/20" />
            <a href="/terms.html" className="hover:text-foreground transition-colors">
              用户协议
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/90">
            © {new Date().getFullYear()} 挠荔枝 Knowledge. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/90">
            <span>naolizhi.cn</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>备案中</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
