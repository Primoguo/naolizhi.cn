import { Globe, Headphones, Moon, Share2, FileText, Play, Lock, Music, SkipForward, SkipBack, Sun, Star, Sparkles, ListChecks, Volume2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const HIGHLIGHTS = [
  {
    icon: Globe,
    title: "网页链接一键朗读",
    description:
      "在 Safari 里看到好文章？通过分享扩展直接发送到挠荔枝，自动提取正文内容并开始朗读。无需复制粘贴，一键搞定。",
    image: (
      <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-950/80 via-slate-900/90 to-cyan-950/80 border border-blue-500/20 flex items-center justify-center overflow-hidden relative group">
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* 多层光晕 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(59,130,246,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(6,182,212,0.18),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/3 w-56 h-56 bg-blue-500/12 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px]" />
        
        {/* 浮动粒子 */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-blue-400/30 animate-bounce" style={{ width: `${3 + i % 3}px`, height: `${3 + i % 3}px`, top: `${15 + i * 14}%`, left: `${10 + i * 15}%`, animationDuration: `${2.5 + i * 0.5}s`, animationDelay: `${i * 0.3}s` }} />
        ))}
        
        <div className="relative z-10 w-full px-8 py-6 space-y-5">
          {/* 顶部浏览器模拟栏 */}
          <div className="mx-auto max-w-sm rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/10 overflow-hidden shadow-xl shadow-blue-500/5">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white/[0.06] border border-white/[0.08]">
                <span className="text-[11px] text-blue-300/80 font-mono">naolizhi.cn/article</span>
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="h-2.5 w-3/4 rounded-full bg-blue-400/20" />
              <div className="h-2 w-full rounded-full bg-white/[0.06]" />
              <div className="h-2 w-5/6 rounded-full bg-white/[0.06]" />
              <div className="h-2 w-2/3 rounded-full bg-white/[0.06]" />
            </div>
          </div>
          
          {/* 中间流程箭头 */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-blue-500/40 to-blue-500/10" />
              <div className="w-2 h-2 rounded-full bg-blue-400/50" />
              <div className="w-8 h-px bg-gradient-to-r from-blue-500/10 to-primary/40" />
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-primary/40 to-primary/10" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <div className="w-8 h-px bg-gradient-to-r from-primary/10 to-green-500/40" />
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Play className="w-4 h-4 text-green-400" fill="currentColor" />
              </div>
            </div>
          </div>
          
          {/* 底部状态标签 */}
          <div className="flex items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/25 text-xs font-medium text-blue-300">Safari 分享</span>
            <span className="px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/25 text-xs font-medium text-primary">自动提取</span>
            <span className="px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/25 text-xs font-medium text-green-300">即时朗读</span>
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
      <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-red-950/80 via-slate-900/90 to-orange-950/70 border border-red-500/20 flex items-center justify-center overflow-hidden relative group">
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* 多层光晕 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(239,68,68,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(249,115,22,0.12),transparent_50%)]" />
        <div className="absolute top-1/3 left-1/3 w-56 h-56 bg-red-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-orange-500/8 rounded-full blur-[60px]" />
        
        {/* 浮动音符粒子 */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-red-400/25 animate-bounce" style={{ width: `${3 + i % 3}px`, height: `${3 + i % 3}px`, top: `${12 + i * 16}%`, right: `${8 + i * 18}%`, animationDuration: `${2.2 + i * 0.6}s`, animationDelay: `${i * 0.4}s` }} />
        ))}
        
        <div className="relative z-10 w-full px-8 py-6 space-y-5">
          {/* 模拟锁屏播放器 */}
          <div className="mx-auto max-w-xs rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl shadow-red-500/8">
            {/* 顶部状态栏 */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[10px] text-white/40 font-medium">9:41</span>
              <div className="flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-white/40" />
                <Music className="w-2.5 h-2.5 text-primary/70" />
              </div>
            </div>
            
            {/* 专辑封面区域 */}
            <div className="px-5 pb-3">
              <div className="w-full aspect-square max-w-[120px] mx-auto rounded-xl bg-gradient-to-br from-primary/30 via-red-500/20 to-orange-500/25 border border-white/10 flex items-center justify-center mb-3 shadow-lg shadow-primary/10">
                <Headphones className="w-10 h-10 text-primary/80" strokeWidth={1.2} />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-white/90 truncate">挠荔枝 Knowledge</div>
                <div className="text-[10px] text-white/40 mt-0.5">正在朗读 · 第 3 章</div>
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="px-5 pb-2">
              <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="w-3/5 h-full rounded-full bg-gradient-to-r from-primary to-red-400" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-white/30">3:24</span>
                <span className="text-[9px] text-white/30">5:40</span>
              </div>
            </div>
            
            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-6 pb-4 pt-1">
              <SkipBack className="w-5 h-5 text-white/50" fill="currentColor" />
              <div className="w-11 h-11 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30">
                <div className="flex gap-1">
                  <div className="w-1 h-3.5 rounded-full bg-white" />
                  <div className="w-1 h-3.5 rounded-full bg-white" />
                </div>
              </div>
              <SkipForward className="w-5 h-5 text-white/50" fill="currentColor" />
            </div>
          </div>
          
          {/* 音频波形 */}
          <div className="flex items-end justify-center gap-1.5 h-10">
            {[12, 24, 18, 32, 14, 28, 20, 36, 16, 22, 30, 10, 26, 18, 34, 14].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-primary/60 to-primary/20"
                style={{
                  height: `${h}px`,
                  animation: `wave 1.2s ease-in-out ${i * 0.08}s infinite alternate`,
                }}
              />
            ))}
          </div>
          
          {/* 底部标签 */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/25">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-300/90 font-medium">后台播放中</span>
            </div>
            <span className="text-[10px] text-white/30">·</span>
            <span className="text-[10px] text-white/40">锁屏可控</span>
          </div>
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
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden flex relative border border-white/10">
        {/* ===== 明亮模式 ===== */}
        <div className="w-1/2 bg-gradient-to-br from-amber-50 via-white to-orange-50/50 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(251,191,36,0.2),transparent_60%)]" />
          <div className="absolute top-4 right-4 w-20 h-20 bg-amber-300/15 rounded-full blur-2xl" />
          {/* 光线装饰 */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute bg-amber-400/10 rounded-full" style={{ width: `${60 + i * 30}px`, height: `${60 + i * 30}px`, top: `${20 + i * 5}%`, left: `${30 - i * 8}%`, opacity: 0.3 - i * 0.06 }} />
          ))}
          
          <div className="relative z-10 text-center space-y-3">
            {/* 太阳图标 */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-400/40 blur-2xl rounded-full scale-[2.5]" />
              <div className="absolute inset-0 bg-yellow-300/25 blur-xl rounded-full scale-[1.8]" />
              <Sun className="w-16 h-16 text-amber-500 relative z-10 drop-shadow-lg mx-auto" strokeWidth={1.5} />
            </div>
            
            {/* 模拟亮色阅读界面 */}
            <div className="mx-auto w-28 rounded-lg bg-white/90 border border-slate-200/80 shadow-md overflow-hidden">
              <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="h-1 w-10 rounded-full bg-slate-200" />
              </div>
              <div className="p-2.5 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-slate-200/80" />
                <div className="h-1.5 w-5/6 rounded-full bg-slate-200/60" />
                <div className="h-1.5 w-4/6 rounded-full bg-amber-200/60" />
                <div className="h-1.5 w-full rounded-full bg-slate-200/60" />
                <div className="h-1.5 w-3/4 rounded-full bg-slate-200/40" />
              </div>
            </div>
            
            <span className="text-[10px] font-semibold text-amber-700/70 tracking-wide">日间模式</span>
          </div>
        </div>
        
        {/* ===== 中间分隔 ===== */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px z-20">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-white/25 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 to-indigo-400/20 border border-white/20 backdrop-blur-sm flex items-center justify-center">
            <Moon className="w-3.5 h-3.5 text-white/60" />
          </div>
        </div>
        
        {/* ===== 暗黑模式 ===== */}
        <div className="w-1/2 bg-gradient-to-br from-slate-950 via-neutral-900 to-indigo-950/60 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_70%,rgba(99,102,241,0.18),transparent_60%)]" />
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl" />
          {/* 星星装饰 */}
          {[...Array(6)].map((_, i) => (
            <Star key={i} className="absolute text-white/15" style={{ width: `${6 + i % 3 * 2}px`, height: `${6 + i % 3 * 2}px`, top: `${10 + i * 14}%`, left: `${8 + i * 15}%` }} fill="currentColor" />
          ))}
          
          <div className="relative z-10 text-center space-y-3">
            {/* 月亮图标 */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-500/35 blur-2xl rounded-full scale-[2.5]" />
              <div className="absolute inset-0 bg-violet-400/20 blur-xl rounded-full scale-[1.8]" />
              <Moon className="w-16 h-16 text-indigo-400 relative z-10 drop-shadow-lg mx-auto" fill="currentColor" strokeWidth={0} />
            </div>
            
            {/* 模拟暗色阅读界面 */}
            <div className="mx-auto w-28 rounded-lg bg-neutral-800/80 border border-white/[0.08] shadow-md overflow-hidden">
              <div className="px-2.5 py-1.5 border-b border-white/[0.06] flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div className="h-1 w-10 rounded-full bg-white/10" />
              </div>
              <div className="p-2.5 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-white/[0.08]" />
                <div className="h-1.5 w-5/6 rounded-full bg-white/[0.06]" />
                <div className="h-1.5 w-4/6 rounded-full bg-indigo-400/20" />
                <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
                <div className="h-1.5 w-3/4 rounded-full bg-white/[0.04]" />
              </div>
            </div>
            
            <span className="text-[10px] font-semibold text-indigo-300/60 tracking-wide">夜间模式</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: "AI 智能总结",
    description:
      "导入文档后一键生成摘要，快速掌握核心要点。支持朗读摘要，让 AI 帮你提炼知识精华，节省阅读时间。",
    reversed: true,
    image: (
      <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-indigo-950/70 border border-purple-500/20 flex items-center justify-center overflow-hidden relative group">
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* 多层光晕 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(168,85,247,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="absolute top-1/3 left-1/3 w-56 h-56 bg-purple-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-indigo-500/8 rounded-full blur-[60px]" />
        
        {/* 浮动装饰粒子 */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-purple-400/25 animate-bounce" style={{ width: `${3 + i % 3}px`, height: `${3 + i % 3}px`, top: `${12 + i * 16}%`, right: `${8 + i * 18}%`, animationDuration: `${2.2 + i * 0.6}s`, animationDelay: `${i * 0.4}s` }} />
        ))}
        
        <div className="relative z-10 w-full px-8 py-6 space-y-5">
          {/* 模拟播放器界面 */}
          <div className="mx-auto max-w-sm rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/8">
            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-white/80">行业报告.pdf</span>
              </div>
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            
            {/* 原文内容预览 */}
            <div className="px-5 py-4 space-y-2">
              <div className="h-2 w-full rounded-full bg-white/[0.06]" />
              <div className="h-2 w-5/6 rounded-full bg-white/[0.06]" />
              <div className="h-2 w-4/6 rounded-full bg-white/[0.04]" />
            </div>
            
            {/* AI 总结按钮 */}
            <div className="px-5 pb-4">
              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600/80 to-indigo-600/80 border border-purple-500/30 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold text-white">AI 总结</span>
              </button>
            </div>
            
            {/* 生成的摘要卡片 */}
            <div className="mx-5 mb-5 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-semibold text-purple-300">核心要点</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div className="h-1.5 w-full rounded-full bg-purple-400/20" />
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div className="h-1.5 w-5/6 rounded-full bg-purple-400/20" />
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div className="h-1.5 w-4/6 rounded-full bg-purple-400/20" />
                </div>
              </div>
              
              {/* 朗读摘要按钮 */}
              <button className="mt-3 w-full py-2 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 hover:bg-white/15 transition-all">
                <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-[10px] text-purple-200/90 font-medium">朗读摘要</span>
              </button>
            </div>
          </div>
          
          {/* 底部状态提示 */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25">
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              <span className="text-[10px] text-purple-300/90 font-medium">AI 已就绪</span>
            </div>
            <span className="text-[10px] text-white/30">·</span>
            <span className="text-[10px] text-white/40">通义千问驱动</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Highlights() {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 sm:py-32 bg-white/[0.03] backdrop-blur-sm border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal text-center max-w-2xl mx-auto mb-16">
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
