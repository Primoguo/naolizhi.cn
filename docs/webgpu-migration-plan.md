# WebGPU 迁移规划：FluidCanvas

## 项目分析

当前 [FluidCanvas.tsx](../src/sections/FluidCanvas.tsx) 使用 WebGL 实现流体模拟，包含：

| 模块 | 内容 |
|------|------|
| **着色器** | 1 个顶点着色器 + 6 个片段着色器（splat、advection、divergence、pressure、gradientSubtract、display） |
| **数据结构** | FBO、DoubleFBO（双缓冲）、Program |
| **渲染目标** | velocity、dye、divergence、pressure（共 4 组纹理） |
| **模拟步骤** | 鼠标交互 → advection → divergence → pressure solve → gradient subtract → display |

## WebGPU vs WebGL 核心差异

| 特性 | WebGL | WebGPU |
|------|-------|--------|
| 着色器语言 | GLSL | WGSL |
| API 风格 | 命令式 | 声明式 + Command Buffer |
| 渲染管线 | 隐式状态机 | 显式 Render Pipeline |
| 计算着色器 | 扩展 | 原生支持 |
| 纹理格式 | 受限 | 灵活（RGBA8、RGBA16Float、R32Float 等） |
| 多视图 | 复杂 | 原生支持 |

## 迁移步骤

### Phase 1：准备与环境搭建（1-2 小时）

**目标**：配置开发环境，确保 WebGPU 可用

1. **安装类型定义**
   ```bash
   npm install -D @webgpu/types
   ```

2. **添加 tsconfig 类型支持**
   ```json
   {
     "compilerOptions": {
       "types": ["@webgpu/types"]
     }
   }
   ```

3. **创建 WebGPU 检测工具**
   ```typescript
   // src/lib/webgpu.ts
   export const isWebGPUSupported = () => {
     return typeof navigator !== 'undefined' && 'gpu' in navigator;
   };

   export const requestWebGPU = async () => {
     if (!isWebGPUSupported()) return null;
     try {
       const adapter = await navigator.gpu.requestAdapter();
       if (!adapter) return null;
       const device = await adapter.requestDevice();
       return { adapter, device };
     } catch {
       return null;
     }
   };
   ```

### Phase 2：基础架构（3-4 小时）

**目标**：创建 WebGPU 上下文、设备、队列、交换链

```typescript
interface WebGPURenderer {
  device: GPUDevice;
  context: GPUCanvasContext;
  queue: GPUQueue;
  format: GPUTextureFormat;
  sampler: GPUSampler;
}

const createRenderer = (canvas: HTMLCanvasElement): WebGPURenderer => {
  const context = canvas.getContext('webgpu');
  const format = navigator.gpu.getPreferredCanvasFormat();
  
  context.configure({
    device,
    format,
    alphaMode: 'premultiplied',
  });
  
  const sampler = device.createSampler({
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
    magFilter: 'linear',
    minFilter: 'linear',
  });
  
  return { device, context, queue: device.queue, format, sampler };
};
```

### Phase 3：着色器迁移（4-6 小时）

**目标**：将 GLSL 转换为 WGSL

#### 3.1 顶点着色器迁移

**GLSL**:
```glsl
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
```

**WGSL**:
```wgsl
@vertex
fn main(@location(0) aPosition: vec2f) -> @builtin(position) vec4f {
  let vUv = aPosition * 0.5 + 0.5;
  let vL = vUv - vec2(texelSize.x, 0.0);
  let vR = vUv + vec2(texelSize.x, 0.0);
  let vT = vUv + vec2(0.0, texelSize.y);
  let vB = vUv - vec2(0.0, texelSize.y);
  return vec4(aPosition, 0.0, 1.0);
}
```

#### 3.2 片段着色器迁移（6 个）

每个着色器需要转换为 WGSL，重点改动：
- `texture2D` → `textureSample`
- `varying` → `@location(n)` in fragment shader
- `uniform` → `@binding(n) @group(0)`
- GLSL 内置函数 → WGSL 内置函数

#### 3.3 计算着色器（可选优化）

WebGPU 原生支持计算着色器，可以将流体模拟的某些步骤（如 pressure solve）改为计算着色器，提升并行性能。

### Phase 4：资源管理（4-5 小时）

**目标**：创建纹理、缓冲区、渲染管线

#### 4.1 创建纹理（替代 FBO）

```typescript
interface TexturePair {
  read: GPUTexture;
  write: GPUTexture;
  swap: () => void;
}

const createTexture = (
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat = 'rgba16float'
): GPUTexture => {
  return device.createTexture({
    size: { width, height },
    format,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });
};

const createTexturePair = (
  device: GPUDevice,
  width: number,
  height: number,
  format?: GPUTextureFormat
): TexturePair => {
  let read = createTexture(device, width, height, format);
  let write = createTexture(device, width, height, format);
  return {
    read,
    write,
    swap: () => { [read, write] = [write, read]; },
  };
};
```

#### 4.2 创建渲染管线

```typescript
const createRenderPipeline = (
  device: GPUDevice,
  vertexShader: string,
  fragmentShader: string,
  format: GPUTextureFormat,
  depthStencil?: GPUDepthStencilState
): GPURenderPipeline => {
  return device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({ code: vertexShader }),
      entryPoint: 'main',
      buffers: [{
        arrayStride: 8,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: 'float32x2',
        }],
      }],
    },
    fragment: {
      module: device.createShaderModule({ code: fragmentShader }),
      entryPoint: 'main',
      targets: [{ format }],
    },
    primitive: {
      topology: 'triangle-list',
    },
    depthStencil,
  });
};
```

#### 4.3 创建绑定组

