---
kind: build_system
name: Vite + TypeScript 构建系统
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - tailwind.config.js
    - eslint.config.js
---

本项目采用基于 Vite 7 的现代前端构建方案，配合 TypeScript 5.9 进行类型检查与编译，Tailwind CSS 3.4 负责样式处理。整体构建流程简洁、轻量，适合静态个人展示站点的快速迭代。

## 构建工具链
- **打包器**：Vite 7（`vite.config.ts`），使用 `@vitejs/plugin-react` 插件支持 React JSX/TSX
- **类型检查**：TypeScript 5.9，通过 `tsc -b` 项目引用模式（`tsconfig.json` 引用 `tsconfig.app.json` 和 `tsconfig.node.json`）
- **样式处理**：Tailwind CSS 3.4 + PostCSS + Autoprefixer，自定义主题变量与动画
- **代码质量**：ESLint 9 + typescript-eslint，无额外格式化器集成
- **包管理**：npm（`package-lock.json` 锁定依赖版本）

## 构建脚本
`package.json` 中定义了四个核心命令：
- `dev`: 启动 Vite 开发服务器
- `build`: 先执行 `tsc -b` 类型检查，再调用 `vite build` 生产构建
- `lint`: 运行 ESLint 扫描
- `preview`: 本地预览构建产物

## 路径别名与模块解析
- Vite 与 TypeScript 均配置了 `@/*` → `./src/*` 的绝对路径别名，统一模块导入风格
- `base: './'` 使构建产物适配相对路径部署（如 GitHub Pages、Netlify 子目录等）

## 输出产物
- 构建输出位于根目录 `dist/`（由 Vite 默认配置决定）
- 静态资源存放于 `public/`，构建时原样复制到 `dist/`

## 未覆盖的领域
- 无 Dockerfile、CI/CD 配置文件（`.github/workflows`、`Jenkinsfile`、`Dockerfile` 等均不存在）
- 无 Makefile 或 shell 构建脚本
- 无发布版本号管理策略（`package.json` 中 version 固定为 `0.0.0`）
- 无测试框架集成（无 `vitest`、`jest` 等配置）
- 无多环境构建区分（仅单一 `build` 命令）

该构建系统聚焦于最小化复杂度，适合单人维护的个人站点；若需自动化部署或版本化管理，可在现有基础上扩展 CI 流水线与发布脚本。