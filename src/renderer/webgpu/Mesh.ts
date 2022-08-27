import { IMesh } from '../generic/IMesh';
import Renderer from './Renderer';
import { createBuffer } from './utils/Utils';

export class Mesh extends IMesh {
    private readonly renderer: Renderer;

    private readonly attributeBuffers: Map<number, GPUBuffer>;
    private indicesBuffer: GPUBuffer;
    private indicesBufferLength: number;

    constructor(renderer: Renderer) {
        super();

        this.attributeBuffers = new Map<number, GPUBuffer>();

        this.renderer = renderer;
    }

    declareAttributeBuffer(index: number, data: Float32Array | Uint32Array, elementsForEachVtx: number | undefined = undefined): void {
        this.attributeBuffers.set(index, createBuffer(this.renderer, data, GPUBufferUsage.VERTEX));
    }

    declareIndexBuffer(data: Uint32Array): void {
        this.indicesBuffer = createBuffer(this.renderer, data, GPUBufferUsage.INDEX);
        this.indicesBufferLength = data.length;
    }

    draw(): void {
        const encoder = this.renderer.passEncoder;
        if (!encoder) throw 'Encoder currently undefined!';

        this.attributeBuffers.forEach((value, key) => encoder.setVertexBuffer(key, value));
        encoder.setIndexBuffer(this.indicesBuffer, 'uint32');
        encoder.drawIndexed(this.indicesBufferLength);
    }
}
