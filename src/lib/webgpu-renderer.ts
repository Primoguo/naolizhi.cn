import {
  requestWebGPU,
  getPreferredFormat,
  createSampler,
  createFullscreenQuad,
} from './webgpu';

export interface TexturePair {
  read: GPUTexture;
  write: GPUTexture;
  swap: () => void;
}

export interface FluidRendererOptions {
  simResolution?: number;
  dyeResolution?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  pressureIterations?: number;
  splatRadius?: number;
  splatForce?: number;
}

const roundTo256 = (size: number): number => {
  return Math.ceil(size / 256) * 256;
};

export class FluidRenderer {
  private canvas: HTMLCanvasElement;
  private device: GPUDevice;
  private queue: GPUQueue;
  private context: GPUCanvasContext;
  private format: GPUTextureFormat;
  private sampler: GPUSampler;
  private quadBuffer: GPUBuffer;

  private velocity!: TexturePair;
  private dye!: TexturePair;
  private divergence!: GPUTexture;
  private pressure!: TexturePair;

  private simWidth!: number;
  private simHeight!: number;
  private dyeWidth!: number;
  private dyeHeight!: number;

  private splatPipeline!: GPURenderPipeline;
  private advectionPipeline!: GPURenderPipeline;
  private divergencePipeline!: GPURenderPipeline;
  private pressurePipeline!: GPURenderPipeline;
  private gradientSubtractPipeline!: GPURenderPipeline;
  private displayPipeline!: GPURenderPipeline;

  private advectionUniformBuffer: GPUBuffer;
  private divergenceUniformBuffer: GPUBuffer;
  private pressureUniformBuffer: GPUBuffer;
  private gradientSubtractUniformBuffer: GPUBuffer;

  private params: FluidRendererOptions;

