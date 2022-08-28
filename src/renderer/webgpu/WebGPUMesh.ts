import { IMeshAdapter } from '../generic/IMeshAdapter';
import WebGPURenderer from './WebGPURenderer';
import { createBuffer } from './utils/Utils';
import { Mesh } from '../abstract/Mesh';

export class WebGPUMesh extends IMeshAdapter {
    private readonly renderer: WebGPURenderer;

    private readonly attributeBuffers: Map<number, GPUBuffer>;
    private indicesBuffer: GPUBuffer;
    private indicesBufferLength: number;

    constructor(renderer: WebGPURenderer, meshDescription: Mesh) {
        super();
        this.attributeBuffers = new Map<number, GPUBuffer>();
        this.renderer = renderer;

        this.restoreMeshFromDescription(meshDescription);
    }

    private restoreMeshFromDescription(meshDescription: Mesh) {
        meshDescription.attributeBuffers.forEach((desc) => {
            this.declareAttributeBuffer(desc.index, desc.data, desc.elementsForVtx);
        });

        this.declareIndexBuffer(meshDescription.indexesBuffer);
    }

    declareAttributeBuffer(
        index: number,
        data: Float32Array | Uint32Array,
        elementsForEachVtx: number | undefined = undefined
    ): void {
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
