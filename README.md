# 挠荔枝 Knowledge

挠荔枝 Knowledge 是一款 iOS 有声阅读器 App 的产品官网。

> **用耳朵，读世界**  
> 导入 PDF、Word、网页或电子书，挠荔枝将它变成你的专属有声书。

[🌐 在线预览](https://naolizhi.cn) · [📱 App Store 下载](https://apps.apple.com/app/id6742556743)

---

## 功能特性

- **多格式导入**：PDF、EPUB、Word、Excel、PPT、Markdown、TXT、网页链接
- **智能朗读**：18 种语言自动检测，阅读位置实时高亮跟随
- **AI 总结**：一键生成文档摘要，快速掌握核心内容
- **AI 伴读**：智能问答，深度理解文档
- **随心配置**：8 档语速、音高、音量，明暗主题切换
- **网页一键朗读**：Safari 分享扩展直接发送到 App
- **后台播放**：锁屏后继续朗读，支持锁屏控件

## 技术栈

- **框架**：React 19
- **语言**：TypeScript
- **构建**：Vite 7
- **样式**：Tailwind CSS 3
- **UI 组件**：shadcn/ui
- **动画**：Canvas 2D 粒子系统 + WebGL 流体背景
- **图标**：Lucide React

## 视觉特色

- **HomePod 风格粒子动画**：Knowledge 文字由数千粒子组成，具有音乐律动感的呼吸效果
- **字母级独立律动**：每个字母拥有独立的 BPM 偏移、节拍相位和摇摆感
- **WebGL 流体背景**：沉浸式动态背景效果
- **逐字流动标语**：文字逐字入场动画
- **纯灰阶粒子色彩**：60% 亮白 / 25% 中灰 / 15% 深灰

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
.
├── index.html               # 入口 HTML（含 SEO / OG 元数据）
├── deploy.sh                # 部署脚本
├── src/
│   ├── App.tsx              # 根组件
│   ├── sections/            # Landing Page 页面区块
│   │   ├── Hero.tsx         # 首屏（含手机模型 + 粒子动画）
│   │   ├── Features.tsx     # 功能特性
│   │   ├── Highlights.tsx   # 功能亮点
│   │   ├── CTA.tsx          # 下载引导
│   │   ├── Footer.tsx       # 页脚（含 ICP 备案）
│   │   └── Navbar.tsx       # 导航栏
│   ├── components/
│   │   ├── ParticleText.tsx  # 粒子文字动画组件
│   │   └── ui/              # shadcn/ui 组件库
│   └── hooks/               # 自定义 Hooks
├── public/                  # 静态资源（logo、OG 图片、favicon）
└── package.json
```

## 部署

站点部署在阿里云 ECS（Ubuntu 24.04），使用 Nginx + Let's Encrypt SSL。

```bash
# 一键部署
./deploy.sh
```

- **域名**：naolizhi.cn
- **服务器**：47.93.160.137
- **SSL**：Let's Encrypt 自动续期
- **备案**：沪ICP备2026030941号-1

## 品牌

- 品牌色：**荔枝红** `#D44B3D`
- 主题：默认深色
- 平台要求：iOS 17.0+

---

© 2026 挠荔枝 Knowledge. All rights reserved.
# 挠荔枝 Knowledge

挠荔枝 Knowledge 是一款 iOS 有声阅读器 App 的产品官网。

> **用耳朵，读世界**  
> 导入 PDF、Word、网页或电子书，挠荔枝将它变成你的专属有声书。

[在线预览](https://naolizhi.cn) · [App Store 下载](https://apps.apple.com/app/id6742556743) · [GitHub](https://github.com/Primoguo/naolizhi.cn)

---

## 功能特性

- **多格式导入**：PDF、EPUB、Word、Excel、PPT、Markdown、TXT、网页链接
- **智能朗读**：18 种语言自动检测，阅读位置实时高亮跟随
- **随心配置**：8 档语速、音高、音量，明暗主题切换
- **网页一键朗读**：Safari 分享扩展直接发送到 App
- **后台播放**：锁屏后继续朗读，支持锁屏控件

## 技术栈

- **框架**：React 19
- **语言**：TypeScript
- **构建**：Vite 7
- **样式**：Tailwind CSS 3
- **UI 组件**：shadcn/ui
- **图标**：Lucide React

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
.
├── index.html          # 入口 HTML（含 SEO / OG 元数据）
├── src/
│   ├── App.tsx         # 根组件
│   ├── sections/       # Landing Page 页面区块
│   └── components/ui/  # shadcn/ui 组件
├── public/             # 静态资源（logo、OG 图片、favicon）
└── package.json
```

## SEO 信息

- **标题**：挠荔枝 Knowledge - 用耳朵阅读，让文档变成有声书
- **描述**：挠荔枝 Knowledge 是一款 iOS 有声阅读器，支持 PDF、EPUB、Word、网页等 9 种格式导入，18 种语言智能朗读。
- **关键词**：有声阅读、文字转语音、TTS、语音朗读、文档朗读、iOS 阅读器、挠荔枝

## 品牌

- 品牌色：**荔枝红** `#D44B3D`
- 主题：默认深色
- 平台要求：iOS 17.0+

---

© 2026 挠荔枝 Knowledge. All rights reserved.