  private constructor(
    canvas: HTMLCanvasElement,
    device: GPUDevice,
    queue: GPUQueue,
    options: FluidRendererOptions
  ) {
    this.canvas = canvas;
    this.device = device;
    this.queue = queue;
    this.params = {
      simResolution: 128,
      dyeResolution: 512,
      densityDissipation: 0.94,
      velocityDissipation: 0.96,
      pressureIterations: 20,
      splatRadius: 0.25,
      splatForce: 2500,
      ...options,
    };

    this.context = canvas.getContext('webgpu')!;
    this.format = getPreferredFormat();
    this.sampler = createSampler(device);
    this.quadBuffer = createFullscreenQuad(device);

    const vec4BufferSize = roundTo256(new Float32Array([0, 0, 0, 0]).byteLength);
    const vec2BufferSize = roundTo256(new Float32Array([0, 0]).byteLength);

    this.advectionUniformBuffer = this.device.createBuffer({
      size: vec4BufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.divergenceUniformBuffer = this.device.createBuffer({
      size: vec2BufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.pressureUniformBuffer = this.device.createBuffer({
      size: vec2BufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.gradientSubtractUniformBuffer = this.device.createBuffer({
      size: vec2BufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.context.configure({
      device,
      format: this.format,
      alphaMode: 'premultiplied',
    });

    this.initPipelines();
    this.resize();
  }

  public static async create(
    canvas: HTMLCanvasElement,
    options?: FluidRendererOptions
  ): Promise<FluidRenderer | null> {
    const gpu = await requestWebGPU();
    if (!gpu) return null;

    return new FluidRenderer(canvas, gpu.device, gpu.queue, options || {});
  }

  private initPipelines(): void {
    const vertexShader = this.device.createShaderModule({ code: vertexShaderCode });

    this.splatPipeline = this.createRenderPipeline(vertexShader, splatFragmentShader);
    this.advectionPipeline = this.createRenderPipeline(vertexShader, advectionFragmentShader);
    this.divergencePipeline = this.createRenderPipeline(vertexShader, divergenceFragmentShader);
    this.pressurePipeline = this.createRenderPipeline(vertexShader, pressureFragmentShader);
    this.gradientSubtractPipeline = this.createRenderPipeline(
      vertexShader,
      gradientSubtractFragmentShader
    );
    this.displayPipeline = this.createDisplayPipeline(vertexShader);
  }

  private createRenderPipeline(
    vertexShader: GPUShaderModule,
    fragmentShaderCode: string
  ): GPURenderPipeline {
    const fragmentShader = this.device.createShaderModule({ code: fragmentShaderCode });

    return this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: vertexShader,
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: 8,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: fragmentShader,
        entryPoint: 'main',
        targets: [{ format: 'rgba16float' }],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });
  }

  private createDisplayPipeline(vertexShader: GPUShaderModule): GPURenderPipeline {
    const fragmentShader = this.device.createShaderModule({ code: displayFragmentShader });

    return this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: vertexShader,
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: 8,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: fragmentShader,
        entryPoint: 'main',
        targets: [{ format: this.format }],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });
  }

  private createTexture(
    width: number,
    height: number,
    format: GPUTextureFormat = 'rgba16float'
  ): GPUTexture {
    return this.device.createTexture({
      size: { width, height },
      format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }

  private createTexturePair(
    width: number,
    height: number,
    format?: GPUTextureFormat
  ): TexturePair {
    let read = this.createTexture(width, height, format);
    let write = this.createTexture(width, height, format);
    return {
      read,
      write,
      swap: () => {
        [read, write] = [write, read];
      },
    };
  }

  private getResolution(resolution: number): { width: number; height: number } {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const adjustedAspect = aspectRatio < 1 ? 1.0 / aspectRatio : aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * adjustedAspect);
    return this.canvas.width > this.canvas.height
      ? { width: max, height: min }
      : { width: min, height: max };
  }

  public resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.canvas.clientWidth * dpr;
    this.canvas.height = this.canvas.clientHeight * dpr;

    const simRes = this.getResolution(this.params.simResolution!);
    const dyeRes = this.getResolution(this.params.dyeResolution!);

    this.simWidth = simRes.width;
    this.simHeight = simRes.height;
    this.dyeWidth = dyeRes.width;
    this.dyeHeight = dyeRes.height;

    this.velocity = this.createTexturePair(this.simWidth, this.simHeight);
    this.dye = this.createTexturePair(this.dyeWidth, this.dyeHeight);
    this.divergence = this.createTexture(this.simWidth, this.simHeight);
    this.pressure = this.createTexturePair(this.simWidth, this.simHeight);

    const texelSizeX = 1.0 / this.simWidth;
    const texelSizeY = 1.0 / this.simHeight;

    this.queue.writeBuffer(this.divergenceUniformBuffer, 0, new Float32Array([texelSizeX, texelSizeY]));
    this.queue.writeBuffer(this.pressureUniformBuffer, 0, new Float32Array([texelSizeX, texelSizeY]));
    this.queue.writeBuffer(this.gradientSubtractUniformBuffer, 0, new Float32Array([texelSizeX, texelSizeY]));
  }

  public splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]): void {
    const encoder = this.device.createCommandEncoder();

    const paramsBuffer = this.device.createBuffer({
      size: roundTo256(new Float32Array([0, 0, 0, 0]).byteLength),
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const colorBuffer = this.device.createBuffer({
      size: roundTo256(new Float32Array([0, 0, 0]).byteLength),
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.queue.writeBuffer(paramsBuffer, 0, new Float32Array([
      x,
      y,
      this.canvas.width / this.canvas.height,
      this.params.splatRadius! / 100.0,
    ]));

    this.queue.writeBuffer(colorBuffer, 0, new Float32Array([dx, dy, 0.0]));

    const velocityBindGroup = this.device.createBindGroup({
      layout: this.splatPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { view: this.velocity.read.createView() } as unknown as GPUBindingResource },
        { binding: 1, resource: this.sampler as unknown as GPUBindingResource },
        { binding: 2, resource: { buffer: paramsBuffer, offset: 0, size: paramsBuffer.size } as unknown as GPUBindingResource },
        { binding: 3, resource: { buffer: colorBuffer, offset: 0, size: colorBuffer.size } as unknown as GPUBindingResource },
      ],
    });

    const velocityPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.velocity.write.createView(),
          loadOp: 'load',
          storeOp: 'store',
        },
      ],
    });
    velocityPass.setPipeline(this.splatPipeline);
    velocityPass.setBindGroup(0, velocityBindGroup);
    velocityPass.setVertexBuffer(0, this.quadBuffer);
    velocityPass.draw(4);
    velocityPass.end();

    this.velocity.swap();

    this.queue.writeBuffer(colorBuffer, 0, new Float32Array([color[0], color[1], color[2]]));

    const dyeBindGroup = this.device.createBindGroup({
      layout: this.splatPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { view: this.dye.read.createView() } as unknown as GPUBindingResource },
        { binding: 1, resource: this.sampler as unknown as GPUBindingResource },
        { binding: 2, resource: { buffer: paramsBuffer, offset: 0, size: paramsBuffer.size } as unknown as GPUBindingResource },
        { binding: 3, resource: { buffer: colorBuffer, offset: 0, size: colorBuffer.size } as unknown as GPUBindingResource },
      ],
    });

    const dyePass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.dye.write.createView(),
          loadOp: 'load',
          storeOp: 'store',
        },
      ],
    });
    dyePass.setPipeline(this.splatPipeline);
    dyePass.setBindGroup(0, dyeBindGroup);
    dyePass.setVertexBuffer(0, this.quadBuffer);
    dyePass.draw(4);
    dyePass.end();

    this.dye.swap();

    this.queue.submit([encoder.finish()]);

    paramsBuffer.destroy();
    colorBuffer.destroy();
  }

  public step(dt: number): void {
    const encoder = this.device.createCommandEncoder();

    this.queue.writeBuffer(this.advectionUniformBuffer, 0, new Float32Array([
      1.0 / this.simWidth,
      1.0 / this.simHeight,
      dt,
      this.params.velocityDissipation!,
    ]));

    const velocityAdvectionBindGroup = this.device.createBindGroup({
      layout: this.advectionPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { view: this.velocity.read.createView() } as unknown as GPUBindingResource },
        { binding: 1, resource: { view: this.velocity.read.createView() } as unknown as GPUBindingResource },
        { binding: 2, resource: this.sampler as unknown as GPUBindingResource },
        { binding: 3, resource: { buffer: this.advectionUniformBuffer, offset: 0, size: this.advectionUniformBuffer.size } as unknown as GPUBindingResource },
      ],
    });

    const velocityAdvectionPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.velocity.write.createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store',
        },
      ],
    });
    velocityAdvectionPass.setPipeline(this.advectionPipeline);
    velocityAdvectionPass.setBindGroup(0, velocityAdvectionBindGroup);
    velocityAdvectionPass.setVertexBuffer(0, this.quadBuffer);
    velocityAdvectionPass.draw(4);
    velocityAdvectionPass.end();

    this.velocity.swap();

    this.queue.writeBuffer(this.advectionUniformBuffer, 0, new Float32Array([
      1.0 / this.dyeWidth,
      1.0 / this.dyeHeight,
      dt,
      this.params.densityDissipation!,
    ]));

    const dyeAdvectionBindGroup = this.device.createBindGroup({
      layout: this.advectionPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { view: this.velocity.read.createView() } as unknown as GPUBindingResource },
        { binding: 1, resource: { view: this.dye.read.createView() } as unknown as GPUBindingResource },
        { binding: 2, resource: this.sampler as unknown as GPUBindingResource },
        { binding: 3, resource: { buffer: this.advectionUniformBuffer, offset: 0, size: this.advectionUniformBuffer.size } as unknown as GPUBindingResource },
      ],
    });

    const dyeAdvectionPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.dye.write.createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store',
        },
      ],
    });
    dyeAdvectionPass.setPipeline(this.advectionPipeline);
    dyeAdvectionPass.setBindGroup(0, dyeAdvectionBindGroup);
    dyeAdvectionPass.setVertexBuffer(0, this.quadBuffer);
    dyeAdvectionPass.draw(4);
    dyeAdvectionPass.end();

    this.dye.swap();

    const divergenceBindGroup = this.device.createBindGroup({
      layout: this.divergencePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { view: this.velocity.read.createView() } as unknown as GPUBindingResource },
        { binding: 1, resource: { buffer: this.divergenceUniformBuffer, offset: 0, size: this.divergenceUniformBuffer.size } as unknown as GPUBindingResource },
      ],
    });

    const divergencePass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.divergence.createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store',
        },
      ],
    });
    divergencePass.setPipeline(this.divergencePipeline);
    divergencePass.setBindGroup(0, divergenceBindGroup);
    divergencePass.setVertexBuffer(0, this.quadBuffer);
    divergencePass.draw(4);
    divergencePass.end();

    for (let i = 0; i < this.params.pressureIterations!; i++) {
      const pressureReadBindGroup = this.device.createBindGroup({
        layout: this.pressurePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { view: this.divergence.createView() } as unknown as GPUBindingResource },
          { binding: 1, resource: { buffer: this.pressureUniformBuffer, offset: 0, size: this.pressureUniformBuffer.size } as unknown as GPUBindingResource },
          { binding: 2, resource: { view: this.pressure.read.createView() } as unknown as GPUBindingResource },
          { binding: 3, resource: this.sampler as unknown as GPUBindingResource },
        ],
      });

      const pressurePass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: this.pressure.write.createView(),
            loadOp: 'clear',
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            storeOp: 'store',
          },
        ],
      });
      pressurePass.setPipeline(this.pressurePipeline);
      pressurePass.setBindGroup(0, pressureReadBindGroup);
      pressurePass.setVertexBuffer(0, this.quadBuffer);
      pressurePass.draw(4);
      pressurePass.end();

      this.pressure.swap();
    }

    const gradientSubtractBindGroup = this.device.createBindGroup({
      layout: this.gradientSubtractPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { view: this.pressure.read.createView() } as unknown as GPUBindingResource },
        { binding: 1, resource: { view: this.velocity.read.createView() } as unknown as GPUBindingResource },
        { binding: 2, resource: { buffer: this.gradientSubtractUniformBuffer, offset: 0, size: this.gradientSubtractUniformBuffer.size } as unknown as GPUBindingResource },
        { binding: 3, resource: this.sampler as unknown as GPUBindingResource },
      ],
    });

    const gradientSubtractPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.velocity.write.createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store',
        },
      ],
    });
    gradientSubtractPass.setPipeline(this.gradientSubtractPipeline);
    gradientSubtractPass.setBindGroup(0, gradientSubtractBindGroup);
    gradientSubtractPass.setVertexBuffer(0, this.quadBuffer);
    gradientSubtractPass.draw(4);
    gradientSubtractPass.end();

    this.velocity.swap();

    this.queue.submit([encoder.finish()]);
  }

  public render(): void {
    const encoder = this.device.createCommandEncoder();

    const displayBindGroup = this.device.createBindGroup({
      layout: this.displayPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { view: this.dye.read.createView() } as unknown as GPUBindingResource },
        { binding: 1, resource: this.sampler as unknown as GPUBindingResource },
      ],
    });

    const displayPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          storeOp: 'store',
        },
      ],
    });
    displayPass.setPipeline(this.displayPipeline);
    displayPass.setBindGroup(0, displayBindGroup);
    displayPass.setVertexBuffer(0, this.quadBuffer);
    displayPass.draw(4);
    displayPass.end();

    this.queue.submit([encoder.finish()]);
  }

  public destroy(): void {
    this.quadBuffer.destroy();
    this.advectionUniformBuffer.destroy();
    this.divergenceUniformBuffer.destroy();
    this.pressureUniformBuffer.destroy();
    this.gradientSubtractUniformBuffer.destroy();

    this.velocity.read.destroy();
    this.velocity.write.destroy();
    this.dye.read.destroy();
    this.dye.write.destroy();
    this.divergence.destroy();
    this.pressure.read.destroy();
    this.pressure.write.destroy();
  }
}

