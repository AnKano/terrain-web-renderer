import Renderer from '../Renderer';

export const createBuffer = (renderer: Renderer, arr: Float32Array | Uint32Array, usage: number) => {
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

export const reserveBuffer = (renderer: Renderer, size: number, usage: number) => {
    const desc = {
        size: (size + 3) & ~3,
        usage,
        mappedAtCreation: false
    };
    return renderer.device.createBuffer(desc);
};