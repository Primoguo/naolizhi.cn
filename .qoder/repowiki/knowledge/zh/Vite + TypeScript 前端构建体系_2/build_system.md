本项目采用 Vite 7 作为核心构建工具，配合 TypeScript 5.9、ESLint 9（flat config）和 Tailwind CSS 3.4 组成的现代前端工程化方案。

## 构建流程与脚本

- `npm run dev`：启动 Vite 开发服务器，支持热重载
- `npm run build`：先执行 `tsc -b` 进行增量类型检查，再调用 `vite build` 打包产物到 `dist/`
- `npm run lint`：基于 ESLint flat config 对 `.ts/.tsx` 文件执行静态检查
- `npm run preview`：本地预览生产构建产物

TypeScript 使用 Project References 模式拆分两个配置：
- `tsconfig.app.json`：应用代码，target ES2022，启用 `verbatimModuleSyntax`、`moduleDetection: force`、`noEmit` 等严格选项
- `tsconfig.node.json`：构建脚本（仅 `vite.config.ts`），target ES2023

## 构建配置要点

- `vite.config.ts` 中通过 `base: './'` 输出相对路径，便于直接部署到任意子路径；同时配置 `@/*` → `./src` 的模块别名
- `tailwind.config.js` 开启 `darkMode: 'class'`，并通过 CSS 变量映射主题色板，扩展了字体、圆角、阴影、动画等设计令牌
- `postcss.config.js` 串联 tailwindcss 与 autoprefixer
- `components.json` 集成 shadcn/ui，约定组件位于 `@/components/ui`，工具函数位于 `@/lib/utils`

## 依赖管理

所有运行时与开发依赖均声明在 `package.json` 中，锁定版本由 `package-lock.json` 管理。项目为纯前端单页应用，无后端或跨平台编译需求，因此不存在 Makefile、Dockerfile、CI 流水线或发布脚本——构建产物即为 `dist/` 目录下的静态资源。

## 开发者约定

- 新增页面/组件放在 `src/pages` 或 `src/components`，通过 `@/` 别名导入
- 样式统一走 Tailwind 原子类，自定义主题通过 CSS 变量在 `index.css` 中定义
- 类型检查与 Lint 在 `build` 阶段强制执行，提交前可单独运行 `lint` 自检