const vertexShaderCode = `
@vertex
fn main(@location(0) aPosition: vec2f) -> @builtin(position) vec4f {
  return vec4f(aPosition, 0.0, 1.0);
}
`;

const splatFragmentShader = `
@fragment
fn main(
  @location(0) vUv: vec2f,
  @binding(0) @group(0) uTarget: texture_2d<f32>,
  @binding(1) @group(0) uSampler: sampler,
  @binding(2) @group(0) uParams: vec4f,
  @binding(3) @group(0) uColor: vec3f
) -> @location(0) vec4f {
  let point = vec2f(uParams.x, uParams.y);
  let aspectRatio = uParams.z;
  let radius = uParams.w;
  
  var p = vUv - point;
  p.x *= aspectRatio;
  let splat = exp(-dot(p, p) / radius);
  let base = textureSample(uTarget, uSampler, vUv);
  return vec4f(base.xyz + splat * uColor, 1.0);
}
`;

const advectionFragmentShader = `
@fragment
fn main(
  @location(0) vUv: vec2f,
  @binding(0) @group(0) uVelocity: texture_2d<f32>,
  @binding(1) @group(0) uSource: texture_2d<f32>,
  @binding(2) @group(0) uSampler: sampler,
  @binding(3) @group(0) uParams: vec4f
) -> @location(0) vec4f {
  let texelSize = vec2f(uParams.x, uParams.y);
  let dt = uParams.z;
  let dissipation = uParams.w;
  
  let coord = vUv - dt * textureSample(uVelocity, uSampler, vUv).xy * texelSize;
  return vec4f(dissipation * textureSample(uSource, uSampler, coord).xyz, 1.0);
}
`;

