本项目为基于 Vite + React 19 的单页官网，不存在后端运行时配置系统（无 .env、application.properties、config/ 目录等），其“配置”集中在构建期与样式主题层面，由以下文件共同构成：

- **构建与路径别名**：`vite.config.ts` 通过 `defineConfig` 暴露 Vite 配置，设置 `base: './'`、注册 `@vitejs/plugin-react`，并定义 `@` → `./src` 的模块别名；`tsconfig.json` 同步声明 `paths.@/*` 以对齐 IDE 与 tsc。
- **样式主题系统**：`tailwind.config.js` 启用 `darkMode: "class"`，在 `theme.extend` 中集中扩展字体族、颜色（全部映射到 CSS 变量如 `--primary`）、圆角、阴影、keyframes 与动画；`postcss.config.js` 仅串联 tailwindcss 与 autoprefixer。
- **CSS 变量与品牌色**：`src/index.css` 在 `:root` / `.dark` 下定义完整的 HSL 语义变量，其中注释明确标注荔枝红品牌主色 `#D44B3D`（对应 `--primary: 6 63% 54%`），并通过 `@layer base` 将 `border-border`、`bg-background` 等 Tailwind 类绑定到这些变量。
- **组件库脚手架配置**：`components.json` 是 shadcn/ui 的初始化配置，指定 style="new-york"、tsx、tailwind 入口为 `src/index.css`、baseColor="slate"、cssVariables=true，并维护 `aliases`（`@/components/ui`、`@/lib/utils` 等）。
- **依赖与脚本**：`package.json` 通过 scripts 暴露 `dev/build/lint/preview`，依赖中包含 Radix UI 全量组件、zod、date-fns、recharts、sonner 等，但所有运行期行为均通过静态配置与 CSS 变量驱动，无运行时环境变量注入逻辑。

**开发者约定**
- 新增全局样式或主题色应优先修改 `src/index.css` 中的 CSS 变量，并在 `tailwind.config.js` 的 `theme.extend` 中补充对应的 Tailwind 扩展。
- 新增模块路径别名需同时更新 `vite.config.ts` 与 `tsconfig.json` 的 `paths`，保持两者一致。
- 使用 shadcn/ui 组件时遵循 `components.json` 中定义的 alias 结构，避免直接引用 `node_modules` 下的源码。
- 本项目未引入任何运行时配置加载机制（无 `.env*`、无 `import.meta.env` 使用），如需接入环境变量应在 `vite.config.ts` 中通过 `defineConfig` 的 `envPrefix` 等方式显式暴露。