本项目采用基于 Vite 7 的现代前端构建方案，围绕 React 19 单页官网进行工程化配置。

## 构建工具链与脚本

- 核心构建器：Vite 7（vite.config.ts），使用 @vitejs/plugin-react 插件支持 JSX/TSX。
- TypeScript 编译：通过 tsc -b 联合项目模式执行增量类型检查，再交由 Vite 打包；tsconfig.json 聚合 tsconfig.app.json（应用代码）和 tsconfig.node.json（Node 侧）。
- 包脚本（package.json scripts）：
  - dev：启动 Vite 开发服务器
  - build：先 tsc -b 做类型检查，再 vite build 产出静态资源到 dist/
  - lint：运行 ESLint
  - preview：本地预览构建产物

## 模块解析与别名

- Vite 与 TS 双端均配置了 @/* → ./src/* 路径别名，保证 IDE、编译器与运行时一致。
- TS 使用 moduleResolution: bundler + verbatimModuleSyntax + moduleDetection: force 等严格选项，并开启 noUnusedLocals、noUnusedParameters、erasableSyntaxOnly、noUncheckedSideEffectImports 等强约束。

## 样式与 CSS 处理

- Tailwind CSS 3.4：tailwind.config.js 中扩展字体族（Inter / Noto Sans SC）、颜色 token（HSL CSS 变量）、圆角、阴影、keyframes 与动画，并通过 darkMode: ["class"] 支持暗色切换。
- PostCSS：postcss.config.js 串联 tailwindcss 与 autoprefixer。
- 组件库采用 Radix UI + shadcn/ui 风格（components.json 存在），配合 class-variance-authority、clsx、tailwind-merge 管理类名组合。

## 代码质量

- ESLint Flat Config（eslint.config.js）：启用 @eslint/js、typescript-eslint recommended、react-hooks、react-refresh，忽略 dist/，目标 ECMAScript 2020，全局暴露浏览器 API。

## 产物与部署

- 构建输出目录为根级 dist/，Vite base: './' 使资源以相对路径引用，适合直接部署到任意静态站点托管（如 GitHub Pages、Nginx 静态目录）。
- 无 Dockerfile、CI 流水线或 Makefile，发布流程依赖手动 npm run build 后上传 dist/。

## 开发者约定

- 新增页面放在 src/pages/，可复用 UI 组件放 src/components/ui/，业务区块放 src/sections/，自定义 Hook 放 src/hooks/。
- 所有 import 统一使用 @/ 别名，避免深层相对路径。
- 样式一律走 Tailwind 原子类 + CSS 变量主题，不手写独立 CSS 文件（除入口 index.css、App.css）。