const divergenceFragmentShader = `
@fragment
fn main(
  @location(0) vUv: vec2f,
  @binding(0) @group(0) uVelocity: texture_2d<f32>,
  @binding(1) @group(0) uTexelSize: vec2f
) -> @location(0) vec4f {
  let texelSize = uTexelSize;
  let dims = vec2f(textureDimensions(uVelocity));
  let L = textureLoad(uVelocity, vec2i(vUv * dims - vec2f(0.5)), 0).x;
  let R = textureLoad(uVelocity, vec2i(vUv * dims + vec2f(0.5)), 0).x;
  let T = textureLoad(uVelocity, vec2i(vUv * dims - vec2f(0.5)), 0).y;
  let B = textureLoad(uVelocity, vec2i(vUv * dims + vec2f(0.5)), 0).y;
  
  let div = 0.5 * (R - L + T - B);
  return vec4f(div, 0.0, 0.0, 1.0);
}
`;

const pressureFragmentShader = `
@fragment
fn main(
  @location(0) vUv: vec2f,
  @binding(0) @group(0) uDivergence: texture_2d<f32>,
  @binding(1) @group(0) uTexelSize: vec2f,
  @binding(2) @group(0) uPressure: texture_2d<f32>,
  @binding(3) @group(0) uSampler: sampler
) -> @location(0) vec4f {
  let texelSize = uTexelSize;
  let dims = vec2f(textureDimensions(uPressure));
  
  let L = textureLoad(uPressure, vec2i(vUv * dims - vec2f(0.5)), 0).x;
  let R = textureLoad(uPressure, vec2i(vUv * dims + vec2f(0.5)), 0).x;
  let T = textureLoad(uPressure, vec2i(vUv * dims - vec2f(0.5)), 0).x;
  let B = textureLoad(uPressure, vec2i(vUv * dims + vec2f(0.5)), 0).x;
  
  let divergence = textureSample(uDivergence, uSampler, vUv).x;
  let pressure = (L + R + B + T - divergence) * 0.25;
  return vec4f(pressure, 0.0, 0.0, 1.0);
}
`;