```typescript
const createBindGroup = (
  device: GPUDevice,
  layout: GPUBindGroupLayout,
  entries: GPUBindGroupEntry[]
): GPUBindGroup => {
  return device.createBindGroup({ layout, entries });
};
```

### Phase 5：渲染管线实现（3-4 小时）

**目标**：实现全屏渲染和帧缓冲切换

#### 5.1 全屏四边形

```typescript
const createFullscreenQuad = (device: GPUDevice): GPUBuffer => {
  const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
  const buffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(buffer.getMappedRange()).set(vertices);
  buffer.unmap();
  return buffer;
};
```

#### 5.2 Blit 函数（渲染到纹理或屏幕）

```typescript
const blit = (
  encoder: GPUCommandEncoder,
  pipeline: GPURenderPipeline,
  bindGroup: GPUBindGroup,
  vertexBuffer: GPUBuffer,
  target: GPUTexture | null,
  width: number,
  height: number
) => {
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: target ? target.createView() : context.getCurrentTexture().createView(),
      loadOp: 'clear',
      clearValue: { r: 0, g: 0, b: 0, a: 0 },
      storeOp: 'store',
    }],
  });
  
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.draw(4);
  pass.end();
};
```

### Phase 6：流体模拟逻辑（4-6 小时）

**目标**：实现 splat、advection、divergence、pressure solve、gradient subtract

每个步骤需要：
1. 创建对应的渲染管线
2. 创建绑定组（包含输入纹理、uniforms）
3. 执行渲染 pass

#### 6.1 Splat 步骤

```typescript
const splat = (
  encoder: GPUCommandEncoder,
  position: vec2f,
  velocity: vec2f,
  color: vec3f,
  radius: number
) => {
  // 1. 渲染到 velocity texture
  const velocityBindGroup = createBindGroup(device, splatPipeline.getBindGroupLayout(0), [
    { binding: 0, resource: { texture: velocity.read.createView() } },
    { binding: 1, resource: sampler },
    { binding: 2, resource: { buffer: splatUniforms } },
  ]);
  blit(encoder, splatPipeline, velocityBindGroup, quadBuffer, velocity.write, simWidth, simHeight);
  velocity.swap();
  
  // 2. 渲染到 dye texture
  const dyeBindGroup = createBindGroup(device, splatPipeline.getBindGroupLayout(0), [
    { binding: 0, resource: { texture: dye.read.createView() } },
    { binding: 1, resource: sampler },
    { binding: 2, resource: { buffer: dyeSplatUniforms } },
  ]);
  blit(encoder, splatPipeline, dyeBindGroup, quadBuffer, dye.write, dyeWidth, dyeHeight);
  dye.swap();
};
```

### Phase 7：动画循环与集成（2-3 小时）

**目标**：重构渲染循环，集成帧率监控和降级逻辑

```typescript
const animate = () => {
  const commandEncoder = device.createCommandEncoder();
  
  if (pointerMoved) {
    splat(commandEncoder, pointerX, pointerY, pointerDX, pointerDY, color);
    pointerMoved = false;
  }
  
  step(commandEncoder, dt);
  render(commandEncoder);
  
  queue.submit([commandEncoder.finish()]);
  requestAnimationFrame(animate);
};
```

### Phase 8：回退机制与测试（1-2 小时）

**目标**：WebGPU 不可用时回退到 WebGL

```typescript
export default function FluidCanvas() {
  const [renderer, setRenderer] = useState<'webgpu' | 'webgl' | null>(null);
  
  useEffect(() => {
    const init = async () => {
      if (isWebGPUSupported()) {
        const gpu = await requestWebGPU();
        if (gpu) {
          setRenderer('webgpu');
          // 初始化 WebGPU 渲染
          return;
        }
      }
      // 回退到 WebGL
      setRenderer('webgl');
      // 初始化 WebGL 渲染（现有代码）
    };
    init();
  }, []);
  
  // 根据 renderer 状态渲染对应的 canvas
}
```

## 预计时间线

| 阶段 | 时间 | 关键交付物 |
|------|------|------------|
| Phase 1 | 1-2h | WebGPU 检测工具、类型配置 |
| Phase 2 | 3-4h | WebGPURenderer 基础架构 |
| Phase 3 | 4-6h | 7 个着色器的 WGSL 转换 |
| Phase 4 | 4-5h | 纹理、管线、绑定组管理 |
| Phase 5 | 3-4h | 全屏渲染、blit 函数 |
| Phase 6 | 4-6h | 完整流体模拟逻辑 |
| Phase 7 | 2-3h | 动画循环、帧率监控 |
| Phase 8 | 1-2h | 回退机制、测试 |
| **总计** | **21-32h** | |

## 风险与注意事项

### 兼容性风险
- **浏览器支持**：WebGPU 在 Chrome 113+、Edge 113+、Safari 16.4+ 支持
- **回退策略**：必须保留 WebGL 作为备选方案

### 性能风险
- **着色器编译**：WGSL 编译时间可能比 GLSL 长
- **内存管理**：WebGPU 需要显式释放资源（device.destroy()）

### 调试建议
1. 使用 Chrome DevTools 的 WebGPU 面板
2. 添加错误处理和调试日志
3. 逐步验证每个渲染 pass

## 优化机会

迁移到 WebGPU 后，可以进行以下优化：

1. **计算着色器**：将 pressure solve 改为计算着色器，利用 GPU 并行计算
2. **多帧缓冲**：使用 WebGPU 的 render bundle 优化批处理
3. **纹理压缩**：使用 BC1/BC3 等压缩纹理格式
4. **多采样抗锯齿**：原生 MSAA 支持

---

**下一步**：是否需要我开始实现？建议从 Phase 1 和 Phase 2 开始，先搭建基础架构。