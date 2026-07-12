---
kind: error_handling
name: 前端静默降级与 API 可用性检测
category: error_handling
scope:
    - '**'
source_files:
    - src/lib/webgpu.ts
    - src/sections/TTSDemo.tsx
    - src/App.tsx
---

该仓库为纯前端静态展示站点（React + WebGPU），不存在服务端中间件、统一错误码或自定义 Error 类型体系。全局错误处理策略以“静默降级 + 运行时能力检测”为主，具体体现在以下模式：

1. **WebGPU 能力回退**：`src/lib/webgpu.ts` 的 `requestWebGPU` 使用 try/catch 包裹 `navigator.gpu.requestAdapter/requestDevice`，失败时返回 `null`；调用方据此决定是否渲染流体背景，实现无报错降级。
2. **TTS 功能容错**：`src/sections/TTSDemo.tsx` 在组件内通过 `window.speechSynthesis` 存在性检查设置 `supported` 状态，不支持时直接渲染提示文案；对 `SpeechSynthesisUtterance.onerror` 仅重置 UI 状态而不抛出异常。
3. **无全局错误边界**：`App.tsx` 未使用 React Error Boundary，也没有 `ErrorBoundary` 组件，意味着子组件抛出的同步/异步错误会冒泡至浏览器默认错误页。
4. **无集中日志/上报**：未发现 Sentry、LogRocket 等第三方错误追踪库，也未见 `console.error` 封装或结构化日志输出。
5. **无 Promise reject 统一处理**：所有异步操作均通过返回值（如 `null`）或事件回调表达失败路径，未使用 `Promise.reject` 或全局 `unhandledrejection` 监听。

结论：本仓库采用“按模块就地捕获并降级”的轻量策略，适合静态展示站点的简单场景，但不具备跨模块的错误传播、分类与可观测性能力。