const gradientSubtractFragmentShader = `
@fragment
fn main(
  @location(0) vUv: vec2f,
  @binding(0) @group(0) uPressure: texture_2d<f32>,
  @binding(1) @group(0) uVelocity: texture_2d<f32>,
  @binding(2) @group(0) uTexelSize: vec2f,
  @binding(3) @group(0) uSampler: sampler
) -> @location(0) vec4f {
  let texelSize = uTexelSize;
  let dims = vec2f(textureDimensions(uPressure));
  
  let L = textureLoad(uPressure, vec2i(vUv * dims - vec2f(0.5)), 0).x;
  let R = textureLoad(uPressure, vec2i(vUv * dims + vec2f(0.5)), 0).x;
  let T = textureLoad(uPressure, vec2i(vUv * dims - vec2f(0.5)), 0).x;
  let B = textureLoad(uPressure, vec2i(vUv * dims + vec2f(0.5)), 0).x;
  
  var velocity = textureSample(uVelocity, uSampler, vUv).xy;
  velocity -= vec2f(R - L, T - B);
  return vec4f(velocity, 0.0, 1.0);
}
`;

const displayFragmentShader = `
@fragment
fn main(
  @location(0) vUv: vec2f,
  @binding(0) @group(0) uTexture: texture_2d<f32>,
  @binding(1) @group(0) uSampler: sampler
) -> @location(0) vec4f {
  let c = textureSample(uTexture, uSampler, vUv).rgb;
  let a = max(c.r, max(c.g, c.b));
  return vec4f(c, a);
}
`;