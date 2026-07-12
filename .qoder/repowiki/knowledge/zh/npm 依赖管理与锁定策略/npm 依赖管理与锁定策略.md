---
kind: dependency_management
name: npm 依赖管理与锁定策略
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - vite.config.ts
---

本项目采用标准的 npm 生态进行依赖管理，核心由 package.json 与 package-lock.json 构成。

- 包管理器：使用 npm（根目录存在 package-lock.json，lockfileVersion=3），未使用 yarn、pnpm 或 pnpm-lock.yaml。
- 版本范围策略：所有依赖均使用 ^ 前缀的 caret 语义化版本（如 react: ^19.2.0、vite: ^7.2.4），允许小版本/补丁自动升级，但禁止跨主版本升级；仅 TypeScript 使用 ~5.9.3 的波浪号约束以固定补丁级。
- 依赖分类：通过 dependencies 与 devDependencies 明确区分运行时与开发期依赖，无 peerDependencies 声明。
- 锁文件：package-lock.json 被提交至仓库，确保团队与 CI 安装结果一致。
- 私有源/代理：未发现 .npmrc、.yarnrc 等配置文件，也未在 package.json 中配置 publishConfig.registry，表明直接使用默认 npm 官方源，无私有仓库或镜像配置。
- Vendoring：node_modules/ 存在于仓库树中，但按惯例不应纳入版本控制；项目未使用 --frozen-lockfile 或任何 vendoring 工具。
- 构建集成：vite.config.ts 中通过 resolve.alias 将 @ 映射到 ./src，属于模块解析别名而非依赖替换；无自定义 resolver 或插件用于重写第三方包来源。
- 脚本约定：build 脚本先执行 tsc -b 再 vite build，类型检查作为构建前置步骤，保证依赖类型声明可用。

开发者应遵循的规则：
1. 新增依赖统一放入 dependencies 或 devDependencies，避免混用。
2. 使用 ^ 语义化版本，仅在确需锁定补丁时使用 ~。
3. 修改 package.json 后必须重新生成 package-lock.json 并提交。
4. 不手动编辑 package-lock.json，通过 npm install / npm update 维护。
5. 如需引入私有包，应在团队环境配置全局 .npmrc 或使用环境变量 NPM_CONFIG_REGISTRY，而非写入仓库配置。