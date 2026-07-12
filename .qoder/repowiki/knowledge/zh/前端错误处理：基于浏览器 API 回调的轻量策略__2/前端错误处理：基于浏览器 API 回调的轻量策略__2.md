---
kind: error_handling
name: 前端错误处理：基于浏览器 API 回调的轻量策略
category: error_handling
scope:
    - '**'
source_files:
    - src/sections/TTSDemo.tsx
---

本仓库为纯前端单页官网（Vite + React），未引入任何后端服务、中间件或统一错误框架。全局范围内未发现 `try/catch`、自定义 Error 类型、错误码定义或 panic/recover 等模式，仅有一处针对浏览器 Web Speech API 的异步事件回调错误处理。

- **唯一错误处理点**：`src/sections/TTSDemo.tsx` 中通过 `SpeechSynthesisUtterance.onerror` 回调在语音合成出错时重置播放状态（`setIsSpeaking(false)`、`setIsPaused(false)`、`setHighlightIndex(-1)`），属于“失败即降级”的 UI 状态恢复策略。
- **能力检测式容错**：组件在渲染前检查 `window.speechSynthesis` 是否可用，不可用时直接返回友好提示文本，避免抛出异常。
- **无全局错误边界**：项目中没有 `ErrorBoundary`、`window.onerror` 监听或第三方错误上报 SDK，意味着未捕获的运行时错误会直接导致页面白屏。
- **无业务层错误模型**：由于项目不包含网络请求、表单校验或业务逻辑分支，不存在需要结构化传播的错误对象或错误码体系。

结论：该仓库在当前阶段无需统一的 error_handling 系统；若后续引入 API 调用或复杂交互，建议补充 React Error Boundary 与可观测性上报。