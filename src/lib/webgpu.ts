export interface WebGPUDeviceInfo {
  adapter: GPUAdapter;
  device: GPUDevice;
  queue: GPUQueue;
}

export const isWebGPUSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
};

export const requestWebGPU = async (): Promise<WebGPUDeviceInfo | null> => {
  if (!isWebGPUSupported()) {
    return null;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return null;
    }

    const device = await adapter.requestDevice({
      requiredFeatures: [],
      requiredLimits: {},
    });

    return {
      adapter,
      device,
      queue: device.queue,
    };
  } catch {
    return null;
  }
};

export const getPreferredFormat = (): GPUTextureFormat => {
  if (!isWebGPUSupported()) {
    return 'rgba8unorm';
  }
  return navigator.gpu.getPreferredCanvasFormat();
};

export const createSampler = (device: GPUDevice): GPUSampler => {
  return device.createSampler({
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
    magFilter: 'linear',
    minFilter: 'linear',
  });
};

export const createFullscreenQuad = (device: GPUDevice): GPUBuffer => {
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

export const createUniformBuffer = (device: GPUDevice, data: Float32Array): GPUBuffer => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(buffer.getMappedRange()).set(data);
  buffer.unmap();
  return buffer;
};

export const updateUniformBuffer = (queue: GPUQueue, buffer: GPUBuffer, data: Float32Array): void => {
  queue.writeBuffer(buffer, 0, data.buffer as ArrayBuffer, data.byteOffset, data.byteLength);
};