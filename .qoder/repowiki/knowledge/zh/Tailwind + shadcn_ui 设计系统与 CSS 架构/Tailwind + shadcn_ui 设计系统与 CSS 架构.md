---
kind: frontend_style
name: Tailwind + shadcn/ui 设计系统与 CSS 架构
category: frontend_style
scope:
    - '**'
source_files:
    - tailwind.config.js
    - src/index.css
    - src/App.css
    - components.json
---

## 体系概览
本项目采用 Tailwind CSS 作为原子化样式框架，结合 shadcn/ui 组件库与 CSS 自定义属性（CSS Variables）构建统一的设计系统。通过 `components.json` 配置 shadcn/ui 的 New York 风格、TypeScript 支持以及路径别名，所有 UI 组件均基于 Radix Primitive 实现无头可访问性。

## 核心文件与职责
- `tailwind.config.js`：主题扩展（字体、颜色、圆角、阴影、动画 keyframes）、darkMode 使用 class 策略、引入 `tailwindcss-animate` 插件
- `src/index.css`：全局样式入口，定义 CSS 变量色板（明/暗两套）、@layer base/components/utilities 分层、滚动入场动画、聚光灯光晕、prefers-reduced-motion 无障碍兜底
- `src/App.css`：Hero 区域专用样式（标题词高亮、徽章脉冲、轨道动画等），包含大量 @keyframes 定义
- `components.json`：shadcn/ui 项目级配置，声明 style/new-york、tsx、lucide 图标库、路径别名映射

## 设计令牌（Design Tokens）
所有视觉变量以 HSL 形式通过 CSS 自定义属性暴露，遵循 shadcn/ui 命名约定：
- 基础色板：`--background` / `--foreground` / `--card` / `--popover` / `--border` / `--input` / `--ring`
- 语义色板：`--primary`（荔枝红 #D44B3D，HSL 6 63% 54%）、`--secondary`、`--muted`、`--accent`、`--destructive`
- 侧边栏色板：`--sidebar-*` 系列变量
- 通用变量：`--radius: 0.75rem` 控制圆角基准
- 明暗模式：`:root` 与 `.dark` 两套变量，通过 class 切换

在 Tailwind 中通过 `hsl(var(--xxx))` 引用这些变量，确保主题一致性。

## 字体与排版
- 主字体：Inter（英文数字）+ Noto Sans SC（中文），通过 Google Fonts 加载 400–900 字重
- Tailwind 中通过 `fontFamily.sans` 覆盖默认 sans 族，保证中英文混排一致

## 动画与交互系统
- 全局动画集中在 `src/index.css` 的 `@layer utilities` 下，提供 reveal、stagger、flow-pulse、line-flow、typing-effect、spotlight-glow 等可复用类名
- Hero 区域复杂动效（badge-pulse、orbit-in-*、progress-flow/dot、horizon-pulse）保留在 `App.css` 中，避免污染全局层
- 所有动画均提供 `prefers-reduced-motion: reduce` 降级方案，禁用或简化为瞬时过渡
- 使用 `cubic-bezier(0.16, 1, 0.3, 1)` 作为默认缓动曲线，营造流畅的 Material-style 动效

## 响应式与可访问性
- 断点策略完全依赖 Tailwind 内置断点（sm/md/lg/xl/2xl）
- 通过 `use-mobile.ts` hook 配合 `@media (max-width: ...)` 查询实现 JS 侧响应式逻辑
- 聚光灯效果通过 CSS 变量 `--x` / `--y` 动态追踪鼠标位置，无需额外 JS 计算
- 所有交互元素遵循 prefers-reduced-motion 规范，自动降级为静态展示

## 开发者约定
1. 新增颜色必须走 CSS 变量 → Tailwind 扩展 → 组件使用的链路，禁止硬编码色值
2. 通用动画优先放入 `index.css` 的 `@layer utilities`，页面专属动画放在对应模块 CSS
3. 使用 shadcn/ui 组件时通过 className 组合 Tailwind 类，不直接修改组件源码
4. 深色模式通过给根节点添加 `.dark` class 切换，新组件需同时适配明暗变量
5. 所有动画需提供 reduced-motion 降级，尊重用户系统偏好