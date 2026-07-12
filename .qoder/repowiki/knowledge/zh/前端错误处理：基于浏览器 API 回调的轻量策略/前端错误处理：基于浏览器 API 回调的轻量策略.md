---
kind: error_handling
name: 前端错误处理：基于浏览器 API 回调的轻量策略
category: error_handling
scope:
    - '**'
source_files:
    - src/sections/TTSDemo.tsx
    - src/main.tsx
    - src/App.tsx
---

本仓库为 Vite + React 19 单页官网，未实现统一的前端错误处理体系（无全局 ErrorBoundary、无自定义错误类型、无 try/catch 包装层、无中间件）。错误处理以“就近处理”为原则，仅在涉及外部浏览器 API 的组件内通过原生回调进行降级与状态恢复。

已发现的实践集中在 `src/sections/TTSDemo.tsx`：
- 使用 `SpeechSynthesisUtterance.onerror` 回调在语音合成出错时重置 `isSpeaking` / `isPaused` / `highlightIndex` 等 UI 状态，避免界面卡死。
- 通过 `window.speechSynthesis.onvoiceschanged` 异步加载声音列表，并在 `useEffect` 清理函数中置空监听器，防止内存泄漏。
- 对不支持 Speech Synthesis 的浏览器直接渲染降级提示文本，而非抛出异常。

其余模块（App、main、各 sections/hooks/lib）均未出现 `try/catch`、`throw`、`Error` 构造或 Promise `.catch` 等模式，说明该仓库当前不依赖运行时错误捕获机制。