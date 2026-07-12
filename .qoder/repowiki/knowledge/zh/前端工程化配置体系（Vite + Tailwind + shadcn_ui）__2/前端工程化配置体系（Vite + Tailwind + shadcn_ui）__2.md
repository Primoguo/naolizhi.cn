---
kind: configuration_system
name: 前端工程化配置体系（Vite + Tailwind + shadcn/ui）
category: configuration_system
scope:
    - '**'
source_files:
    - vite.config.ts
    - tailwind.config.js
    - postcss.config.js
    - components.json
    - package.json
    - tsconfig.json
    - eslint.config.js
---

本项目为基于 Vite + React 19 的单页官网，未实现运行时配置系统（无 .env、无环境变量加载逻辑、无 feature flag），所有“配置”集中在构建期与样式层。核心配置由以下文件组成：

- 构建与插件：`vite.config.ts` 定义 base、React 插件与 `@/src` 别名；`postcss.config.js` 串联 tailwindcss 与 autoprefixer。
- 依赖与脚本：`package.json` 声明 dev/build/lint/preview 脚本及全部依赖，type=module 驱动 ESM 风格配置。
- TypeScript：根 `tsconfig.json` 通过 references 聚合 `tsconfig.app.json` / `tsconfig.node.json`，并在 compilerOptions.paths 中声明 `@/*` → `./src/*`，与 vite alias 保持一致。
- 样式主题：`tailwind.config.js` 通过 CSS 变量（`hsl(var(--primary))` 等）+ `darkMode: "class"` 实现主题切换；`components.json` 配置 shadcn/ui 的 new-york 风格、lucide 图标库与路径别名映射。
- 代码质量：`eslint.config.js` 采用 flat config，启用 recommended + react-hooks + react-refresh + globals.browser。

约定与约束：
- 路径别名统一使用 `@/` 前缀，在 tsconfig 与 vite.config 两处同步维护。
- 主题色、圆角、阴影等设计令牌以 CSS 变量形式注入，Tailwind 仅做引用，避免硬编码颜色值。
- 项目未引入运行时配置机制，如需接入环境变量应优先使用 Vite 的 `import.meta.env.*` 并在 vite.config 中显式暴露，同时保持与现有 ESM 风格一致。