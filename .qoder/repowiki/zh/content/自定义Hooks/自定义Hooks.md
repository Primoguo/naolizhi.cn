# 自定义Hooks

<cite>
**本文引用的文件**   
- [use-magnetic.ts](file://src/hooks/use-magnetic.ts)
- [use-mobile.ts](file://src/hooks/use-mobile.ts)
- [use-scroll-reveal.ts](file://src/hooks/use-scroll-reveal.ts)
- [use-spotlight.ts](file://src/hooks/use-spotlight.ts)
- [CTA.tsx](file://src/sections/CTA.tsx)
- [Features.tsx](file://src/sections/Features.tsx)
- [Navbar.tsx](file://src/sections/Navbar.tsx)
- [index.css](file://src/index.css)
</cite>

## 目录
1. [简介](#简介)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构总览](#架构总览)
5. [详细组件分析](#详细组件分析)
6. [依赖关系分析](#依赖关系分析)
7. [性能考虑](#性能考虑)
8. [故障排查指南](#故障排查指南)
9. [结论](#结论)
10. [附录](#附录)

## 简介
本文件为挠荔枝官网的自定义 Hooks 提供系统化文档，覆盖以下能力：
- 聚光灯效果（鼠标跟随光晕）
- 滚动显示动画（进入视口触发淡入上移）
- 磁性吸附（按钮随鼠标偏移）
- 移动端检测（基于断点的响应式状态）

文档将逐一说明每个 Hook 的实现原理、参数与返回值、使用场景、集成模式、组合方式、性能优化建议、常见问题与调试技巧，并提供可视化图示帮助理解。

## 项目结构
这些 Hook 位于 src/hooks 目录下，并在多个页面区块中使用，配合全局样式实现动效。

```mermaid
graph TB
subgraph "Hooks"
A["use-magnetic.ts"]
B["use-mobile.ts"]
C["use-scroll-reveal.ts"]
D["use-spotlight.ts"]
end
subgraph "Sections"
E["CTA.tsx"]
F["Features.tsx"]
G["Navbar.tsx"]
end
H["index.css"]
A --> E
A --> G
C --> E
C --> F
D --> F
H --> F
H --> E
```

图表来源
- [use-magnetic.ts:1-32](file://src/hooks/use-magnetic.ts#L1-L32)
- [use-mobile.ts:1-20](file://src/hooks/use-mobile.ts#L1-L20)
- [use-scroll-reveal.ts:1-34](file://src/hooks/use-scroll-reveal.ts#L1-L34)
- [use-spotlight.ts:1-21](file://src/hooks/use-spotlight.ts#L1-L21)
- [CTA.tsx:1-65](file://src/sections/CTA.tsx#L1-L65)
- [Features.tsx:1-91](file://src/sections/Features.tsx#L1-L91)
- [Navbar.tsx:1-117](file://src/sections/Navbar.tsx#L1-L117)
- [index.css:80-116](file://src/index.css#L80-L116)

章节来源
- [use-magnetic.ts:1-32](file://src/hooks/use-magnetic.ts#L1-L32)
- [use-mobile.ts:1-20](file://src/hooks/use-mobile.ts#L1-L20)
- [use-scroll-reveal.ts:1-34](file://src/hooks/use-scroll-reveal.ts#L1-L34)
- [use-spotlight.ts:1-21](file://src/hooks/use-spotlight.ts#L1-L21)
- [CTA.tsx:1-65](file://src/sections/CTA.tsx#L1-L65)
- [Features.tsx:1-91](file://src/sections/Features.tsx#L1-L91)
- [Navbar.tsx:1-117](file://src/sections/Navbar.tsx#L1-L117)
- [index.css:80-116](file://src/index.css#L80-L116)

## 核心组件
本节对四个 Hook 进行概览性说明，后续章节再深入展开。

- useMagnetic：为可交互元素添加“磁性”跟随效果，鼠标靠近时元素向鼠标方向轻微偏移，离开后复位。
- useScrollReveal：为元素添加滚动入场动画，当元素进入视口一定比例时触发 CSS 类切换，实现淡入上移等效果。
- useSpotlight：为卡片容器添加鼠标跟随的光晕效果，通过更新 CSS 变量驱动径向渐变背景。
- useIsMobile：基于窗口尺寸断点返回布尔值，用于在移动端/桌面端切换不同行为或 UI。

章节来源
- [use-magnetic.ts:1-32](file://src/hooks/use-magnetic.ts#L1-L32)
- [use-scroll-reveal.ts:1-34](file://src/hooks/use-scroll-reveal.ts#L1-L34)
- [use-spotlight.ts:1-21](file://src/hooks/use-spotlight.ts#L1-L21)
- [use-mobile.ts:1-20](file://src/hooks/use-mobile.ts#L1-L20)

## 架构总览
Hook 与页面组件之间的调用关系如下：

```mermaid
sequenceDiagram
participant U as "用户"
participant N as "Navbar.tsx"
participant M as "useMagnetic"
participant CTA as "CTA.tsx"
participant S as "useSpotlight"
participant F as "Features.tsx"
participant R as "useScrollReveal"
participant CSS as "index.css"
U->>N : 鼠标悬停下载按钮
N->>M : 传入 strength=0.25
M-->>N : 返回 {magRef, onMouseMove, onMouseLeave}
N->>N : 绑定 ref 与事件
Note over N,M : 元素根据鼠标位置计算 transform
U->>F : 鼠标移动至卡片
F->>S : 调用 useSpotlight()
S-->>F : 返回 {spotRef, onMouseMove}
F->>F : 设置 CSS 变量 --x/--y
F->>CSS : 读取 var(--x)/var(--y) 渲染光晕
U->>F : 滚动到功能区域
F->>R : 调用 useScrollReveal(threshold)
R->>R : IntersectionObserver 监听
R-->>F : 进入视口时添加 revealed 类
F->>CSS : 应用 reveal/reveal-stagger 动画
```

图表来源
- [Navbar.tsx:11-26](file://src/sections/Navbar.tsx#L11-L26)
- [use-magnetic.ts:7-31](file://src/hooks/use-magnetic.ts#L7-L31)
- [Features.tsx:34-61](file://src/sections/Features.tsx#L34-L61)
- [use-spotlight.ts:8-20](file://src/hooks/use-spotlight.ts#L8-L20)
- [index.css:104-116](file://src/index.css#L104-L116)
- [Features.tsx:63-91](file://src/sections/Features.tsx#L63-L91)
- [use-scroll-reveal.ts:7-33](file://src/hooks/use-scroll-reveal.ts#L7-L33)
- [index.css:80-103](file://src/index.css#L80-L103)

## 详细组件分析

### useMagnetic（磁性吸附）
- 作用：为锚点或按钮等元素添加磁性跟随效果，提升交互质感。
- 参数：
  - strength：磁力强度，默认 0.3，数值越大偏移越明显。
- 返回值：
  - magRef：指向目标元素的引用。
  - onMouseMove：鼠标移动回调，计算相对中心偏移并设置 transform。
  - onMouseLeave：鼠标离开回调，重置 transform。
- 使用场景：导航栏下载按钮、CTA 区域的 App Store 按钮等需要强调的交互元素。
- 集成要点：
  - 将 magRef 绑定到目标元素。
  - 同时绑定 onMouseMove 和 onMouseLeave。
  - 建议在父级元素上避免其他 transform 冲突，或在业务层合并 transform。
- 示例路径：
  - [Navbar.tsx:11-26](file://src/sections/Navbar.tsx#L11-L26)
  - [CTA.tsx:28-42](file://src/sections/CTA.tsx#L28-L42)

```mermaid
flowchart TD
Start(["鼠标进入元素"]) --> GetRect["获取元素矩形与中心点"]
GetRect --> CalcDelta["计算鼠标相对中心的 dx/dy"]
CalcDelta --> ApplyTransform["设置 transform: translate(dx*strength, dy*strength)"]
ApplyTransform --> End(["保持跟随直到离开"])
End --> Leave{"鼠标离开?"}
Leave --> |是| Reset["重置 transform 为 0,0"]
Leave --> |否| ApplyTransform
```

图表来源
- [use-magnetic.ts:10-28](file://src/hooks/use-magnetic.ts#L10-L28)

章节来源
- [use-magnetic.ts:1-32](file://src/hooks/use-magnetic.ts#L1-L32)
- [Navbar.tsx:11-26](file://src/sections/Navbar.tsx#L11-L26)
- [CTA.tsx:28-42](file://src/sections/CTA.tsx#L28-L42)

### useSpotlight（聚光灯效果）
- 作用：为卡片容器添加鼠标跟随的光晕效果，通过 CSS 变量驱动径向渐变。
- 参数：无。
- 返回值：
  - spotRef：指向卡片容器的引用。
  - onMouseMove：鼠标移动回调，计算光标相对于容器的坐标并设置 CSS 变量 --x 与 --y。
- 使用场景：功能卡片、特性展示区等需要聚焦感知的交互区域。
- 集成要点：
  - 将 spotRef 绑定到外层容器。
  - 在容器内放置一个绝对定位的“光晕层”，使用 radial-gradient 以 var(--x)/var(--y) 作为圆心。
  - 可通过 CSS 控制光晕半径、颜色与透明度。
- 示例路径：
  - [Features.tsx:34-61](file://src/sections/Features.tsx#L34-L61)
  - [index.css:104-116](file://src/index.css#L104-L116)

```mermaid
classDiagram
class UseSpotlight {
+spotRef
+onMouseMove(event)
}
class FeatureCard {
+spotRef
+onMouseMove
}
UseSpotlight <.. FeatureCard : "被使用"
```

图表来源
- [use-spotlight.ts:8-20](file://src/hooks/use-spotlight.ts#L8-L20)
- [Features.tsx:34-61](file://src/sections/Features.tsx#L34-L61)

章节来源
- [use-spotlight.ts:1-21](file://src/hooks/use-spotlight.ts#L1-L21)
- [Features.tsx:34-61](file://src/sections/Features.tsx#L34-L61)
- [index.css:104-116](file://src/index.css#L104-L116)

### useScrollReveal（滚动显示动画）
- 作用：当元素进入视口达到指定阈值时，为其添加 “revealed” 类，从而触发 CSS 过渡动画。
- 参数：
  - threshold：触发比例，默认 0.15，表示元素可见 15% 时触发。
- 返回值：
  - ref：指向目标元素的引用。
- 使用场景：区块标题、卡片列表等希望“滚动进入时出现”的元素。
- 集成要点：
  - 将 ref 绑定到目标元素。
  - 在 CSS 中定义初始状态（如 opacity: 0; transform: translateY(...)）与 .revealed 的最终状态。
  - 对于子元素延迟入场，可使用 .reveal-stagger 配合 nth-child 的 transition-delay。
- 示例路径：
  - [Features.tsx:63-91](file://src/sections/Features.tsx#L63-L91)
  - [index.css:80-103](file://src/index.css#L80-L103)

```mermaid
flowchart TD
Init(["初始化 IntersectionObserver"]) --> Observe["观察目标元素"]
Observe --> CheckIntersect{"是否相交(进入视口)?"}
CheckIntersect --> |否| Wait["继续观察"]
CheckIntersect --> |是| AddClass["为目标元素添加 'revealed' 类"]
AddClass --> Unobserve["停止观察该元素(仅触发一次)"]
Unobserve --> Done(["完成"])
```

图表来源
- [use-scroll-reveal.ts:12-30](file://src/hooks/use-scroll-reveal.ts#L12-L30)
- [index.css:80-103](file://src/index.css#L80-L103)

章节来源
- [use-scroll-reveal.ts:1-34](file://src/hooks/use-scroll-reveal.ts#L1-L34)
- [Features.tsx:63-91](file://src/sections/Features.tsx#L63-L91)
- [index.css:80-103](file://src/index.css#L80-L103)

### useIsMobile（移动端检测）
- 作用：基于窗口宽度断点返回布尔值，便于在不同设备下切换逻辑或 UI。
- 参数：无。
- 返回值：
  - isMobile：当前是否为移动端（true/false）。
- 使用场景：条件渲染、禁用某些桌面专属交互、调整布局策略等。
- 集成要点：
  - 断点常量可在 Hook 内部维护，也可抽离为配置项。
  - 若需更细粒度控制，可结合多组媒体查询或使用第三方库。
- 示例路径：
  - [use-mobile.ts:1-20](file://src/hooks/use-mobile.ts#L1-L20)

```mermaid
stateDiagram-v2
[*] --> 初始化
初始化 --> 监听变化 : "注册 matchMedia 监听"
监听变化 --> 判断宽度 : "window.innerWidth < 断点"
判断宽度 --> 移动端 : "true"
判断宽度 --> 非移动端 : "false"
移动端 --> 监听变化 : "窗口大小变化"
非移动端 --> 监听变化 : "窗口大小变化"
```

图表来源
- [use-mobile.ts:5-19](file://src/hooks/use-mobile.ts#L5-L19)

章节来源
- [use-mobile.ts:1-20](file://src/hooks/use-mobile.ts#L1-L20)

## 依赖关系分析
- Hook 之间相互独立，无直接依赖关系，可按需组合使用。
- 与 CSS 的耦合点：
  - useScrollReveal 依赖 .reveal 与 .reveal-stagger 的样式定义。
  - useSpotlight 依赖 CSS 变量 --x/--y 与径向渐变光晕层。
- 与 DOM 事件的耦合点：
  - useMagnetic 与 useSpotlight 均依赖 mousemove/mouseleave 事件。
- 与浏览器 API 的耦合点：
  - useScrollReveal 使用 IntersectionObserver。
  - useIsMobile 使用 window.matchMedia。

```mermaid
graph LR
MR["use-magnetic.ts"] --> EVT["DOM 事件<br/>mousemove/mouseleave"]
SP["use-spotlight.ts"] --> EVT
SR["use-scroll-reveal.ts"] --> IO["IntersectionObserver"]
MB["use-mobile.ts"] --> MM["matchMedia"]
SR --> CSS["index.css(.reveal/.reveal-stagger)"]
SP --> CSSV["index.css(CSS 变量与光晕)"]
```

图表来源
- [use-magnetic.ts:10-28](file://src/hooks/use-magnetic.ts#L10-L28)
- [use-spotlight.ts:11-17](file://src/hooks/use-spotlight.ts#L11-L17)
- [use-scroll-reveal.ts:12-30](file://src/hooks/use-scroll-reveal.ts#L12-L30)
- [use-mobile.ts:8-16](file://src/hooks/use-mobile.ts#L8-L16)
- [index.css:80-116](file://src/index.css#L80-L116)

章节来源
- [use-magnetic.ts:1-32](file://src/hooks/use-magnetic.ts#L1-L32)
- [use-spotlight.ts:1-21](file://src/hooks/use-spotlight.ts#L1-L21)
- [use-scroll-reveal.ts:1-34](file://src/hooks/use-scroll-reveal.ts#L1-L34)
- [use-mobile.ts:1-20](file://src/hooks/use-mobile.ts#L1-L20)
- [index.css:80-116](file://src/index.css#L80-L116)

## 性能考虑
- 事件节流/防抖：
  - mousemove 频率较高，建议在业务层对 onmousemove 做节流处理，降低重排与重绘压力。
- 减少不必要的 reflow：
  - 尽量只修改 transform 与 opacity，避免频繁读写布局属性。
- IntersectionObserver 的使用：
  - 已实现“仅触发一次”的 unobserve，避免重复监听带来的开销。
- CSS 变量与 GPU 加速：
  - 聚光灯效果通过 CSS 变量与径向渐变实现，GPU 友好；确保光晕层为绝对定位且 pointer-events: none，避免命中测试影响性能。
- 移动端适配：
  - 在移动端可考虑关闭部分动效（例如磁性吸附），以提升流畅度与续航。

[本节为通用指导，不直接分析具体文件]

## 故障排查指南
- 磁吸效果未生效
  - 检查是否正确绑定 magRef 与 onMouseMove/onMouseLeave。
  - 确认目标元素未被父级 transform 覆盖导致位移异常。
  - 参考路径：[Navbar.tsx:11-26](file://src/sections/Navbar.tsx#L11-L26)、[CTA.tsx:28-42](file://src/sections/CTA.tsx#L28-L42)
- 聚光灯光晕不跟随
  - 确认 spotRef 绑定到外层容器，而非内容块。
  - 检查 CSS 变量 --x/--y 是否被正确设置，以及光晕层是否使用了 var(--x)/var(--y)。
  - 参考路径：[Features.tsx:34-61](file://src/sections/Features.tsx#L34-L61)、[index.css:104-116](file://src/index.css#L104-L116)
- 滚动动画不触发
  - 检查目标元素是否设置了正确的类名（如 reveal 或 reveal-stagger）。
  - 确认 threshold 合理，必要时调大阈值以便快速触发。
  - 参考路径：[use-scroll-reveal.ts:12-30](file://src/hooks/use-scroll-reveal.ts#L12-L30)、[index.css:80-103](file://src/index.css#L80-L103)
- 移动端检测不准确
  - 确认断点值是否符合预期，必要时在组件中打印 isMobile 验证。
  - 参考路径：[use-mobile.ts:5-19](file://src/hooks/use-mobile.ts#L5-L19)

章节来源
- [Navbar.tsx:11-26](file://src/sections/Navbar.tsx#L11-L26)
- [CTA.tsx:28-42](file://src/sections/CTA.tsx#L28-L42)
- [Features.tsx:34-61](file://src/sections/Features.tsx#L34-L61)
- [use-scroll-reveal.ts:12-30](file://src/hooks/use-scroll-reveal.ts#L12-L30)
- [index.css:80-116](file://src/index.css#L80-L116)
- [use-mobile.ts:5-19](file://src/hooks/use-mobile.ts#L5-L19)

## 结论
这四个 Hook 分别解决了常见的交互与动效需求：磁性吸附增强点击引导，聚光灯提升视觉焦点，滚动入场改善信息节奏，移动端检测支撑差异化体验。它们彼此独立、易于组合，并与 CSS 紧密协作，形成轻量而高效的交互体系。在实际项目中，建议结合性能优化与错误排查清单，按需启用与定制，以获得最佳的用户体验。

[本节为总结性内容，不直接分析具体文件]

## 附录
- 组合使用建议
  - 在功能卡片区域同时使用 useSpotlight 与 useScrollReveal：先通过滚动入场展示卡片，再在卡片上叠加聚光灯效果。
  - 在导航栏与 CTA 区域使用 useMagnetic：强化关键行动按钮的吸引力。
  - 在需要区分移动端行为的区域引入 useIsMobile：例如在移动端隐藏复杂动效或简化交互。
- 扩展思路
  - 为 useMagnetic 增加阻尼与回弹曲线，使运动更自然。
  - 为 useScrollReveal 支持多种入场动画类型（淡入、缩放、滑入等）。
  - 为 useSpotlight 支持多光源与动态半径。
  - 为 useIsMobile 支持多断点与媒体查询组合。

[本节为概念性内容，不直接分析具体文件]