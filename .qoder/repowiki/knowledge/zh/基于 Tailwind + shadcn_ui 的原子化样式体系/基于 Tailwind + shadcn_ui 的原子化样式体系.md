---
kind: frontend_style
name: 基于 Tailwind + shadcn/ui 的原子化样式体系
category: frontend_style
scope:
    - '**'
source_files:
    - tailwind.config.js
    - src/index.css
    - postcss.config.js
    - components.json
    - src/App.css
    - src/components/ui/button.tsx
---

本项目采用 Tailwind CSS + shadcn/ui 的原子化样式方案，通过 CSS 变量驱动主题、class-variance-authority 管理变体，形成统一的视觉语言。

## 核心架构
- 样式引擎：Tailwind CSS v3，PostCSS 处理 @tailwind 指令与 Autoprefixer 前缀补全
- 组件库：shadcn/ui（new-york 风格），Radix UI 提供无样式可访问基础组件，通过 cva 生成变体类名
- 主题系统：CSS 自定义属性（HSL）集中定义于 :root 与 .dark，通过 hsl(var(--xxx)) 在 Tailwind 中引用
- 动画系统：tailwindcss-animate 插件 + 自定义 keyframes（accordion-down、wave、caret-blink）

## 设计令牌
品牌主色为荔枝红 #D44B3D（HSL 6 63% 54%），所有语义化颜色（primary/secondary/accent/destructive/muted）均围绕此色调派生，同时维护完整的暗色模式映射。圆角统一使用 --radius 变量（0.75rem）并通过 xl/lg/md/sm/xs 层级扩展。

## 目录约定
- src/index.css：全局样式入口，包含字体导入、Tailwind 层注入、CSS 变量主题、滚动入场动画（reveal/reveal-stagger）、聚光灯光晕（spotlight-card/glow）等通用 utility
- src/App.css：浏览器级定制（平滑滚动、选中高亮、Webkit 滚动条）
- src/components/ui/：shadcn/ui 生成的原子组件（Button/Card/Tooltip），每个组件用 cva 声明 variant/size 变体
- tailwind.config.js：扩展字体族（Inter + Noto Sans SC）、颜色、圆角、阴影、动画 keyframes
- components.json：shadcn/ui CLI 配置，别名指向 @/components/ui、@/lib/utils、@/hooks

## 开发规范
1. 优先使用 Tailwind 原子类，避免手写 CSS；仅在复杂交互（如 reveal 滚动动画、spotlight 光标追踪）时补充 @layer utilities
2. 颜色一律走 CSS 变量，禁止硬编码色值；品牌色通过 text-primary / bg-primary 等语义类引用
3. 组件样式通过 cva 管理，新增变体需在 variants 中声明，保持 class 组合可预测
4. 深色模式通过 dark: 前缀，所有主题变量需同时覆盖 :root 与 .dark 两套值
5. 动画统一在 tailwind.config.js 的 keyframes/animation 中注册，组件内仅引用命名动画