import WebGPURenderer from '../WebGPURenderer';

export const createBuffer = (renderer: WebGPURenderer, arr: Float32Array | Uint32Array, usage: number) => {
    const desc = {
        size: (arr.byteLength + 3) & ~3,
        usage,
        mappedAtCreation: true
    };
    const buffer = renderer.device.createBuffer(desc);
    const writeArray =
        arr instanceof Uint32Array
            ? new Uint32Array(buffer.getMappedRange())
            : new Float32Array(buffer.getMappedRange());
    writeArray.set(arr);
    buffer.unmap();
    return buffer;
};

export const reserveBuffer = (renderer: WebGPURenderer, size: number, usage: number) => {
    const desc = {
        size: (size + 3) & ~3,
        usage,
        mappedAtCreation: false
    };
    return renderer.device.createBuffer(desc);
};
