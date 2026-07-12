---
kind: frontend_style
name: 基于 Tailwind + shadcn/ui 的原子化样式体系
category: frontend_style
scope:
    - '**'
source_files:
    - tailwind.config.js
    - postcss.config.js
    - src/index.css
    - src/App.css
    - components.json
    - src/components/ui/button.tsx
---

本项目采用 Tailwind CSS + shadcn/ui 的原子化样式方案，通过 CSS 变量驱动主题、class-variance-authority 管理组件变体，形成统一的视觉系统。

## 样式架构与工具链
- 构建层：Vite + PostCSS（autoprefixer）+ Tailwind CSS，postcss.config.js 仅挂载 tailwindcss 与 autoprefixer 两个插件，保持极简。
- 设计系统来源：shadcn/ui（components.json 中 style: new-york），通过 CLI 将无样式的 Radix 基础组件注入到 src/components/ui/，由开发者完全掌控源码。
- 样式入口：src/index.css 使用 @tailwind base/components/utilities 三阶段导入，并通过 @layer 组织自定义样式；src/App.css 补充全局滚动选择器与滚动条样式。

## 设计令牌（Design Tokens）
所有颜色、圆角、阴影等令牌均以 HSL CSS 变量形式定义在 :root 与 .dark 下，遵循 shadcn 约定命名：
- 语义色：--primary, --destructive, --muted, --accent。品牌主色为荔枝红 hsl(6 63% 54%)（#D44B3D）。
- 表面色：--background, --card, --popover, --sidebar-*。明暗模式分别提供两套值。
- 边框/焦点：--border, --input, --ring。ring 复用 primary 色实现聚焦态。
- 几何：--radius。统一圆角基准，Tailwind 中扩展出 xs/sm/md/lg/xl。
这些变量在 tailwind.config.js 中以 hsl(var(--xxx)) 形式映射到 Tailwind 颜色空间，使 bg-primary、text-destructive 等原子类自动跟随主题切换。

## 组件样式策略
- UI 组件（src/components/ui/*）：使用 class-variance-authority（cva）声明 variants（如 variant、size），配合 cn() 合并 className，避免硬编码样式。
- 业务组件（src/sections/*）：直接组合 Tailwind 原子类，不引入额外 CSS 文件，保证样式可追踪。
- 动画：tailwind.config.js 中通过 keyframes + animation 注册 accordion-down/up、caret-blink、wave 等微动效；src/index.css 的 .reveal / .reveal-stagger 配合 use-scroll-reveal.ts 实现滚动入场。

## 响应式与深色模式
- 深色模式通过 darkMode: ["class"] 切换，依赖父元素添加 .dark 类（通常由 shadcn 的 theme provider 控制）。
- 断点沿用 Tailwind 默认 sm/md/lg/xl/2xl，结合 use-mobile.ts hook 在 JS 侧做逻辑分支。

## 开发规范
1. 优先使用 Tailwind 原子类，仅在确实需要时写自定义 CSS 并放入 @layer utilities。
2. 新增 UI 组件应放在 src/components/ui/，用 cva 声明变体，并通过 npx shadcn add <component> 生成。
3. 调整主题只修改 src/index.css 中的 CSS 变量，不要直接写死颜色值。
4. 图标统一使用 lucide（iconLibrary: "lucide"），通过 @/lib/utils 的 cn 函数合并 className。